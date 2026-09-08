// Copies the client's MEDIA/*.jpeg into src/assets/gallery/<service-slug>/NN.jpg
// so Astro's <Image> can resize and optimize them at build time.
// The MEDIA folder is flat; the service name is the filename prefix.
//
// Usage: node scripts/import-media.mjs

import { readdirSync, mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "MEDIA");
const dest = join(root, "src", "assets", "gallery");

// Longest prefixes first so "Microblading - Shading Brows" wins over "Microblading".
const services = [
  ["Microblading - Shading Brows", "microblading-shading"],
  ["Scalp Micropigmentation", "scalp-micropigmentation"],
  ["lash enhancement", "lash-enhancement"],
  ["Powder Brows", "ombre-powder-brows"],
  ["Microblading", "microblading"],
  ["Eyeliner", "eyeliner"],
  ["Lip Tint", "lip-tint"],
];

const manifest = {};
const files = readdirSync(src).filter((f) => /\.jpe?g$/i.test(f));

for (const file of files) {
  const match = services.find(([prefix]) =>
    file.toLowerCase().startsWith(prefix.toLowerCase())
  );
  if (!match) {
    console.warn(`skip (no service prefix): ${file}`);
    continue;
  }
  const [, slug] = match;
  const num = (file.match(/- (\d+)\.jpe?g$/i) || [, "1"])[1].padStart(2, "0");
  const outDir = join(dest, slug);
  mkdirSync(outDir, { recursive: true });
  const outName = `${num}.jpg`;
  copyFileSync(join(src, file), join(outDir, outName));
  (manifest[slug] ||= []).push({ file: outName, source: `MEDIA/${file}` });
}

for (const slug of Object.keys(manifest)) {
  manifest[slug].sort((a, b) => a.file.localeCompare(b.file));
}

writeFileSync(
  join(dest, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);

for (const [slug, list] of Object.entries(manifest)) {
  console.log(`${slug}: ${list.length}`);
}
