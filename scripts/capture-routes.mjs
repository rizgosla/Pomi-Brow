// Screenshots given routes of the built site at desktop and mobile, starting and stopping
// a preview server itself. For checking a page after a build without a dev server running.
//
// Usage: node scripts/capture-routes.mjs <outDir> <route> [route...]
//   e.g. node scripts/capture-routes.mjs .impeccable/critique/capture-sections safety learn/how-long-it-lasts
import puppeteer from "puppeteer-core";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { BROWSER_CANDIDATES } from "./live-pages.mjs";

// Routes may be given without the leading slash: Git Bash on Windows rewrites "/safety"
// into a filesystem path before node ever sees it.
const [out, ...rawRoutes] = process.argv.slice(2);
const routes = rawRoutes.map((r) => (r === "home" ? "/" : "/" + r.replace(/^\/+/, "")));
if (!out || routes.length === 0) {
  console.error("Usage: node scripts/capture-routes.mjs <outDir> <route> [route...]");
  process.exit(1);
}
mkdirSync(out, { recursive: true });

const PORT = 4402;
const base = `http://localhost:${PORT}`;
const preview = spawn("npx", ["astro", "preview", "--port", String(PORT)], { shell: true, stdio: "ignore" });

try {
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    try {
      up = (await fetch(base + routes[0])).ok;
    } catch {
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  if (!up) throw new Error(`preview did not answer at ${base}${routes[0]}`);

  const executablePath = BROWSER_CANDIDATES.find((p) => existsSync(p));
  if (!executablePath) throw new Error("No Chrome or Edge found");
  const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });

  for (const route of routes) {
    const name = route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
    for (const [tag, w, h, mobile] of [
      ["d", 1440, 900, false],
      ["m", 390, 844, true],
    ]) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
      await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
      const res = await page.goto(base + route, { waitUntil: "load", timeout: 60000 });
      if (!res || (res.status() >= 400)) throw new Error(`${route}: HTTP ${res?.status()}`);
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
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      console.log(`${name}-${tag}.png  ${height}px`);
      await page.close();
    }
  }
  await browser.close();
} finally {
  // Windows leaves the npx shell's children behind unless the tree is killed.
  if (process.platform === "win32") spawn("taskkill", ["/PID", String(preview.pid), "/T", "/F"], { stdio: "ignore" });
  else preview.kill();
}
