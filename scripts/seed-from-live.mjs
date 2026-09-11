// Folds the extracted live-site copy into the seed JSON.
//
// Reads .impeccable/live-content/*.json (produced by import-live-content.mjs) and writes:
//   - learn.json     body (portable text) + seoTitle, for the pages that actually had prose
//   - services.json  seoTitle
//
// Only two live Learn pages carried copy in the outer DOM, which is all import-live-content.mjs
// reads. That "empty shell" finding was wrong: every live page has a full body inside an
// <iframe> srcDoc embed. scripts/import-live-embeds.mjs captures those to
// .impeccable/live-content/embeds/<slug>.json in the same block shape; this script has not
// been pointed at them yet, so the other bodies stay absent and fall back to the summary.
//
// Usage: node scripts/seed-from-live.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const LIVE = ".impeccable/live-content";
const read = (slug) => JSON.parse(readFileSync(`${LIVE}/${slug}.json`, "utf8"));

// live extraction slug -> our learn.json slug
const ARTICLES = [
  ["how-long-it-lasts", "how-long-it-lasts"],
  ["are-powder-brows-for-me", "are-powder-brows-for-me"],
];

// Live H1s are the previous site's SEO titles and carry the Tustin/Irvine local signal.
const SEO = {};
for (const f of [
  "about-pomi", "faqs", "safety", "aftercare", "contact-form",
  "microblading", "microblading-shading", "ombre-powder-brows", "eyeliner",
  "lash-enhancement", "lip-tint", "scalp-micropigmentation",
  "good-pmu-candidates", "how-long-it-lasts", "pmu-healing-timeline",
  "prepare-for-appointment", "lip-tint-vs-lip-blush", "importance-of-touch-up",
  "are-powder-brows-for-me", "eyeliner-vs-lash-enhancement", "learn-scalp-micropigmentation",
]) {
  if (!existsSync(`${LIVE}/${f}.json`)) continue;
  const h1 = (read(f).h1 || "").trim();
  // One page's H1 extraction caught the cookie banner instead of the heading.
  if (!h1 || /this website uses cookies/i.test(h1)) continue;
  SEO[f] = h1;
}

let key = 0;
const k = () => `k${(key++).toString(36)}`;

function block(style, text) {
  return { _type: "block", _key: k(), style, markDefs: [], children: [{ _type: "span", _key: k(), text, marks: [] }] };
}
function listItem(text) {
  return { _type: "block", _key: k(), style: "normal", listItem: "bullet", level: 1, markDefs: [], children: [{ _type: "span", _key: k(), text, marks: [] }] };
}

/** Live blocks -> portable text. h4 becomes h3 (our scale has no h4); "- " lines become bullets. */
function toPortable(blocks) {
  const out = [];
  for (const b of blocks) {
    if (b.tag === "h1") continue; // the page title is rendered by the layout
    const text = b.text.trim();
    if (!text) continue;
    if (/^[-–•]\s+/.test(text)) {
      out.push(listItem(text.replace(/^[-–•]\s+/, "")));
      continue;
    }
    if (b.tag === "h2" || b.tag === "h3" || b.tag === "h4") {
      out.push(block(b.tag === "h2" ? "h2" : "h3", text));
      continue;
    }
    out.push(block("normal", text));
  }
  return out;
}

const learn = JSON.parse(readFileSync("src/content/seed/learn.json", "utf8"));
let bodies = 0;
for (const a of learn) {
  const pair = ARTICLES.find(([, ours]) => ours === a.slug);
  if (pair) {
    const live = read(pair[0]);
    a.body = toPortable(live.blocks);
    bodies++;
  }
  // seoTitle: prefer the live page whose slug matches ours, else the known alias
  const alias = a.slug === "scalp-micropigmentation" ? "learn-scalp-micropigmentation" : a.slug;
  if (SEO[alias]) a.seoTitle = SEO[alias];
}
writeFileSync("src/content/seed/learn.json", JSON.stringify(learn, null, 2) + "\n");

const services = JSON.parse(readFileSync("src/content/seed/services.json", "utf8"));
for (const s of services) if (SEO[s.slug]) s.seoTitle = SEO[s.slug];
writeFileSync("src/content/seed/services.json", JSON.stringify(services, null, 2) + "\n");

console.log(`learn.json: ${bodies} bodies, ${learn.filter((a) => a.seoTitle).length} seo titles`);
console.log(`services.json: ${services.filter((s) => s.seoTitle).length} seo titles`);
console.log(`\nNo body on live site (page falls back to its summary):`);
for (const a of learn) if (!a.body) console.log(`  - ${a.slug}`);
