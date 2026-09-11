// Cuts a tall full-page capture into readable slices for review.
// Usage: node scripts/crop.mjs <png> <sliceHeight> <outPrefix>
import sharp from "sharp";
const [, , file, sliceArg, prefix] = process.argv;
const slice = Number(sliceArg ?? 1200);
const meta = await sharp(file).metadata();
let i = 0;
for (let top = 0; top < meta.height; top += slice, i++) {
  const h = Math.min(slice, meta.height - top);
  await sharp(file).extract({ left: 0, top, width: meta.width, height: h }).toFile(`${prefix}-${String(i).padStart(2, "0")}.png`);
}
console.log(`${i} slices of ${meta.width}x${slice} from ${meta.width}x${meta.height}`);
