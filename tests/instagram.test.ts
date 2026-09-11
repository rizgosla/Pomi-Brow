// Core Instagram module. Runs under `node --test`; Node 24 strips the types itself.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  altFromCaption,
  normalizePosts,
  needsRefresh,
  loadPosts,
  refreshToken,
  InstagramError,
  type MediaResponse,
  type TokenRecord,
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
  assert.equal(url.searchParams.get("limit"), "4");
  assert.equal(url.searchParams.get("access_token"), "abc def");
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
