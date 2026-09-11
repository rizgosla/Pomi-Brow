# Live Instagram feed on the home page

Date: 2026-09-10. Branch: `design/pink-accent-and-pigment`.

## Why

The brief names Pomi's Instagram (@pomib.browstudio) as the living portfolio, one of two
first-class trust signals. Today the home page "Recent work, as it heals." section shows four
photos chosen by hand in Sanity (`settings.instagramPicks`). They go stale the moment Pomi posts.
The section should show her newest posts automatically, without a rebuild, and keep working
in both content modes the site supports (seed JSON and Sanity).

## Decisions already made (with the user)

- Official Meta API. The account is Business/Creator and the user will create the Meta app and
  paste one long-lived token into Cloudflare. Meta retired the Basic Display API in December
  2024; personal accounts have no API path.
- Edge function with an hourly cache, not a Sanity mirror plus rebuild.
- When the feed cannot load, the section shows the existing CMS picks. It is never hidden.
- Four tiles: two-up on phones, four-up on desktop, as now.

## Architecture

Three pieces, one data flow.

```
Instagram Graph API ──> functions/api/instagram.ts ──(JSON, edge-cached 1h)──> home page script
   (graph.instagram.com)       token from KV or env                          swaps 4 tiles in
                                refreshes token weekly                       falls back to picks
```

