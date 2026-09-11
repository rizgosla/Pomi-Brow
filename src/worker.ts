// The Worker in front of the static site on Cloudflare Workers (see wrangler.jsonc). Only /api/*
// reaches it; it answers GET /api/instagram through the same handler the Pages Function uses
// (functions/api/instagram.ts), so the feed works whether the site is deployed as Pages or as a
// Worker with assets. Anything else falls through to the assets.
import { onRequestGet } from "../functions/api/instagram";

interface Env {
  ASSETS: Fetcher;
  INSTAGRAM_ACCESS_TOKEN?: string;
  INSTAGRAM_HANDLE?: string;
  INSTAGRAM_KV?: KVNamespace;
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/instagram") {
      if (request.method !== "GET") return new Response("Method not allowed", { status: 405, headers: { Allow: "GET" } });
      return onRequestGet({
        request,
        env,
        waitUntil: ctx.waitUntil.bind(ctx),
        passThroughOnException: ctx.passThroughOnException.bind(ctx),
        params: {},
        data: {},
        functionPath: pathname,
        next: () => env.ASSETS.fetch(request),
      } as unknown as Parameters<typeof onRequestGet>[0]);
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
