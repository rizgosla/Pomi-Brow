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
