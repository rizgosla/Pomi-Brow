// Core Instagram module. Runs under `node --test`; Node 24 strips the types itself.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  altFromCaption,
  normalizePosts,
  needsRefresh,
  loadPosts,
  refreshToken,
  resolveToken,
  TOKEN_KEY,
  InstagramError,
  type MediaResponse,
  type MediaItem,
  type TokenRecord,
  type KvLike,
} from "../src/lib/instagram.ts";

const HANDLE = "pomib.browstudio";

/** A fetch stub that records every URL and answers with one canned response. */
function stubFetch(body: string, status = 200) {
  const calls: string[] = [];
  const fetchLike = async (url: string) => {
    calls.push(url);
    return new Response(body, { status, headers: { "content-type": "application/json" } });
  };
  return { fetchLike, calls };
}

const item = (over: Record<string, unknown> = {}) => ({
  id: "1",
  caption: "Healed microblading, six weeks on #microblading @someone",
  media_type: "IMAGE",
  media_url: "https://cdn.example/1.jpg",
  permalink: "https://www.instagram.com/p/one/",
  timestamp: "2026-09-04T18:00:00+0000",
  ...over,
});

test("altFromCaption strips hashtags and mentions, keeps the first line", () => {
  assert.equal(altFromCaption("Healed brows #pmu @pomi\nSecond line", HANDLE), "Healed brows");
});

test("altFromCaption falls back when the caption is empty or only tags", () => {
  assert.equal(altFromCaption(undefined, HANDLE), "New post from @pomib.browstudio");
  assert.equal(altFromCaption("#brows #pmu", HANDLE), "New post from @pomib.browstudio");
});

test("altFromCaption uses the first non-empty line", () => {
  assert.equal(altFromCaption("\nHealed brows", HANDLE), "Healed brows");
});

test("altFromCaption trims long captions to 140 characters with an ellipsis", () => {
  const long = "x".repeat(200);
  const alt = altFromCaption(long, HANDLE);
  assert.equal(alt.length, 140);
  assert.ok(alt.endsWith("…"));
});

test("normalizePosts keeps images and albums, uses the thumbnail for video", () => {
  const json: MediaResponse = {
    data: [
      item(),
      item({ id: "2", media_type: "CAROUSEL_ALBUM", permalink: "https://www.instagram.com/p/two/" }),
      item({ id: "3", media_type: "VIDEO", media_url: "https://cdn.example/3.mp4", thumbnail_url: "https://cdn.example/3.jpg" }),
    ],
  };
  const posts = normalizePosts(json, 4, HANDLE);
  assert.deepEqual(
    posts.map((p) => [p.id, p.kind, p.image]),
    [
      ["1", "image", "https://cdn.example/1.jpg"],
      ["2", "album", "https://cdn.example/1.jpg"],
      ["3", "video", "https://cdn.example/3.jpg"],
    ]
  );
  assert.equal(posts[0].alt, "Healed microblading, six weeks on");
  assert.equal(posts[0].permalink, "https://www.instagram.com/p/one/");
});

test("normalizePosts drops unknown types and items missing an image or permalink", () => {
  const json: MediaResponse = {
    data: [
      item({ media_type: "STORY" }),
      item({ id: "2", media_url: undefined }),
      item({ id: "3", permalink: undefined }),
      item({ id: "4", media_type: "VIDEO", thumbnail_url: undefined }),
      item({ id: "5" }),
    ],
  };
  assert.deepEqual(normalizePosts(json, 4, HANDLE).map((p) => p.id), ["5"]);
});

test("normalizePosts keeps API order and stops at the limit; tolerates an empty body", () => {
  const json: MediaResponse = { data: ["a", "b", "c", "d", "e"].map((id) => item({ id })) };
  assert.deepEqual(normalizePosts(json, 4, HANDLE).map((p) => p.id), ["a", "b", "c", "d"]);
  assert.deepEqual(normalizePosts({}, 4, HANDLE), []);
});

test("normalizePosts skips a null item", () => {
  const json = { data: [null, item()] } as unknown as MediaResponse;
  assert.deepEqual(normalizePosts(json, 4, HANDLE).map((p) => p.id), ["1"]);
});

test("needsRefresh: missing, stale, or unparseable records need a refresh; fresh ones do not", () => {
  const now = new Date("2026-09-10T12:00:00Z");
  const rec = (daysAgo: number): TokenRecord => ({
    token: "t",
    expiresAt: "2026-11-01T00:00:00Z",
    refreshedAt: new Date(now.getTime() - daysAgo * 86_400_000).toISOString(),
  });
  assert.equal(needsRefresh(null, now), true);
  assert.equal(needsRefresh(undefined, now), true);
  assert.equal(needsRefresh(rec(1), now), false);
  assert.equal(needsRefresh(rec(6.9), now), false);
  assert.equal(needsRefresh(rec(7.1), now), true);
  assert.equal(needsRefresh({ ...rec(1), refreshedAt: "nonsense" }, now), true);
});

