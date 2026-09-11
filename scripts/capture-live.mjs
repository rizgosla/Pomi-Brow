// Full-page screenshots of the previous GoDaddy site, desktop and mobile, for design reference.
//
// The page body is an <iframe> embed that sizes itself via postMessage after load, so each
// capture waits for the frame's height to settle before shooting. Cookie banner is dismissed.
//
// Usage: node scripts/capture-live.mjs [outDir] [--local]
//   --local  shoot the standalone embeds in .impeccable/live-content/embeds/<slug>.html instead
//            of the live pages (fallback if a live capture comes out clipped)
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { BASE, PAGES, BROWSER_CANDIDATES } from "./live-pages.mjs";

const args = process.argv.slice(2);
const local = args.includes("--local");
const out = args.find((a) => !a.startsWith("--")) ?? ".impeccable/live-content/screenshots";
mkdirSync(out, { recursive: true });

const executablePath = BROWSER_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) throw new Error("No Chrome or Edge found");

const VIEWS = [
  ["d", 1440, 900, false],
  ["m", 390, 844, true],
];

const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
const index = [];

for (const [slug, path] of PAGES) {
  const embedFile = resolve(".impeccable/live-content/embeds", `${slug}.html`);
  if (local && !existsSync(embedFile)) {
    console.log(`${slug.padEnd(30)} skipped (no embed file)`);
    continue;
  }
  const target = local ? pathToFileURL(embedFile).href : BASE + path;
  const row = { slug, mode: local ? "local" : "live", target };

  for (const [tag, w, h, mobile] of VIEWS) {
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
      await page.goto(target, { waitUntil: local ? "load" : "networkidle2", timeout: 90000 });

      if (!local) {
        await page.evaluate(() => {
          const btn = [...document.querySelectorAll("button, a")].find((b) => /^accept$/i.test((b.textContent || "").trim()));
          btn?.click();
        });
        await settleIframe(page);
      }

      await page.evaluate(async () => {
        await document.fonts.ready;
        const hh = document.documentElement.scrollHeight;
        for (let y = 0; y < hh; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 300));
      });
      if (!local) await settleIframe(page);

      await page.screenshot({ path: join(out, `${slug}-${tag}.png`), fullPage: true });
      row[`height_${tag}`] = await page.evaluate(() => document.documentElement.scrollHeight);
      row[`iframe_${tag}`] = await page.evaluate(() => document.querySelector("iframe")?.clientHeight ?? null);
    } catch (err) {
      row[`error_${tag}`] = String(err);
    }
    await page.close();
  }
  index.push(row);
  console.log(
    `${slug.padEnd(30)} d=${row.height_d ?? "-"}px (iframe ${row.iframe_d ?? "-"})  m=${row.height_m ?? "-"}px (iframe ${row.iframe_m ?? "-"})${row.error_d || row.error_m ? "  ERROR " + (row.error_d || row.error_m) : ""}`
  );
}

await browser.close();
writeFileSync(join(out, "index.json"), JSON.stringify(index, null, 2) + "\n");
console.log(`\n${index.length} pages -> ${out}`);

/** Waits until the embed iframe's height stops changing (two equal samples 500 ms apart). */
async function settleIframe(page) {
  let last = -1;
  for (let i = 0; i < 20; i++) {
    const h = await page.evaluate(() => document.querySelector("iframe")?.clientHeight ?? 0);
    if (h > 0 && h === last) return;
    last = h;
    await new Promise((r) => setTimeout(r, 500));
  }
}
