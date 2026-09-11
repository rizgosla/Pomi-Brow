// Builds favicons and the Open Graph image from the exported logo and the hero photo.
// Usage: node scripts/make-favicons.mjs

import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
mkdirSync(pub, { recursive: true });

const GROUND = "#efe3da";
const logoSvg = readFileSync(join(root, "src/assets/brand/logo-black.svg"), "utf8");

// favicon.svg: the wordmark centered on a square of the ground color.
const inner = logoSvg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const vb = logoSvg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
const [, , lw, lh] = vb;
const side = Math.max(lw, lh) * 1.18;
const ox = (side - lw) / 2;
const oy = (side - lh) / 2;
const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side.toFixed(2)} ${side.toFixed(2)}">
<rect width="100%" height="100%" fill="${GROUND}"/>
<g transform="translate(${ox.toFixed(2)} ${oy.toFixed(2)})">${inner}</g>
</svg>`;
writeFileSync(join(pub, "favicon.svg"), favSvg);

const favPng = Buffer.from(favSvg);
await sharp(favPng, { density: 384 }).resize(32, 32).png().toFile(join(pub, "favicon-32.png"));
await sharp(favPng, { density: 384 }).resize(180, 180).png().toFile(join(pub, "apple-touch-icon.png"));
await sharp(favPng, { density: 384 }).resize(512, 512).png().toFile(join(pub, "icon-512.png"));

// og.jpg: the hero brow, 1200x630, with the wordmark in the corner.
const hero = join(root, "src/assets/gallery/microblading/01.jpg");
const mark = await sharp(Buffer.from(logoSvg), { density: 300 })
  .resize({ width: 260 })
  .png()
  .toBuffer();
await sharp(hero)
  .resize(1200, 630, { fit: "cover", position: "west" })
  .composite([{ input: mark, gravity: "southeast", top: 630 - 174 - 40, left: 1200 - 260 - 48 }])
  .jpeg({ quality: 82 })
  .toFile(join(pub, "og.jpg"));

console.log("favicon.svg, favicon-32.png, apple-touch-icon.png, icon-512.png, og.jpg written");
