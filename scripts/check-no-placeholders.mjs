// Build gate: scaffolding must never reach a visitor.
//
// The reviews block and the About bio are the two places the home page asks the
// visitor to trust a person rather than a photograph. Shipping "PLACEHOLDER"
// there turns the site's central claim -- one named artist, 200+ real reviews --
// into evidence that nobody finished the site. Components now filter placeholder
// content out, but a component guard only covers the cases someone remembered;
// this covers the rest by refusing to publish the build at all.
//
// Runs over the rendered HTML in dist/ after `astro build`.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = "dist";
const PATTERN = /placeholder/i;

/** Strip tags so we only flag text a visitor can actually read. */
function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function htmlFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...htmlFiles(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

let files;
try {
  files = htmlFiles(DIST);
} catch {
  console.error(`✗ ${DIST}/ not found. Run this after astro build.`);
  process.exit(1);
}

const hits = [];
for (const file of files) {
  // Rendered HTML is effectively one long line, so centre the excerpt on each
  // match rather than slicing from the start of the line.
  const text = visibleText(readFileSync(file, "utf8")).replace(/\s+/g, " ");
  for (const match of text.matchAll(new RegExp(PATTERN.source, "gi"))) {
    const at = match.index;
    const start = Math.max(0, at - 50);
    const excerpt =
      (start > 0 ? "…" : "") +
      text.slice(start, at + 90).trim() +
      (at + 90 < text.length ? "…" : "");
    hits.push({ file: relative(".", file), snippet: excerpt });
  }
}

if (hits.length > 0) {
  console.error(`\n✗ Placeholder content reached the rendered build (${hits.length}):\n`);
  for (const h of hits) console.error(`  ${h.file}\n    ${h.snippet}\n`);
  console.error("Supply the real content, or guard the section so it hides until the content exists.\n");
  process.exit(1);
}

console.log(`✓ No placeholder text in ${files.length} rendered page(s).`);