test("loadPosts requests the documented fields and returns normalized posts", async () => {
  const { fetchLike, calls } = stubFetch(JSON.stringify({ data: [item()] }));
  const posts = await loadPosts({ token: "abc def", limit: 4, handle: HANDLE, fetch: fetchLike });
  assert.equal(posts.length, 1);
  assert.equal(calls.length, 1);
  const url = new URL(calls[0]);
  assert.equal(url.origin + url.pathname, "https://graph.instagram.com/me/media");
  assert.equal(url.searchParams.get("fields"), "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp");
  assert.equal(url.searchParams.get("limit"), "8");
  assert.equal(url.searchParams.get("access_token"), "abc def");
});

test("loadPosts asks Meta for headroom over the limit so dropped items still fill the grid", async () => {
  const items = ["1", "2", "3", "4", "5", "6"].map((id) =>
    id === "2" ? item({ id, media_url: undefined }) : item({ id })
  );
  const { fetchLike } = stubFetch(JSON.stringify({ data: items }));
  const posts = await loadPosts({ token: "t", limit: 4, handle: HANDLE, fetch: fetchLike });
  assert.deepEqual(posts.map((p) => p.id), ["1", "3", "4", "5"]);
});

test("loadPosts throws an upstream InstagramError on a non-2xx response", async () => {
  const { fetchLike } = stubFetch(JSON.stringify({ error: { message: "bad token" } }), 400);
  await assert.rejects(
    loadPosts({ token: "t", limit: 4, handle: HANDLE, fetch: fetchLike }),
    (err: unknown) => err instanceof InstagramError && err.reason === "upstream" && err.status === 400
  );
});

test("loadPosts throws a bad-json InstagramError on unparseable JSON", async () => {
  const { fetchLike } = stubFetch("<html>", 200);
  await assert.rejects(
    loadPosts({ token: "t", limit: 4, handle: HANDLE, fetch: fetchLike }),
    (err: unknown) => err instanceof InstagramError && err.reason === "bad-json"
  );
});

test("refreshToken returns a record dated from now with the reported lifetime", async () => {
  const { fetchLike, calls } = stubFetch(JSON.stringify({ access_token: "new", token_type: "bearer", expires_in: 5_184_000 }));
  const now = new Date("2026-09-10T12:00:00Z");
  const rec = await refreshToken({ token: "old", fetch: fetchLike, now });
  assert.deepEqual(rec, {
    token: "new",
    refreshedAt: "2026-09-10T12:00:00.000Z",
    expiresAt: "2026-11-09T12:00:00.000Z",
  });
  const url = new URL(calls[0]);
  assert.equal(url.origin + url.pathname, "https://graph.instagram.com/refresh_access_token");
  assert.equal(url.searchParams.get("grant_type"), "ig_refresh_token");
  assert.equal(url.searchParams.get("access_token"), "old");
});

test("refreshToken rejects a response without a token", async () => {
  const { fetchLike } = stubFetch(JSON.stringify({ expires_in: 10 }));
  await assert.rejects(
    refreshToken({ token: "old", fetch: fetchLike }),
    (err: unknown) => err instanceof InstagramError && err.reason === "bad-json"
  );
});

/** A KV double that records puts and answers get() with whatever raw string it was seeded with. */
function fakeKv(raw: string | null) {
  const puts: Array<{ key: string; value: string }> = [];
  const kv: KvLike = {
    get: async (key: string) => raw,
    put: async (key: string, value: string) => {
      puts.push({ key, value });
    },
  };
  return { kv, puts };
}

const freshRefreshBody = JSON.stringify({ access_token: "fresh-token", expires_in: 5_184_000 });

test("resolveToken: no kv returns the env token as manual, no fetch call", async () => {
  const { fetchLike, calls } = stubFetch(freshRefreshBody);
  const result = await resolveToken({ envToken: "env-token", kv: undefined, fetch: fetchLike });
  assert.deepEqual(result, { token: "env-token", refresh: "manual" });
  assert.equal(calls.length, 0);
});

test("resolveToken: fresh KV record with matching (or absent) seed is used as-is", async () => {
  const now = new Date("2026-09-10T12:00:00Z");
  const record: TokenRecord = {
    token: "kv-token",
    refreshedAt: new Date(now.getTime() - 86_400_000).toISOString(),
    expiresAt: "2026-11-01T00:00:00Z",
  };
  const { kv, puts } = fakeKv(JSON.stringify(record));
  const { fetchLike, calls } = stubFetch(freshRefreshBody);
  const result = await resolveToken({ envToken: "env-token", kv, fetch: fetchLike, now });
  assert.deepEqual(result, { token: "kv-token", refresh: "auto" });
  assert.equal(calls.length, 0);
  assert.equal(puts.length, 0);

  const withMatchingSeed = { ...record, seed: "env-token" };
  const { kv: kv2 } = fakeKv(JSON.stringify(withMatchingSeed));
  const result2 = await resolveToken({ envToken: "env-token", kv: kv2, fetch: fetchLike, now });
  assert.deepEqual(result2, { token: "kv-token", refresh: "auto" });
});

