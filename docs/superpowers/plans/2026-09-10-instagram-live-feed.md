# Live Instagram Feed Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The home page "Recent work" section shows Pomi's four newest Instagram posts automatically, falling back to the CMS-picked photos whenever the feed is unavailable.

**Architecture:** A pure core module (`src/lib/instagram.ts`) talks to Meta's Instagram API through an injected `fetch`. A Cloudflare Pages Function (`/api/instagram`) wraps it with an edge cache and weekly token refresh into KV. The existing `InstagramGrid.astro` keeps server-rendering the CMS picks and adds a small script that swaps in live tiles cloned from a server-rendered `<template>`. A dev-only Astro integration serves the same route locally from a fixture.

**Tech Stack:** Astro 7 (static output), Cloudflare Pages Functions + KV + Cache API, Sanity schema, Node 24 `node --test` (native type stripping).

**Spec:** `docs/superpowers/specs/2026-09-10-instagram-live-feed-design.md`

## Global Constraints

- Meta endpoints, verbatim: `GET https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=…&access_token=…` and `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=…`.
- Four tiles. Cache headers on success: `public, max-age=300, s-maxage=3600`. Failures: `no-store`.
- Token refresh when the stored record is missing or older than 7 days. Refresh failure keeps the current token.
- The token never goes in Sanity or in the seed JSON.
- `src/lib/instagram.ts` must use only type-level TypeScript (no `enum`, no parameter properties, no `namespace`) because Node 24 strips types without transforming them.
- Test files import the core with an explicit `.ts` extension (Node requires it); `tests/` is excluded from `tsconfig.json` so `astro check` does not object.
- Copy: lede reads "Pomi posts new results most weeks. The newest are here; the feed is the whole portfolio." Live tile caption: service slot "Instagram", detail slot the post date like "Sep 4".
- Cloned tiles get `class="reveal is-in"` directly (the reveal observer in `src/layouts/Base.astro` only watches nodes present at load).
- House style: `node:`-prefixed builtins, `//` comment headers that explain why, no new dependencies.
- Commit after each task. Commit trailer:
  ```
  Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01WmNAkrEXQ4v2h8cLL8Xu81
  ```

## File map

| File | Responsibility |
|---|---|
| `src/lib/instagram.ts` (new) | Pure core: types, `normalizePosts`, `altFromCaption`, `loadPosts`, `refreshToken`, `needsRefresh`, `InstagramError`. |
| `tests/instagram.test.ts` (new) | `node --test` coverage of the core with a stubbed `fetch`. |
| `tests/fixtures/instagram-media.json` (new) | Sample Meta `/me/media` response, four items, local image paths. Used by the dev route. |
| `functions/api/instagram.ts` (new) | Pages Function: cache, token resolution/refresh, JSON responses. |
| `astro.config.mjs` | Adds the dev-only `instagramDevRoute()` integration. |
| `cms/schema/siteSettings.ts` | `instagramLiveFeed` toggle; `instagramPicks` description. |
| `src/lib/content.ts` | `SiteSettings.instagramLiveFeed` in type, seed normalizer, Sanity getter. |
| `src/content/seed/siteSettings.json` | `"instagramLiveFeed": true`. |
| `src/components/InstagramGrid.astro` | Lede copy, `data-ig-*` attributes, `<template>`, swap script. |
| `package.json`, `tsconfig.json` | `test` script; exclude `tests`. |
| `.env.example`, `PRODUCT.md` | Token setup steps; stack note. |

---

### Task 1: Core module with tests

**Files:**
- Create: `src/lib/instagram.ts`
- Create: `tests/instagram.test.ts`
- Modify: `package.json` (scripts), `tsconfig.json` (exclude)

