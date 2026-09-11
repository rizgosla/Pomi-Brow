// Captures the previous GoDaddy site's page bodies: the "custom HTML" embeds.
//
// Each page body lives in the entity-encoded `srcDoc` attribute of an <iframe> in the served
// HTML, so a plain fetch is enough; no browser needed. For every page this writes, under
// .impeccable/live-content/embeds/:
//   <slug>.html   the decoded embed as a standalone page (opens in a browser, original styling)
//   <slug>.md     the copy as markdown, container classes marked so the grouping survives
//   <slug>.json   blocks in the live-content record shape, plus style tokens and links
//   index.json    per-page counts
//   design-tokens.md   generated: shared vs page-specific colours, fonts, radii, grids, classes
//
// Output is raw material, not content. It gets read and hand-placed, never piped into a build.
//
// Usage: node scripts/import-live-embeds.mjs [outDir]
//   LIVE_RAW_DIR=<dir>  cache of served HTML per slug: read <dir>/<slug>.html instead of fetching
//                       when it exists, and save fresh fetches there. GoDaddy blocks bursts for a
//                       while, so re-parsing from the cache is how the parser gets iterated.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { BASE, PAGES } from "./live-pages.mjs";
import {
  extractEmbeds,
  wrapStandalone,
  parseEmbed,
  parseNativeBlocks,
  styleTokens,
  toMarkdown,
} from "./lib/live-embed.mjs";

const out = process.argv[2] ?? ".impeccable/live-content/embeds";
mkdirSync(out, { recursive: true });

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const capturedAt = new Date().toISOString().slice(0, 10);

const index = [];
const records = [];

/** GoDaddy rate-limits bursts (HTTP 429): pause between pages and back off on a 429. */
async function fetchPage(url, slug) {
  const rawDir = process.env.LIVE_RAW_DIR;
  const cached = rawDir && join(rawDir, `${slug}.html`);
  if (cached && existsSync(cached)) return readFileSync(cached, "utf8");
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (res.ok) {
      const text = await res.text();
      if (cached) {
        mkdirSync(rawDir, { recursive: true });
        writeFileSync(cached, text);
      }
      await new Promise((r) => setTimeout(r, 400));
      return text;
    }
    if (res.status !== 429 || attempt === 4) throw new Error(`HTTP ${res.status}`);
    await new Promise((r) => setTimeout(r, 3000 * 2 ** attempt));
  }
}

for (const [slug, path] of PAGES) {
  const url = BASE + path;
  let record;
  try {
    const raw = await fetchPage(url, slug);
    const title = (raw.match(/<title>([^<]*)<\/title>/)?.[1] ?? "").trim();
    const embeds = extractEmbeds(raw);
    const nativeBlocks = parseNativeBlocks(raw);

    if (embeds.length === 0) {
      record = { title, h1: null, kicker: null, embedId: null, blocks: [], nativeBlocks, links: [], images: [], wordCount: 0 };
    } else {
      if (embeds.length > 1) console.warn(`${slug}: ${embeds.length} embeds on the page, keeping the first`);
      const doc = embeds[0];
      const parsed = parseEmbed(doc);
      record = { title, ...parsed, nativeBlocks, style: styleTokens(parsed.styleCss) };
      writeFileSync(join(out, `${slug}.html`), wrapStandalone(doc, { title: title || slug, url, capturedAt }));
      writeFileSync(join(out, `${slug}.md`), toMarkdown({ ...record, url }));
    }
  } catch (err) {
    // A failed fetch must not clobber a good earlier capture (the site rate-limits bursts).
    const prev = readPrevious(join(out, `${slug}.json`));
    if (prev) {
      console.warn(`${slug}: ${err} - kept the capture from ${prev.capturedAt}`);
      record = prev;
    } else {
      record = { error: String(err), blocks: [], nativeBlocks: [], links: [], images: [], wordCount: 0, embedId: null };
    }
  }

  record.slug = slug;
  record.url = url;
  record.capturedAt ??= capturedAt;
  writeFileSync(join(out, `${slug}.json`), JSON.stringify(record, null, 2) + "\n");
  records.push(record);

  const row = {
    slug,
    url,
    embedId: record.embedId,
    words: record.wordCount,
    blocks: record.blocks.length,
    nativeBlocks: record.nativeBlocks.length,
    colors: record.style ? Object.keys(record.style.colors).length : 0,
    error: record.error ?? null,
  };
  index.push(row);
  console.log(
    `${slug.padEnd(30)} ${String(row.words).padStart(5)} words ${String(row.blocks).padStart(4)} blocks ${String(row.nativeBlocks).padStart(3)} native ${String(row.colors).padStart(3)} colours  ${row.embedId ?? "-"}${row.error ? "  ERROR " + row.error : ""}`
  );
}

writeFileSync(join(out, "index.json"), JSON.stringify(index, null, 2) + "\n");
writeFileSync(join(out, "design-tokens.md"), designTokens(records.filter((r) => r.style)));

const total = index.reduce((n, r) => n + r.words, 0);
console.log(`\nTotal ${total} words across ${index.filter((r) => r.embedId).length} embeds -> ${out}`);

/** The last successful record for a page, if any. */
function readPrevious(file) {
  if (!existsSync(file)) return null;
  try {
    const r = JSON.parse(readFileSync(file, "utf8"));
    return r.error ? null : r;
  } catch {
    return null;
  }
}

/** "all except x, y" when that is shorter than naming every page. */
function pageList(pages, rs) {
  const missing = rs.map((r) => r.slug).filter((s) => !pages.includes(s));
  if (missing.length && missing.length < pages.length) return `all except ${missing.join(", ")}`;
  return pages.join(", ");
}

/** Shared vs page-specific tokens across every captured embed. */
function designTokens(rs) {
  const colorPages = {};
  for (const r of rs) for (const c of Object.keys(r.style.colors)) (colorPages[c] ??= []).push(r.slug);
  const shared = Object.entries(colorPages).filter(([, p]) => p.length === rs.length).map(([c]) => c);
  const partial = Object.entries(colorPages).filter(([, p]) => p.length < rs.length).sort((a, b) => b[1].length - a[1].length);
  const union = (key) => [...new Set(rs.flatMap((r) => r.style[key]))];

  const lines = [
    "# Design tokens of the previous site's embeds",
    "",
    `Generated by scripts/import-live-embeds.mjs on ${capturedAt} from ${rs.length} pages. Hand-written notes on the recurring components are in design-notes.md.`,
    "",
    "## Fonts",
    "",
    ...union("fonts").map((f) => `- ${f}`),
    "",
    `## Colours on every page (${shared.length})`,
    "",
    "| Colour | Uses across pages |",
    "|---|---|",
    ...shared.map((c) => `| \`${c}\` | ${rs.reduce((n, r) => n + r.style.colors[c], 0)} |`),
    "",
    `## Colours on some pages (${partial.length})`,
    "",
    "| Colour | Pages |",
    "|---|---|",
    ...partial.map(([c, p]) => `| \`${c}\` | ${pageList(p, rs)} |`),
    "",
    "## Radii",
    "",
    ...union("radii").map((v) => `- ${v}`),
    "",
    "## Shadows",
    "",
    ...union("shadows").map((v) => `- ${v}`),
    "",
    "## Grid templates",
    "",
    ...union("grids").map((v) => `- ${v}`),
    "",
    "## Class inventory per page",
    "",
    ...rs.map((r) => `- **${r.slug}** (\`#${r.embedId}\`): ${r.style.classes.join(", ")}`),
    "",
  ];
  return lines.join("\n");
}
