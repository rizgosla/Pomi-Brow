// Captures review screenshots of the running dev server with the locally installed Chrome.
// Usage: node scripts/capture.mjs [baseUrl] [outDir]
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://127.0.0.1:4401";
const out = process.argv[3] ?? ".impeccable/review";
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

const shots = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
  { name: "desktop-1280", width: 1280, height: 800, mobile: false },
];

const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
for (const s of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: s.width, height: s.height, deviceScaleFactor: 1, isMobile: s.mobile, hasTouch: s.mobile });
  // Settle the entrance motion so nothing reads as missing.
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  // Impeccable live mode keeps an SSE stream open on :8400, which never lets the network go idle.
  await page.setRequestInterception(true);
  page.on("request", (req) => (req.url().includes(":8400/") ? req.abort() : req.continue()));
  await page.goto(base + "/", { waitUntil: "load", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1500));
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Force lazy images to load by scrolling through the page once.
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 300));
  });
  await page.screenshot({ path: join(out, `${s.name}.png`), fullPage: true });
  // Also the first viewport alone, which is what the contract describes.
  await page.screenshot({ path: join(out, `${s.name}-viewport.png`), fullPage: false });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  console.log(`${s.name}: ${s.width}x${s.height} written`);
  await page.close();
}
await browser.close();