**Interfaces:**
- Produces (used by Tasks 2 and 5):
  ```ts
  export type InstagramPostKind = "image" | "video" | "album";
  export interface InstagramPost { id: string; permalink: string; image: string; alt: string; timestamp: string; kind: InstagramPostKind }
  export interface MediaItem { id?: string; caption?: string; media_type?: string; media_url?: string; thumbnail_url?: string; permalink?: string; timestamp?: string }
  export interface MediaResponse { data?: MediaItem[] }
  export interface TokenRecord { token: string; expiresAt: string; refreshedAt: string }
  export interface FeedResponse { ok: true; posts: InstagramPost[]; handle: string; refresh: "auto" | "manual" | "fixture" }
  export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;
  export class InstagramError extends Error { reason: "upstream" | "bad-json"; status: number | undefined }
  export const REFRESH_AFTER_MS: number; // 7 days
  export function altFromCaption(caption: string | undefined, handle: string): string;
  export function normalizePosts(json: MediaResponse, limit: number, handle: string): InstagramPost[];
  export function loadPosts(opts: { token: string; limit: number; handle: string; fetch: FetchLike }): Promise<InstagramPost[]>;
  export function refreshToken(opts: { token: string; fetch: FetchLike; now?: Date }): Promise<TokenRecord>;
  export function needsRefresh(record: TokenRecord | null | undefined, now?: Date): boolean;
  ```

- [ ] **Step 1: Wire the test runner**

In `package.json` scripts add, after `"check"`:
```json
"test": "node --test \"tests/**/*.test.ts\"",
```
In `tsconfig.json` change `"exclude": ["dist", "node_modules"]` to `"exclude": ["dist", "node_modules", "tests"]`.

- [ ] **Step 2: Write the failing tests**

Create `tests/instagram.test.ts`:
```ts
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
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test`
Expected: FAIL, `Cannot find module '.../src/lib/instagram.ts'`.

- [ ] **Step 4: Write the core module**

