// The home-only launch gate (see src/lib/launch.ts). Runs at build time in static output:
// inner routes become redirect pages to "/", and the home page's outbound links lose their href.
import { defineMiddleware } from "astro:middleware";
import { HOME_ONLY, disableInternalLinks } from "./lib/launch";

let announced = false;

export const onRequest = defineMiddleware(async (context, next) => {
  if (!HOME_ONLY) return next();
  if (!announced) {
    announced = true;
    console.log("[launch] home-only gate is on: inner routes redirect to /, home links disabled");
  }
  const path = context.url.pathname;
  if (path !== "/" && !path.startsWith("/admin")) return context.redirect("/", 301);

  const res = await next();
  if (!res.headers.get("content-type")?.includes("text/html")) return res;
  const html = await res.text();
  return new Response(disableInternalLinks(html), { status: res.status, headers: res.headers });
});
