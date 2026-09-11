// Renders the live GoDaddy site and extracts the copy in its outer DOM.
//
// NOTE: this misses the page bodies. Every page body on the live site is a "custom HTML" embed
// rendered inside an <iframe> from its `srcDoc` attribute, which this outer-DOM walk never enters
// (hence the 6 to 13 word results for most pages). scripts/import-live-embeds.mjs reads the
// srcDoc directly and is the capture to use. This script is kept for the native widgets it does
// see: the lazy-loaded gallery images and the two older articles under the embeds.
//
// Output is raw material, not content. It gets read and hand-placed, never piped into a build.
//
// Usage: node scripts/import-live-content.mjs [outDir]
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { BASE, PAGES, BROWSER_CANDIDATES } from "./live-pages.mjs";

const out = process.argv[2] ?? ".impeccable/live-content";
mkdirSync(out, { recursive: true });

const executablePath = BROWSER_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) throw new Error("No Chrome or Edge found");

const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
const index = [];

for (const [slug, path] of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  let record;
  try {
    await page.goto(BASE + path, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1500));
    await page.evaluate(async () => {
      const h = document.documentElement.scrollHeight;
      for (let y = 0; y < h; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
    });

    record = await page.evaluate(() => {
      const inChrome = (el) => !!el.closest("nav, header, footer, [role='navigation'], [role='banner'], [role='contentinfo']");
      const seen = new Set();
      const blocks = [];

      const nodes = document.querySelectorAll("h1, h2, h3, h4, p, li, blockquote");
      for (const el of nodes) {
        if (inChrome(el)) continue;
        const text = (el.innerText || "").replace(/\s+/g, " ").trim();
        if (!text || text.length < 3) continue;
        if (/we use cookies|this website uses cookies|accept|decline/i.test(text) && text.length < 200) continue;
        const key = el.tagName + "|" + text;
        if (seen.has(key)) continue;
        seen.add(key);
        blocks.push({ tag: el.tagName.toLowerCase(), text });
      }

      const images = [...document.querySelectorAll("img")]
        .filter((im) => !inChrome(im))
        .map((im) => im.currentSrc || im.src)
        .filter((s) => s && !s.startsWith("data:") && !/\/logo\//.test(s));

      return {
        title: document.title,
        h1: (document.querySelector("h1")?.innerText || "").trim(),
        blocks,
        images: [...new Set(images)],
        wordCount: blocks.reduce((n, b) => n + b.text.split(/\s+/).length, 0),
      };
    });
  } catch (err) {
    record = { error: String(err), blocks: [], images: [], wordCount: 0 };
  }

  record.slug = slug;
  record.url = BASE + path;
  writeFileSync(join(out, `${slug}.json`), JSON.stringify(record, null, 2));
  index.push({
    slug,
    url: record.url,
    words: record.wordCount,
    blocks: record.blocks.length,
    images: record.images.length,
    error: record.error ?? null,
  });
  console.log(
    `${slug.padEnd(30)} ${String(record.wordCount).padStart(5)} words  ${String(record.blocks.length).padStart(3)} blocks  ${String(record.images.length).padStart(3)} imgs${record.error ? "  ERROR " + record.error : ""}`
  );
  await page.close();
}

await browser.close();
writeFileSync(join(out, "index.json"), JSON.stringify(index, null, 2));
const total = index.reduce((n, r) => n + r.words, 0);
console.log(`\nTotal ${total} words across ${index.length} pages -> ${out}`);