Create `src/lib/instagram.ts`:
```ts
/**
 * Instagram feed core. Pure: no environment access and no global fetch, so the same code runs in
 * the Cloudflare Pages Function (functions/api/instagram.ts), the Astro dev route (astro.config.mjs)
 * and node --test. Meta retired the Basic Display API in December 2024; this targets the
 * "Instagram API with Instagram Login" on graph.instagram.com, which serves Business and Creator
 * accounts only.
 *
 * Node 24 runs this file with its types stripped, so it uses type-level TypeScript only.
 */

export type InstagramPostKind = "image" | "video" | "album";

/** What the home page grid needs for one tile. */
export interface InstagramPost {
  id: string;
  permalink: string;
  /** Instagram CDN URL. Signed and short-lived: the hourly refetch keeps it valid. */
  image: string;
  alt: string;
  timestamp: string;
  kind: InstagramPostKind;
}

/** One item of GET /me/media as Meta returns it. Only the fields we ask for are present. */
export interface MediaItem {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
}

export interface MediaResponse {
  data?: MediaItem[];
}

/** Stored in KV by the Pages Function. */
export interface TokenRecord {
  token: string;
  expiresAt: string;
  refreshedAt: string;
}

/** Body of a successful GET /api/instagram. */
export interface FeedResponse {
  ok: true;
  posts: InstagramPost[];
  handle: string;
  /** "auto": KV-backed weekly refresh. "manual": env token only. "fixture": dev sample. */
  refresh: "auto" | "manual" | "fixture";
}

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export class InstagramError extends Error {
  reason: "upstream" | "bad-json";
  status: number | undefined;
  constructor(reason: "upstream" | "bad-json", message: string, status?: number) {
    super(message);
    this.name = "InstagramError";
    this.reason = reason;
    this.status = status;
  }
}

export const GRAPH = "https://graph.instagram.com";
const MEDIA_FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
const ALT_MAX = 140;

/** Long-lived tokens last 60 days and cannot be refreshed in their first 24 hours. Weekly is safe. */
export const REFRESH_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

/** First line of the caption without hashtags or mentions, trimmed for an alt attribute. */
export function altFromCaption(caption: string | undefined, handle: string): string {
  const firstLine = (caption ?? "").split(/\r?\n/)[0] ?? "";
  const text = firstLine.replace(/[#@][\w.]+/g, "").replace(/\s+/g, " ").trim();
  if (!text) return `New post from @${handle}`;
  return text.length > ALT_MAX ? `${text.slice(0, ALT_MAX - 1).trimEnd()}…` : text;
}

function kindOf(mediaType: string | undefined): InstagramPostKind | null {
  switch (mediaType) {
    case "IMAGE":
      return "image";
    case "VIDEO":
      return "video";
    case "CAROUSEL_ALBUM":
      return "album";
    default:
      return null;
  }
}

/** Newest first, as Meta returns them. Drops anything a tile could not render. */
export function normalizePosts(json: MediaResponse, limit: number, handle: string): InstagramPost[] {
  const items = Array.isArray(json?.data) ? json.data : [];
  const posts: InstagramPost[] = [];
  for (const m of items) {
    const kind = kindOf(m.media_type);
    if (!kind) continue;
    const image = kind === "video" ? m.thumbnail_url : m.media_url;
    if (!image || !m.id || !m.permalink) continue;
    posts.push({
      id: m.id,
      permalink: m.permalink,
      image,
      alt: altFromCaption(m.caption, handle),
      timestamp: m.timestamp ?? "",
      kind,
    });
    if (posts.length >= limit) break;
  }
  return posts;
}

async function getJson(fetchLike: FetchLike, url: string): Promise<unknown> {
  const res = await fetchLike(url);
  if (!res.ok) throw new InstagramError("upstream", `Instagram responded ${res.status}`, res.status);
  try {
    return await res.json();
  } catch {
    throw new InstagramError("bad-json", "Instagram returned unparseable JSON", res.status);
  }
}

export async function loadPosts(opts: {
  token: string;
  limit: number;
  handle: string;
  fetch: FetchLike;
}): Promise<InstagramPost[]> {
  const url = new URL(`${GRAPH}/me/media`);
  url.searchParams.set("fields", MEDIA_FIELDS);
  url.searchParams.set("limit", String(opts.limit));
  url.searchParams.set("access_token", opts.token);
  const json = (await getJson(opts.fetch, url.toString())) as MediaResponse;
  return normalizePosts(json, opts.limit, opts.handle);
}

export async function refreshToken(opts: { token: string; fetch: FetchLike; now?: Date }): Promise<TokenRecord> {
  const url = new URL(`${GRAPH}/refresh_access_token`);
  url.searchParams.set("grant_type", "ig_refresh_token");
  url.searchParams.set("access_token", opts.token);
  const json = (await getJson(opts.fetch, url.toString())) as { access_token?: string; expires_in?: number };
  if (!json.access_token || typeof json.expires_in !== "number") {
    throw new InstagramError("bad-json", "refresh response missing access_token or expires_in");
  }
  const now = opts.now ?? new Date();
  return {
    token: json.access_token,
    refreshedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + json.expires_in * 1000).toISOString(),
  };
}

export function needsRefresh(record: TokenRecord | null | undefined, now: Date = new Date()): boolean {
  if (!record) return true;
  const refreshed = Date.parse(record.refreshedAt);
  if (Number.isNaN(refreshed)) return true;
  return now.getTime() - refreshed > REFRESH_AFTER_MS;
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: 12 passing, 0 failing.

- [ ] **Step 6: Type-check**

Run: `npm run check`
Expected: 0 errors (warnings about pre-existing files are fine).

- [ ] **Step 7: Commit**

```bash
git add src/lib/instagram.ts tests/instagram.test.ts package.json tsconfig.json
git commit -m "Instagram feed core: normalize posts, load media, refresh token"
```

---

### Task 2: Pages Function `/api/instagram`, env docs

**Files:**
- Create: `functions/api/instagram.ts`
- Modify: `.env.example`, `PRODUCT.md:7`

**Interfaces:**
- Consumes from Task 1: `loadPosts`, `refreshToken`, `needsRefresh`, `TokenRecord`, `FeedResponse`.
- Produces: `GET /api/instagram` → `200 FeedResponse` | `503 {ok:false,error:"not-configured"}` | `502 {ok:false,error:"upstream"}`. Env: `INSTAGRAM_ACCESS_TOKEN` (secret), `INSTAGRAM_HANDLE` (optional, default `pomib.browstudio`), `INSTAGRAM_KV` (optional KV binding).

- [ ] **Step 1: Write the function**

Create `functions/api/instagram.ts`:
```ts
// Cloudflare Pages Function: GET /api/instagram
// The newest posts for the home page grid. The token is a Pages secret (INSTAGRAM_ACCESS_TOKEN);
// with a KV binding (INSTAGRAM_KV) the function refreshes it weekly so it never hits Meta's
// 60-day expiry. Successful answers sit in the edge cache for an hour, which is also what keeps
// Instagram's short-lived CDN image URLs fresh. Only onRequestGet is exported: a catch-all
// onRequest beside a method handler is ambiguous in Pages routing.
import {
  loadPosts,
  refreshToken,
  needsRefresh,
  type TokenRecord,
  type FeedResponse,
} from "../../src/lib/instagram";