test("resolveToken: stale KV record is refreshed from its own token and stored with the seed", async () => {
  const now = new Date("2026-09-10T12:00:00Z");
  const record: TokenRecord = {
    token: "stale-token",
    refreshedAt: new Date(now.getTime() - 8 * 86_400_000).toISOString(),
    expiresAt: "2026-11-01T00:00:00Z",
  };
  const { kv, puts } = fakeKv(JSON.stringify(record));
  const { fetchLike, calls } = stubFetch(freshRefreshBody);
  const result = await resolveToken({ envToken: "env-token", kv, fetch: fetchLike, now });
  assert.deepEqual(result, { token: "fresh-token", refresh: "auto" });
  const url = new URL(calls[0]);
  assert.equal(url.searchParams.get("access_token"), "stale-token");
  assert.equal(puts.length, 1);
  assert.equal(puts[0].key, TOKEN_KEY);
  const stored = JSON.parse(puts[0].value);
  assert.equal(stored.token, "fresh-token");
  assert.equal(stored.seed, "env-token");
});

test("resolveToken: no record, unparseable JSON, or a mismatched seed all refresh from envToken", async () => {
  const now = new Date("2026-09-10T12:00:00Z");
  const { fetchLike: fetchNull, calls: callsNull } = stubFetch(freshRefreshBody);
  const { kv: kvNull, puts: putsNull } = fakeKv(null);
  const rNull = await resolveToken({ envToken: "env-token", kv: kvNull, fetch: fetchNull, now });
  assert.deepEqual(rNull, { token: "fresh-token", refresh: "auto" });
  assert.equal(new URL(callsNull[0]).searchParams.get("access_token"), "env-token");
  assert.equal(JSON.parse(putsNull[0].value).seed, "env-token");

  const { fetchLike: fetchBad, calls: callsBad } = stubFetch(freshRefreshBody);
  const { kv: kvBad } = fakeKv("not json{");
  const rBad = await resolveToken({ envToken: "env-token", kv: kvBad, fetch: fetchBad, now });
  assert.deepEqual(rBad, { token: "fresh-token", refresh: "auto" });
  assert.equal(new URL(callsBad[0]).searchParams.get("access_token"), "env-token");

  const mismatched: TokenRecord & { seed: string } = {
    token: "kv-token",
    refreshedAt: now.toISOString(),
    expiresAt: "2026-11-01T00:00:00Z",
    seed: "old-env-token",
  };
  const { fetchLike: fetchMismatch, calls: callsMismatch } = stubFetch(freshRefreshBody);
  const { kv: kvMismatch } = fakeKv(JSON.stringify(mismatched));
  const rMismatch = await resolveToken({ envToken: "env-token", kv: kvMismatch, fetch: fetchMismatch, now });
  assert.deepEqual(rMismatch, { token: "fresh-token", refresh: "auto" });
  assert.equal(new URL(callsMismatch[0]).searchParams.get("access_token"), "env-token");
});

test("resolveToken: a refresh failure logs and keeps the current token", async () => {
  const now = new Date("2026-09-10T12:00:00Z");
  const { fetchLike } = stubFetch(JSON.stringify({ error: "nope" }), 400);

  const logsNoRecord: string[] = [];
  const { kv: kvNoRecord, puts: putsNoRecord } = fakeKv(null);
  const rNoRecord = await resolveToken({
    envToken: "env-token",
    kv: kvNoRecord,
    fetch: fetchLike,
    now,
    log: (m) => logsNoRecord.push(m),
  });
  assert.deepEqual(rNoRecord, { token: "env-token", refresh: "auto" });
  assert.equal(putsNoRecord.length, 0);
  assert.equal(logsNoRecord.length, 1);
  assert.match(logsNoRecord[0], /Instagram responded 400/);

  const stale: TokenRecord = {
    token: "stale-token",
    refreshedAt: new Date(now.getTime() - 8 * 86_400_000).toISOString(),
    expiresAt: "2026-11-01T00:00:00Z",
  };
  const logsStale: string[] = [];
  const { kv: kvStale, puts: putsStale } = fakeKv(JSON.stringify(stale));
  const rStale = await resolveToken({
    envToken: "env-token",
    kv: kvStale,
    fetch: fetchLike,
    now,
    log: (m) => logsStale.push(m),
  });
  assert.deepEqual(rStale, { token: "stale-token", refresh: "auto" });
  assert.equal(putsStale.length, 0);
  assert.equal(logsStale.length, 1);
});
