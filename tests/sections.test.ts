// Section content model for the slide-style pages. Runs under `node --test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateSections, internalHrefs, type Section } from "../src/lib/sections.ts";

const ok: Section[] = [
  { type: "facts", items: [{ title: "Private studio", text: "One client at a time." }, { title: "Clean setup", text: "Fresh barriers." }, { title: "Single-use tools", text: "Opened in front of you." }] },
  { type: "statement", heading: "What makes it safer?", paragraphs: ["A clean studio and single-use tools."], callout: { tone: "voice", title: "My approach", text: "Nothing rushed." } },
  { type: "grid", heading: "Before you book", items: [{ title: "Arrive clean", text: "No makeup." }, { title: "Share health details", bullets: ["Medications", "Pregnancy"] }] },
  { type: "sequence", heading: "The first week", kind: "timeline", items: [{ label: "Day 1", title: "Bold" }, { label: "Days 2 to 7", title: "Flaking" }, { label: "Week 2", title: "Settling" }] },
  { type: "compare", heading: "Tint or blush?", sides: [{ title: "Lip tint", bullets: ["Sheer"] }, { title: "Lip blush", bullets: ["Same technique"] }] },
  { type: "faq", items: [{ q: "Is it safe?", a: "With a careful artist, yes." }] },
  { type: "cta", heading: "Questions first.", text: "Call or write.", links: [{ label: "Aftercare", href: "/aftercare" }] },
];

test("validateSections accepts a well-formed page and returns no problems", () => {
  assert.deepEqual(validateSections(ok), []);
});

test("validateSections names the section index and the rule for each problem", () => {
  const bad = [
    { type: "hero", heading: "x" },
    { type: "grid", heading: "Too few", items: [{ title: "one" }] },
    { type: "sequence", heading: "Short", kind: "steps", items: [{ label: "1", title: "a" }, { label: "2", title: "b" }] },
    { type: "compare", heading: "One side", sides: [{ title: "a", bullets: [] }] },
    { type: "faq", items: [{ q: "Only a question" }] },
    { type: "statement", paragraphs: ["No heading"] },
    { type: "grid", heading: "Wording", items: [{ title: "Photo", text: "This is a placeholder card." }, { title: "b" }] },
  ] as unknown as Section[];
  const problems = validateSections(bad);
  assert.deepEqual(
    problems.map((p) => p.index),
    [0, 1, 2, 3, 4, 5, 6]
  );
  assert.match(problems[0].message, /unknown type "hero"/);
  assert.match(problems[1].message, /2 to 4 items/);
  assert.match(problems[2].message, /at least 3 items/);
  assert.match(problems[3].message, /exactly 2 sides/);
  assert.match(problems[4].message, /q and a/);
  assert.match(problems[5].message, /heading/);
  assert.match(problems[6].message, /placeholder/i);
});

test("internalHrefs lists every site-relative link across sections, callouts and cta", () => {
  const withLinks: Section[] = [
    { type: "statement", heading: "h", paragraphs: ["p"], callout: { tone: "links", title: "Read next", links: [{ label: "FAQs", href: "/faqs" }, { label: "Call", href: "tel:+19494277664" }] } },
    { type: "cta", heading: "h", text: "t", links: [{ label: "Aftercare", href: "/aftercare" }, { label: "Site", href: "https://example.com" }] },
  ];
  assert.deepEqual(internalHrefs(withLinks), ["/faqs", "/aftercare"]);
});

/** Routes that exist on the site, derived from the seed content, for the link check below. */
function knownRoutes(): Set<string> {
  const learn = JSON.parse(readFileSync("src/content/seed/learn.json", "utf8"));
  const services = JSON.parse(readFileSync("src/content/seed/services.json", "utf8"));
  return new Set([
    "/", "/about", "/safety", "/aftercare", "/faqs", "/contact", "/learn",
    ...learn.map((a: any) => `/learn/${a.slug}`),
    ...services.map((s: any) => `/services/${s.slug}`),
  ]);
}

test("every authored page validates and links only to routes that exist", () => {
  const routes = knownRoutes();
  const learn = JSON.parse(readFileSync("src/content/seed/learn.json", "utf8"));
  const pages = JSON.parse(readFileSync("src/content/seed/pages.json", "utf8"));
  const authored = [...learn.filter((a: any) => a.sections), ...pages].map((p: any) => ({ slug: p.slug, sections: p.sections }));
  assert.ok(authored.length >= 1, "at least one page has sections");
  for (const page of authored) {
    const problems = validateSections(page.sections);
    assert.deepEqual(problems, [], `${page.slug}: ${problems.map((p) => `#${p.index} ${p.message}`).join("; ")}`);
    for (const href of internalHrefs(page.sections)) {
      assert.ok(routes.has(href.replace(/#.*$/, "")), `${page.slug}: link to ${href} has no route`);
    }
  }
});