interface Env {
  INSTAGRAM_ACCESS_TOKEN?: string;
  INSTAGRAM_HANDLE?: string;
  INSTAGRAM_KV?: KVNamespace;
}

const KV_KEY = "token";
const COUNT = 4;
const OK_CACHE = "public, max-age=300, s-maxage=3600";

const json = (body: unknown, status = 200, cacheControl = "no-store") =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": cacheControl },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url).toString(), { method: "GET" });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const envToken = env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (!envToken) return json({ ok: false, error: "not-configured" }, 503);

  const { token, refresh } = await resolveToken(env, envToken);
  const handle = env.INSTAGRAM_HANDLE?.trim() || "pomib.browstudio";
  try {
    const posts = await loadPosts({ token, limit: COUNT, handle, fetch });
    const body: FeedResponse = { ok: true, posts, handle, refresh };
    const res = json(body, 200, OK_CACHE);
    waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  } catch (err) {
    console.error("instagram feed:", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "upstream" }, 502);
  }
};

/** KV record if fresh; otherwise refresh and store. Any failure keeps whatever token we have. */
async function resolveToken(env: Env, envToken: string): Promise<{ token: string; refresh: "auto" | "manual" }> {
  const kv = env.INSTAGRAM_KV;
  if (!kv) return { token: envToken, refresh: "manual" };

  const record = await kv.get<TokenRecord>(KV_KEY, "json");
  if (record && !needsRefresh(record)) return { token: record.token, refresh: "auto" };

  const current = record?.token ?? envToken;
  try {
    const fresh = await refreshToken({ token: current, fetch });
    await kv.put(KV_KEY, JSON.stringify(fresh));
    return { token: fresh.token, refresh: "auto" };
  } catch (err) {
    console.error("instagram token refresh:", err instanceof Error ? err.message : err);
    return { token: current, refresh: "auto" };
  }
}
```

- [ ] **Step 2: Document the token setup**

Append to `.env.example`:
```
# Instagram live feed (home page "Recent work"). The account must be a Business or Creator account.
# 1. developers.facebook.com → My apps → Create app → add the "Instagram" product.
# 2. Instagram → "API setup with Instagram login" → add @pomib.browstudio as an Instagram tester,
#    then accept the invite in the Instagram app (Settings → Website permissions → Tester invites).
# 3. "Generate token" for that account. It is long-lived (60 days). Paste it here for local dev and
#    in Cloudflare Pages → Settings → Environment variables (encrypt it) for production.
# 4. Production only: create a KV namespace and bind it as INSTAGRAM_KV under Pages → Settings →
#    Functions → KV namespace bindings. The function then refreshes the token weekly by itself;
#    without the binding the token must be regenerated by hand before it expires.
# Local dev without a token serves tests/fixtures/instagram-media.json instead.
INSTAGRAM_ACCESS_TOKEN=
```

In `PRODUCT.md` line 7, after "Sanity publish webhook triggers a Cloudflare Pages deploy hook." add:
```
One Pages Function (`/api/instagram`) proxies the Instagram feed for the home page: token as a Pages secret, `INSTAGRAM_KV` namespace for weekly token refresh, one-hour edge cache.
```

- [ ] **Step 3: Type-check**

Run: `npm run check`
Expected: 0 errors. `PagesFunction`, `KVNamespace`, `caches.default` resolve from `@cloudflare/workers-types` (already in `tsconfig.json` `types`).

- [ ] **Step 4: Commit**

```bash
git add functions/api/instagram.ts .env.example PRODUCT.md
git commit -m "Pages Function /api/instagram: edge-cached feed with KV token refresh"
```

---

### Task 3: Sanity toggle and content layer

**Files:**
- Modify: `cms/schema/siteSettings.ts:46-52` (instagram fields)
- Modify: `src/lib/content.ts:104-106` (type), `:185-200` (`normalizeSeedSettings`), `:238-262` (`getSiteSettings`)
- Modify: `src/content/seed/siteSettings.json:18-19`

**Interfaces:**
- Produces: `SiteSettings.instagramLiveFeed: boolean` (default `true`), consumed by Task 4.

- [ ] **Step 1: Schema**

In `cms/schema/siteSettings.ts`, replace the `instagramUrl` and `instagramPicks` fields with:
```ts
    defineField({ name: "instagramUrl", type: "url" }),
    defineField({
      name: "instagramLiveFeed",
      title: "Show the newest Instagram posts automatically",
      type: "boolean",
      initialValue: true,
      description:
        "Needs the Instagram token set in Cloudflare. When this is off, or the feed can't load, the photos below are shown instead.",
    }),
    defineField({
      name: "instagramPicks",
      title: "Instagram grid on the home page",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] }],
      description: "Four photos shown until the live feed loads, and whenever it can't.",
    }),
