// Checks one authored page file before it is merged into the seed content: structure, the
// editorial rhythm (DESIGN.md "Slide pages"), real photos against the gallery catalogue, and
// internal links. The same rules the tests run, for one file, so a page can be written and
// checked without touching src/content/seed/*.json or building the site.
//
// A file with a "title" is a standalone page (Safety, Aftercare); one without is a Learn guide,
// whose cover photo (from learn.json) counts as already used on the page.
//
// Usage: node scripts/check-sections.mjs <page.json> [more.json ...]
// Exit code 0 means every file passed.
import { readFileSync, existsSync } from "node:fs";
import { validateSections, pageRhythmProblems, photoProblems, internalHrefs } from "../src/lib/sections.ts";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node scripts/check-sections.mjs <page.json> [more.json ...]");
  process.exit(1);
}

const learn = JSON.parse(readFileSync("src/content/seed/learn.json", "utf8"));
const services = JSON.parse(readFileSync("src/content/seed/services.json", "utf8"));
const catalogue = existsSync("src/assets/gallery/catalogue.json")
  ? JSON.parse(readFileSync("src/assets/gallery/catalogue.json", "utf8"))
  : {};
const routes = new Set([
  "/", "/about", "/safety", "/aftercare", "/faqs", "/contact", "/learn",
  ...learn.map((a) => `/learn/${a.slug}`),
  ...services.map((s) => `/services/${s.slug}`),
]);

let failed = 0;
for (const file of files) {
  const page = JSON.parse(readFileSync(file, "utf8"));
  const isGuide = !page.title;
  const article = isGuide ? learn.find((a) => a.slug === page.slug) : undefined;
  const problems = [];
  if (!page.slug || !Array.isArray(page.sections)) problems.push("needs slug and sections");
  else {
    if (isGuide && !article) problems.push(`no learn article with slug "${page.slug}"`);
    const lead = page.lead ?? article?.lead;
    for (const p of validateSections(page.sections)) problems.push(`#${p.index} ${p.message}`);
    for (const p of pageRhythmProblems(page.sections, { headerSide: "right", learn: isGuide })) problems.push(`#${p.index} ${p.message}`);
    const used = article?.cover?.ref ? [article.cover.ref] : [];
    for (const p of photoProblems({ lead, sections: page.sections }, catalogue, used)) problems.push(`#${p.index} ${p.message}`);
    for (const href of internalHrefs(page.sections)) if (!routes.has(href.replace(/#.*$/, ""))) problems.push(`link to ${href} has no route`);
    const header = [page.title, page.lede, page.meta, page.metaLabel, page.facts, lead?.shot, lead?.photo?.alt];
    if (/placeholder/i.test(JSON.stringify(header))) problems.push('header text contains "placeholder"');
  }
  if (problems.length) {
    failed++;
    console.log(`✗ ${file}`);
    for (const p of problems) console.log(`    ${p}`);
  } else {
    console.log(`✓ ${file}  (${page.sections.length} sections)`);
  }
}
process.exit(failed ? 1 : 0);
