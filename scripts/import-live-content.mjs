// Renders the live GoDaddy site and extracts its copy.
//
// The live site is client-rendered: a plain HTTP fetch returns nav, footer and a cookie
// notice and nothing else, and the gallery images are lazy placeholder GIFs in the served
// HTML. So this drives real Chrome, waits for render, scrolls to trigger the lazy images,
// and dumps text + resolved image URLs per page for review.
//
// Output is raw material, not content. It gets read and hand-placed, never piped into a build.
//
// Usage: node scripts/import-live-content.mjs [outDir]
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = process.argv[2] ?? ".impeccable/live-content";
mkdirSync(out, { recursive: true });

const candidates = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];
const executablePath = candidates.find((p) => existsSync(p));
if (!executablePath) throw new Error("No Chrome or Edge found");

const BASE = "https://pomibrow.com";
const PAGES = [
  ["home", "/home"],
  ["about-pomi", "/about-pomi"],
  ["faqs", "/faqs"],
  ["safety", "/safety"],
  ["aftercare", "/aftercare"],
  ["contact-form", "/contact-form"],
  ["microblading", "/microblading"],
  ["microblading-shading", "/microblading-shading"],
  ["ombre-powder-brows", "/ombre-powder-brows"],
  ["eyeliner", "/eyeliner"],
  ["lash-enhancement", "/lash-enhancement"],
  ["lip-tint", "/lip-tint"],
  ["scalp-micropigmentation", "/scalp-micropigmentation"],
  ["good-pmu-candidates", "/good-pmu-candidates"],
  ["how-long-it-lasts", "/how-long-it-lasts"],
  ["pmu-healing-timeline", "/pmu-healing-timeline"],
  ["prepare-for-appointment", "/prepare-for-appointment"],
  ["lip-tint-vs-lip-blush", "/lip-tint-vs-lip-blush"],
  ["importance-of-touch-up", "/importance-of-touch-up"],
  ["are-powder-brows-for-me", "/are-powder-brows-for-me%3F-1"],
  ["is-permanent-makeup-safe", "/is-permanent-makeup-safe%3F"],
  ["eyeliner-vs-lash-enhancement", "/eyeliner-lash-enhancement"],
  ["learn-scalp-micropigmentation", "/scalp-micropigmentation-1"],
];

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