```

- [ ] **Step 2: Content layer**

In `src/lib/content.ts`:
- In `interface SiteSettings`, after `instagramUrl: string;` add `instagramLiveFeed: boolean;`.
- In `normalizeSeedSettings()`, after `bookingHref: ...,` add `instagramLiveFeed: s.instagramLiveFeed !== false,`.
- In `getSiteSettings()` return object, after `bookingHref: ...,` add `instagramLiveFeed: s.instagramLiveFeed ?? seed.instagramLiveFeed,`.

- [ ] **Step 3: Seed**

In `src/content/seed/siteSettings.json`, after the `"instagramUrl"` line add:
```json
  "instagramLiveFeed": true,
```

- [ ] **Step 4: Verify**

Run: `npm run check` → 0 errors. Run: `npm test` → still 12 passing.

- [ ] **Step 5: Commit**

```bash
git add cms/schema/siteSettings.ts src/lib/content.ts src/content/seed/siteSettings.json
git commit -m "Site settings: toggle for the live Instagram feed; picks become the fallback"
```

---

### Task 4: Live tiles in InstagramGrid

**Files:**
- Modify: `src/components/InstagramGrid.astro` (whole file)

**Interfaces:**
- Consumes: `settings.instagramLiveFeed` (Task 3); `GET /api/instagram` → `FeedResponse` (Task 2/5).

- [ ] **Step 1: Rewrite the component**

Replace `src/components/InstagramGrid.astro` with:
```astro
---
// Server-renders the CMS picks, which is the whole section when there is no token, no
// JavaScript, or Instagram is down. When the live feed is on, a script asks /api/instagram for
// the newest posts and swaps them in, cloning the <template> below so Photo's and Caption's
// scoped styles apply to tiles the server never saw.
import type { SiteSettings, Service } from "../lib/content";
import { photoCaption } from "../lib/content";
import Photo from "./Photo.astro";
import Caption from "./Caption.astro";
import Icon from "./Icon.astro";

interface Props {
  settings: SiteSettings;
  services: Service[];
}
const { settings, services } = Astro.props;
const picks = settings.instagramPicks.slice(0, 4);
const live = settings.instagramLiveFeed;
// A blank remote photo for the template. Inside <template> nothing is fetched; the script fills it in.
const blank = { kind: "remote", src: "", srcset: "", width: 640, height: 640, alt: "" } as const;
---

{
  picks.length > 0 && (
    <section class="ig section" id="work" aria-labelledby="ig-heading">
      <div class="page">
        <div class="ig__head reveal">
          <div class="section-head" style="margin-bottom: 0">
            <h2 id="ig-heading">Recent work, as it heals.</h2>
            <p class="lede">Pomi posts new results most weeks. The newest are here; the feed is the whole portfolio.</p>
          </div>
          <a class="btn btn--quiet" href={settings.instagramUrl} rel="noopener">
            <Icon name="instagram" />
            @{settings.instagramHandle}
          </a>
        </div>

        <ul class="ig__grid" data-ig-feed={live ? "" : undefined} data-ig-count="4">
          {picks.map((p, i) => {
            const c = photoCaption(p, services);
            return (
              <li class="reveal" style={`--i: ${i}`}>
                <a class="ig__tile" href={settings.instagramUrl} rel="noopener">
                  <Photo photo={p} sizes="(min-width: 60rem) 24vw, 50vw" widths={[400, 700]} ratio="1 / 1" />
                  <Caption service={c.service} detail={c.detail} />
                </a>
              </li>
            );
          })}
        </ul>

        {live && (
          <template data-ig-tile>
            <li class="reveal is-in">
              <a class="ig__tile" target="_blank" rel="noopener">
                <Photo photo={blank} sizes="(min-width: 60rem) 24vw, 50vw" ratio="1 / 1" />
                <Caption service="Instagram" detail="New" />
              </a>
            </li>
          </template>
        )}
      </div>
    </section>
  )
}

