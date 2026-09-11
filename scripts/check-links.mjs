// Asserts every internal link in the built site resolves, and that every URL the previous
// site served is either a live page or a redirect source.
//
// This exists because the site shipped for a while with 23 internal links pointing at pages
// that did not exist yet; a build passing is not evidence that the links work.
//
// Usage: node scripts/check-links.mjs
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = "dist";
if (!existsSync(DIST)) {
  console.error("dist/ not found - run the build first");
  process.exit(1);
}

const htmlFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (entry.endsWith(".html")) htmlFiles.push(p);
  }
})(DIST);

/** Every path the built site can serve. */
const routes = new Set();
for (const f of htmlFiles) {
  let r = "/" + relative(DIST, f).split("\\").join("/");
  r = r.replace(/\/index\.html$/, "").replace(/\.html$/, "");
  routes.add(r === "" ? "/" : r);
}
// Static assets in public/ are served as-is.
const assets = new Set();
(function walkAssets(dir, base = "") {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkAssets(p, `${base}/${entry}`);
    else assets.add(`${base}/${entry}`);
  }
})(DIST);

const redirectSources = new Set();
const redirectsFile = join(DIST, "_redirects");
if (existsSync(redirectsFile)) {
  for (const line of readFileSync(redirectsFile, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    redirectSources.add(t.split(/\s+/)[0].replace(/\/$/, "") || "/");
  }
}

// --- 1. every internal href resolves ------------------------------------------------
const broken = [];
for (const f of htmlFiles) {
  const html = readFileSync(f, "utf8");
  const from = "/" + relative(DIST, f).split("\\").join("/");
  for (const m of html.matchAll(/(?:href|action)="([^"]+)"/g)) {
    let href = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(href)) continue;
    if (!href.startsWith("/")) continue;
    href = href.split("#")[0].split("?")[0];
    if (!href) continue;
    const clean = href.replace(/\/$/, "") || "/";
    if (routes.has(clean) || assets.has(href) || assets.has(clean)) continue;
    // Pages Functions and the Studio are not static files.
    if (clean === "/api/contact" || clean.startsWith("/admin")) continue;
    broken.push(`${from}  ->  ${href}`);
  }
}

// --- 2. every legacy URL is covered -------------------------------------------------
const LEGACY = [
  "/home", "/about-pomi", "/faqs", "/safety", "/aftercare", "/contact-form",
  "/microblading", "/microblading-shading", "/ombre-powder-brows", "/eyeliner",
  "/lash-enhancement", "/lip-tint", "/scalp-micropigmentation",
  "/good-pmu-candidates", "/how-long-it-lasts", "/pmu-healing-timeline",
  "/prepare-for-appointment", "/lip-tint-vs-lip-blush", "/importance-of-touch-up",
  "/are-powder-brows-for-me%3F-1", "/is-permanent-makeup-safe%3F",
  "/eyeliner-lash-enhancement", "/scalp-micropigmentation-1",
];
const uncovered = LEGACY.filter((u) => !redirectSources.has(u) && !routes.has(u));

console.log(`${htmlFiles.length} pages, ${routes.size} routes, ${redirectSources.size} redirect sources`);

let failed = false;
if (broken.length) {
  failed = true;
  console.error(`\n✗ ${broken.length} broken internal link(s):`);
  for (const b of [...new Set(broken)].sort()) console.error("   " + b);
} else {
  console.log("✓ Every internal link resolves.");
}

if (uncovered.length) {
  failed = true;
  console.error(`\n✗ ${uncovered.length} legacy URL(s) with no page and no redirect:`);
  for (const u of uncovered) console.error("   " + u);
} else {
  console.log(`✓ All ${LEGACY.length} legacy URLs are covered.`);
}

process.exit(failed ? 1 : 0);
