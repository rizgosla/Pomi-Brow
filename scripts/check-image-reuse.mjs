// Reports any photograph used more than once on the same built page.
//
// This exists because it happened twice: three of four Instagram tiles were also hero
// tiles on the home page, and the service hero cover was also in its own gallery below.
// Both were missed by eye and by counting.
//
// Astro fingerprints each source into its own hashed basename, so all renditions of one
// source share a stem: /_astro/04.BrfUSwTm_1UU9EA.webp -> "04.BrfUSwTm".
//
// Usage: node scripts/check-image-reuse.mjs [--strict]
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = "dist";
const strict = process.argv.includes("--strict");
if (!existsSync(DIST)) {
  console.error("dist/ not found - run the build first");
  process.exit(1);
}

// Repeats the library forces, not mistakes. Matched against the alt text of the repeated
// image rather than its hashed filename, because the hash changes whenever the image
// pipeline does and a stale hash would silently stop waiving anything.
const ALLOWED = {
  // The studio owns exactly one lash-enhancement photograph, and both the hero wall and
  // the Lash Enhancement price card need it.
  "/": [/lash enhancement/i],
};

const htmlFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (entry.endsWith(".html")) htmlFiles.push(p);
  }
})(DIST);

const stemOf = (url) => {
  const file = url.split("/").pop() ?? "";
  const m = file.match(/^([^.]+\.[^._]+)/); // "04.BrfUSwTm" from "04.BrfUSwTm_1UU9EA.webp"
  return m ? m[1] : null;
};

let problems = 0;
let checked = 0;

for (const f of htmlFiles.sort()) {
  const route =
    ("/" + relative(DIST, f).split("\\").join("/")).replace(/\/index\.html$/, "").replace(/\.html$/, "") || "/";
  const html = readFileSync(f, "utf8");

  // stem -> { n, alts[] }
  const seen = new Map();
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    const stem = src ? stemOf(src) : null;
    if (!stem) continue;
    checked++;
    const alt = tag.match(/\balt="([^"]*)"/)?.[1] ?? "";
    const rec = seen.get(stem) ?? { n: 0, alts: [] };
    rec.n += 1;
    rec.alts.push(alt);
    seen.set(stem, rec);
  }

  const patterns = ALLOWED[route] ?? [];
  const isWaived = (rec) => patterns.some((re) => rec.alts.some((a) => re.test(a)));
  const repeated = [...seen.entries()].filter(([, rec]) => rec.n > 1);
  const dupes = repeated.filter(([, rec]) => !isWaived(rec));
  const waived = repeated.filter(([, rec]) => isWaived(rec));

  if (dupes.length) {
    problems += dupes.length;
    console.error(`x ${route}`);
    for (const [stem, rec] of dupes) {
      console.error(`     ${stem} appears ${rec.n}x  ${JSON.stringify(rec.alts[0])}`);
    }
  } else if (waived.length) {
    console.log(`~ ${route}  (${waived.map(([s, rec]) => `${s} x${rec.n}, known`).join("; ")})`);
  }
}

// A pass means nothing if nothing was inspected.
if (checked === 0) {
  console.error("No <img> tags found in dist/ - the check did not actually run.");
  process.exit(1);
}

if (problems) {
  console.error(`\n${problems} unintended image repeat(s) across ${htmlFiles.length} pages.`);
  process.exit(strict ? 1 : 0);
}
console.log(`OK  No unintended image repeats. ${checked} images across ${htmlFiles.length} pages.`);