<script>
  // Live feed. Anything short of a good answer leaves the CMS picks exactly as rendered.
  const grid = document.querySelector<HTMLUListElement>("[data-ig-feed]");
  const template = document.querySelector<HTMLTemplateElement>("template[data-ig-tile]");

  function postDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "On Instagram";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  if (grid && template) {
    const count = Number(grid.dataset.igCount) || 4;
    fetch("/api/instagram", { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        const posts: Array<{ permalink: string; image: string; alt: string; timestamp: string }> =
          body?.ok && Array.isArray(body.posts) ? body.posts.slice(0, count) : [];
        if (posts.length === 0) return;
        const tiles = posts.map((post, i) => {
          const li = template.content.firstElementChild!.cloneNode(true) as HTMLLIElement;
          li.style.setProperty("--i", String(i));
          const a = li.querySelector("a")!;
          a.href = post.permalink;
          const img = li.querySelector("img")!;
          img.removeAttribute("srcset");
          img.removeAttribute("sizes");
          img.setAttribute("referrerpolicy", "no-referrer");
          img.src = post.image;
          img.alt = post.alt;
          const detail = li.querySelector(".caption__detail");
          if (detail) detail.textContent = postDate(post.timestamp);
          return li;
        });
        grid.replaceChildren(...tiles);
      })
      .catch(() => {});
  }
</script>