1. **`src/lib/instagram.ts`** — pure, runtime-agnostic core. No `fetch` calls of its own; it
   takes a `fetch` function so the same code runs in the Pages Function, the dev server, and
   tests. Exports:
   - `type InstagramPost = { id; permalink; image; alt; timestamp; kind: "image" | "video" | "album" }`
   - `normalizePosts(apiJson, limit)` — keeps IMAGE, CAROUSEL_ALBUM and VIDEO items (video uses
     `thumbnail_url`), drops anything without a usable image URL, trims the caption to a
     140-character alt string (first line, hashtags stripped; falls back to "New post from
     @handle"), returns the newest `limit` posts.
   - `loadPosts({ token, limit, fetch })` — calls
     `GET https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=…`
     and returns normalized posts; throws a typed error on non-2xx.
   - `refreshToken({ token, fetch })` — calls
     `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=…`
     and returns `{ token, expiresAt }`.
   - `needsRefresh(record, now)` — true when there is no record, or the stored token was
     refreshed more than 7 days ago. Meta requires a token to be at least 24 hours old before
     it can be refreshed and it dies at 60 days, so weekly is safe and cheap.

2. **`functions/api/instagram.ts`** — Cloudflare Pages Function, `GET /api/instagram`. Only
   `onRequestGet` is exported (the contact function exports a catch-all `onRequest` as well,
   which is ambiguous; this one does not copy that).
   - Env: `INSTAGRAM_ACCESS_TOKEN` (secret, required), `INSTAGRAM_KV` (KV namespace binding,
     optional but needed for automatic refresh).
   - Token source: KV record `token` (`{ token, expiresAt, refreshedAt }`) if present, else the
     env token. On a cache miss, if `needsRefresh` is true and KV is bound, it calls
     `refreshToken` and stores the result. Refresh failure is logged and ignored: the current
     token keeps serving, and the next cache miss retries. Without KV the env token is used
     as-is and the user must rotate it by hand before 60 days; the response carries
     `"refresh": "manual"` so this is visible.
   - Cache: Cloudflare Cache API (`caches.default`) keyed on the request URL. Successful
     responses carry `Cache-Control: public, max-age=300, s-maxage=3600` and are written with
     `context.waitUntil`. Failures are `no-store`.
   - Responses, same `json()` helper shape as the contact function:
     - `200 { ok: true, posts: InstagramPost[], handle, refresh: "auto" | "manual" }`
     - `503 { ok: false, error: "not-configured" }` when no token.
     - `502 { ok: false, error: "upstream" }` when Meta returns non-2xx or unparseable JSON.
   - The function never proxies images. Tiles load straight from Instagram's CDN with
     `referrerpolicy="no-referrer"`. Those URLs are signed and expire after a while; the hourly
     refetch is what keeps them fresh.

3. **`src/components/InstagramGrid.astro`** — server-renders the CMS picks exactly as today
   (no JavaScript, no token: the page is complete). When the live feed is enabled it adds
   `data-ig-feed`, `data-ig-handle` and `data-ig-count="4"` on the grid plus a `<script>`
   that:
   - fetches `/api/instagram`; on `ok` with at least one post, replaces the grid's children
     with live tiles (up to four); on anything else, leaves the picks alone and logs nothing
     user-facing.
   - builds each tile by cloning a server-rendered `<template>` so Astro's scoped `data-astro-cid`
     attributes come along and the component's styles apply. Tile markup: `li > a.ig__tile
     [href=permalink, target=_blank, rel=noopener] > div.photo.photo--framed [aspect-ratio 1/1]
     > img [src, alt, width=640, height=640, loading=lazy, decoding=async,
     referrerpolicy=no-referrer]` followed by a caption row.
   - inserted tiles get `class="reveal is-in"` directly. The reveal observer in `Base.astro`
     only watches nodes that existed at load, so a plain `reveal` would stay invisible forever.
   - Caption for a live tile follows the DESIGN.md caption row: service slot reads
     "Instagram", detail slot reads the post date (e.g. "Sep 4"). Nothing is drawn over the
     photograph.
   - Copy: the lede becomes "Pomi posts new results most weeks. The newest are here; the feed
     is the whole portfolio." It is true in both the live and fallback states.

The `<template>` is rendered on the server with the existing `Photo` (given a blank remote
photo: empty `src`, 640×640) and `Caption` components, so their scoped styles, the warm
grade and the grain all apply to cloned tiles with no CSS duplication. The script fills in
`src`, `alt`, `href` and the caption detail, and removes the blank `srcset` and `sizes`.

## Sanity integration

- `cms/schema/siteSettings.ts`: add `instagramLiveFeed` (boolean, title "Show the newest
  Instagram posts automatically", initial `true`, description: "Needs the Instagram token set
  in Cloudflare. When this is off, or the feed can't load, the photos below are shown
  instead."). Update `instagramPicks` description to "Four photos shown until the live feed
  loads, and whenever it can't."
- `src/lib/content.ts`: `SiteSettings.instagramLiveFeed: boolean`; seed normalizer defaults
  to `true`; the Sanity getter reads `s.instagramLiveFeed ?? true`.
- `src/content/seed/siteSettings.json`: `"instagramLiveFeed": true`.
- The token never goes in Sanity. The free dataset is public (same rule as form submissions).

## Local development and testing

Astro's dev server does not run Pages Functions. A small inline Astro integration in
`astro.config.mjs` (dev only, `astro:server:setup` hook) serves `GET /api/instagram` through
the same `src/lib/instagram.ts` core:
- with `INSTAGRAM_ACCESS_TOKEN` in `.env`, it hits Meta for real;
- without it, it serves `tests/fixtures/instagram-media.json` (a hand-written sample of the
  Meta response shape with four items) so the live grid can be exercised in the browser.
No KV, no cache in dev.

Tests: `node --test tests/` (Node 24 strips types natively; the test files are `.test.ts`
using only type annotations). Cover `normalizePosts` (media type filtering, video thumbnail,
missing URLs, caption to alt trimming, limit and ordering), `needsRefresh` (no record, fresh,
stale), and `loadPosts`/`refreshToken` against a stubbed `fetch` (success, non-2xx, bad JSON).
Add `"test": "node --test tests/"` to `package.json`.

## Configuration and docs

- `.env.example`: `INSTAGRAM_ACCESS_TOKEN=` with the setup steps in comments: Meta developer
  app → add the Instagram product → "API setup with Instagram login" → add Pomi's account as
  an Instagram tester and accept in her app settings → Generate token (long-lived, 60 days);
  set it as a Cloudflare Pages secret; create a KV namespace and bind it as `INSTAGRAM_KV`
  under Pages → Settings → Functions.
- `PRODUCT.md` stack line: note the Pages Function, the KV binding and the token.

## Error handling summary

| Situation | Function | Page |
|---|---|---|
| No token configured | 503 `not-configured`, no-store | CMS picks |
| Meta down / token dead | 502 `upstream`, no-store | CMS picks |
| Refresh fails | log, keep current token, retry next miss | unaffected |
| Fewer than 4 posts | 200 with what exists | shows those, no blanks |
| Live feed off in Sanity | not called | CMS picks, no script |
| JavaScript off | not called | CMS picks |

## Out of scope

Image proxying, video playback, likes/comments, a Sanity mirror of posts, hiding individual
posts from the Studio, and any third-party feed widget.
