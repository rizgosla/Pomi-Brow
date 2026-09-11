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
  const cache = (caches as any).default;
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
