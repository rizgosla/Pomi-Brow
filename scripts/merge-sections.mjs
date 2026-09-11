// Folds authored section files into the seed content.
//
// Reads .impeccable/live-content/sections/<slug>.json. A file with "title" is a standalone page
// (Safety, Aftercare) and goes into src/content/seed/pages.json; a file without one is a Learn
// article and its "sections" (and "lead", if any) go onto the matching entry in learn.json.
// Existing entries are replaced by slug; nothing else in either file is touched.
//
// Usage: node scripts/merge-sections.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = ".impeccable/live-content/sections";
const LEARN = "src/content/seed/learn.json";
const PAGES = "src/content/seed/pages.json";

const learn = JSON.parse(readFileSync(LEARN, "utf8"));
const pages = JSON.parse(readFileSync(PAGES, "utf8"));
const write = (file, data) => writeFileSync(file, JSON.stringify(data, null, 2) + "\n");

let articles = 0;
let standalone = 0;
for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const page = JSON.parse(readFileSync(join(DIR, file), "utf8"));
  if (!page.slug || !Array.isArray(page.sections)) throw new Error(`${file}: needs slug and sections`);

  if (page.title) {
    const i = pages.findIndex((p) => p.slug === page.slug);
    if (i >= 0) pages[i] = page;
    else pages.push(page);
    standalone++;
    console.log(`page    ${page.slug.padEnd(32)} ${page.sections.length} sections`);
    continue;
  }

  const article = learn.find((a) => a.slug === page.slug);
  if (!article) throw new Error(`${file}: no learn article with slug "${page.slug}"`);
  article.sections = page.sections;
  if (page.lead) article.lead = page.lead;
  articles++;
  console.log(`article ${page.slug.padEnd(32)} ${page.sections.length} sections`);
}

write(LEARN, learn);
write(PAGES, pages);
console.log(`\n${articles} articles into ${LEARN}, ${standalone} pages into ${PAGES}`);
