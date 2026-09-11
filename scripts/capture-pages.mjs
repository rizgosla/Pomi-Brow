// Screenshots a set of routes at desktop and mobile in one pass.
// Usage: node scripts/capture-pages.mjs [baseUrl] [outDir]
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const base = process.argv[2] ?? "http://localhost:4402";
const out = process.argv[3] ?? ".impeccable/critique/capture-pages";
mkdirSync(out, { recursive: true });

const candidates = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const executablePath = candidates.find((p) => existsSync(p));
if (!executablePath) throw new Error("No Chrome or Edge found");

const ROUTES = [
  ["home", "/"],
  ["service", "/services/microblading"],
  ["service-lip", "/services/lip-tint"],
  ["learn-article", "/learn/how-long-it-lasts"],
  ["learn-thin", "/learn/pmu-healing-timeline"],
  ["learn-index", "/learn"],
  ["about", "/about"],
  ["safety", "/safety"],
  ["aftercare", "/aftercare"],
  ["faqs", "/faqs"],
  ["contact", "/contact"],
];
const VIEWS = [
  ["d", 1440, 900, false],
  ["m", 390, 844, true],
];

const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
for (const [name, path] of ROUTES) {
  for (const [tag, w, h, mobile] of VIEWS) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.goto(base + path, { waitUntil: "load", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 900));
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
    await page.screenshot({ path: join(out, `${name}-${tag}.png`), fullPage: true });
    await page.screenshot({ path: join(out, `${name}-${tag}-top.png`) });
    await page.close();
  }
  console.log(`captured ${name}`);
}
await browser.close();