<style>
  .ig__head {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    justify-content: space-between;
    gap: var(--space-5);
    margin-bottom: var(--space-8);
  }
  .ig__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-5) var(--space-4);
  }
  .ig__tile {
    display: block;
    text-decoration: none;
  }
  .ig__tile :global(.photo) {
    transition: box-shadow var(--dur-base) ease;
  }
  .ig__tile:hover :global(.photo) {
    box-shadow: var(--shadow-hover);
  }
  @media (min-width: 60rem) {
    .ig__grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
</style>
```

- [ ] **Step 2: Verify the fallback still renders identically**

Run: `npm run check` → 0 errors. Start `npm run dev`, open `http://localhost:4400/#work`. Before Task 5 there is no `/api/instagram` in dev, so the fetch 404s and the four CMS picks must render exactly as before. Confirm in the browser: four tiles, captions with service names, no console errors. Confirm `view-source` shows `<template data-ig-tile>` after the grid and `data-ig-feed=""` on the `ul`.

- [ ] **Step 3: Commit**

```bash
git add src/components/InstagramGrid.astro
git commit -m "Instagram grid: swap in live posts from /api/instagram, picks stay as fallback"
```

---

### Task 5: Dev route and fixture, end-to-end verification

**Files:**
- Create: `tests/fixtures/instagram-media.json`
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes from Task 1: `loadPosts`, `normalizePosts` (loaded through Vite's `ssrLoadModule`).
- Produces: dev-only `GET /api/instagram` with the same response shape as Task 2.

- [ ] **Step 1: Fixture**

Create `tests/fixtures/instagram-media.json`. Image paths point at the local gallery, which the dev server serves under `/src/…`; they are meaningless in production:
```json
{
  "data": [
    {
      "id": "17900000000000001",
      "caption": "Healed microblading, six weeks after the touch-up #microblading #tustin",
      "media_type": "IMAGE",
      "media_url": "/src/assets/gallery/microblading/06.jpg",
      "permalink": "https://www.instagram.com/p/fixture-one/",
      "timestamp": "2026-09-04T18:12:00+0000"
    },
    {
      "id": "17900000000000002",
      "caption": "Powder brows, before and after\nBooked out through October",
      "media_type": "CAROUSEL_ALBUM",
      "media_url": "/src/assets/gallery/ombre-powder-brows/04.jpg",
      "permalink": "https://www.instagram.com/p/fixture-two/",
      "timestamp": "2026-08-29T16:40:00+0000"
    },
    {
      "id": "17900000000000003",
      "caption": "Lash enhancement, healed",
      "media_type": "VIDEO",
      "media_url": "https://example.invalid/not-used.mp4",
      "thumbnail_url": "/src/assets/gallery/lash-enhancement/01.jpg",
      "permalink": "https://www.instagram.com/p/fixture-three/",
      "timestamp": "2026-08-22T15:05:00+0000"
    },
    {
      "id": "17900000000000004",
      "caption": "",
      "media_type": "IMAGE",
      "media_url": "/src/assets/gallery/lip-tint/01.jpg",
      "permalink": "https://www.instagram.com/p/fixture-four/",
      "timestamp": "2026-08-15T19:30:00+0000"
    },
    {
      "id": "17900000000000005",
      "caption": "A fifth post that the four-tile grid must not show",
      "media_type": "IMAGE",
      "media_url": "/src/assets/gallery/eyeliner/02.jpg",
      "permalink": "https://www.instagram.com/p/fixture-five/",
      "timestamp": "2026-08-10T12:00:00+0000"
    }
  ]
}
```

- [ ] **Step 2: Dev route integration**

In `astro.config.mjs`, add after the existing imports:
```js
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
```
Add before `export default defineConfig`:
```js
// Dev only. `astro dev` never runs functions/, so this serves GET /api/instagram through the same
// core the Pages Function uses. With INSTAGRAM_ACCESS_TOKEN in .env it calls Meta; without it, it
// serves tests/fixtures/instagram-media.json so the live grid can be driven locally.
function instagramDevRoute() {
  return {
    name: "instagram-dev-route",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use("/api/instagram", async (req, res) => {
          const send = (status, body) => {
            res.statusCode = status;
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "no-store");
            res.end(JSON.stringify(body));
          };
          if (req.method !== "GET") return send(405, { ok: false, error: "method" });
          try {
            const ig = await server.ssrLoadModule("/src/lib/instagram.ts");
            const handle = "pomib.browstudio";
            const token = (env.INSTAGRAM_ACCESS_TOKEN ?? "").trim();
            if (token) {
              const posts = await ig.loadPosts({ token, limit: 4, handle, fetch });
              return send(200, { ok: true, posts, handle, refresh: "manual" });
            }
            const fixture = JSON.parse(readFileSync(resolve(process.cwd(), "tests/fixtures/instagram-media.json"), "utf8"));
            return send(200, { ok: true, posts: ig.normalizePosts(fixture, 4, handle), handle, refresh: "fixture" });
          } catch (err) {
            console.error("[instagram dev route]", err);
            return send(502, { ok: false, error: "upstream" });
          }
        });
      },
    },
  };
}
```
In `integrations: [...]` append `instagramDevRoute()` after `sitemap(...)`.

- [ ] **Step 3: Verify the route**

Start `npm run dev`. Run:
```bash
curl -s http://localhost:4400/api/instagram
```
Expected: `{"ok":true,"posts":[…4 items…],"handle":"pomib.browstudio","refresh":"fixture"}`; the third post has `"kind":"video"` and `"image":"/src/assets/gallery/lash-enhancement/01.jpg"`; the fourth has `"alt":"New post from @pomib.browstudio"`; the fifth fixture item is absent.

- [ ] **Step 4: Verify in the browser (use the `run` skill)**

Open `http://localhost:4400/#work`. Expected: four tiles, each caption "Instagram" then a date ("Sep 4", "Aug 29", "Aug 22", "Aug 15"), each link opening the fixture permalink in a new tab, images with the warm grade and hairline frame, no console errors. Then simulate failure: with the dev server stopped or `/api/instagram` blocked, the four CMS picks render instead. Take a screenshot of each state.

- [ ] **Step 5: Full build**

Run: `npm run build`
Expected: build passes including `check-no-placeholders` and `check-links`. `dist/index.html` contains `data-ig-feed=""` and the `<template data-ig-tile>`. `npm test` still passes.

- [ ] **Step 6: Commit**

```bash
git add tests/fixtures/instagram-media.json astro.config.mjs
git commit -m "Dev route for /api/instagram from a fixture, so the live grid runs locally"
```

---

## Verification checklist (end of plan)

- `npm test`: 12 passing.
- `npm run check`: 0 errors.
- `npm run build`: passes.
- Dev server, live state: four fixture tiles with dates, links to permalinks.
- Dev server, failure state: four CMS picks, unchanged from before this work.
- Production checklist for the user (cannot be done here): create the Meta app and token, set `INSTAGRAM_ACCESS_TOKEN` as a Pages secret, bind `INSTAGRAM_KV`, deploy, hit `https://pomibbrowstudio.com/api/instagram` and expect `"refresh":"auto"`.
