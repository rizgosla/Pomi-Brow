// Section content model for the slide-style pages. Runs under `node --test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  validateSections,
  internalHrefs,
  resolveLayout,
  assignSides,
  toBlocks,
  effectiveRatio,
  pageRhythmProblems,
  photoProblems,
  balanced,
  withSlots,
  type Section,
  type ImageSlot,
  type Catalogue,
} from "../src/lib/sections.ts";

const ok: Section[] = [
  { type: "facts", items: [{ title: "Private studio", text: "One client at a time." }, { title: "Clean setup", text: "Fresh barriers." }, { title: "Single-use tools", text: "Opened in front of you." }] },
  { type: "statement", heading: "What makes it safer?", paragraphs: ["A clean studio and single-use tools."], callout: { tone: "voice", title: "My approach", text: "Nothing rushed." } },
  { type: "grid", heading: "Before you book", items: [{ title: "Arrive clean", text: "No makeup." }, { title: "Share health details", bullets: ["Medications", "Pregnancy"] }] },
  { type: "grid", heading: "Read next", items: [{ title: "Safety", text: "The studio.", href: "/safety", linkLabel: "Read" }, { title: "FAQs", text: "Short answers.", href: "/faqs", linkLabel: "Read" }, { title: "Touch-ups", text: "Why they matter.", href: "/learn/importance-of-touch-up", linkLabel: "Read" }] },
  { type: "sequence", heading: "The first week", kind: "timeline", items: [{ label: "Day 1", title: "Bold" }, { label: "Days 2 to 7", title: "Flaking" }, { label: "Week 2", title: "Settling" }] },
  { type: "compare", heading: "Tint or blush?", sides: [{ title: "Lip tint", bullets: ["Sheer"] }, { title: "Lip blush", bullets: ["Same technique"] }] },
  { type: "faq", items: [{ q: "Is it safe?", a: "With a careful artist, yes." }] },
  { type: "cta", heading: "Questions first.", text: "Call or write.", links: [{ label: "Aftercare", href: "/aftercare" }] },
];

const frame = (shot: string, ratio: ImageSlot["ratio"] = "4 / 5"): ImageSlot => ({ ratio, shot });

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
    { type: "grid", heading: "Half a link", items: [{ title: "a", href: "/safety" }, { title: "b" }] },
  ] as unknown as Section[];
  const problems = validateSections(bad);
  assert.deepEqual(
    problems.map((p) => p.index),
    [0, 1, 2, 3, 4, 5, 6, 7]
  );
  assert.match(problems[0].message, /unknown type "hero"/);
  assert.match(problems[1].message, /2 to 6 items/);
  assert.match(problems[2].message, /3 to 8 items/);
  assert.match(problems[3].message, /exactly 2 sides/);
  assert.match(problems[4].message, /q and a/);
  assert.match(problems[5].message, /heading/);
  assert.match(problems[6].message, /placeholder/i);
  assert.match(problems[7].message, /href and linkLabel/);
});

test("validateSections checks layouts: known name, block count, the photo a layout is built on", () => {
  const two = [{ title: "a", text: "x" }, { title: "b", text: "y" }];
  const bad = [
    { type: "grid", heading: "Unknown", layout: "carousel", items: two },
    { type: "grid", heading: "Bento of two", layout: "bento", image: frame("A shot"), items: two },
    { type: "grid", heading: "Split, no photo", layout: "split", items: two },
    { type: "faq", layout: "split", items: [{ q: "q", a: "a" }] },
    { type: "grid", heading: "Both", items: [{ title: "a", href: "/safety", linkLabel: "Read", links: [{ label: "x", href: "/faqs" }] }, { title: "b" }] },
    { type: "statement", heading: "Odd", layout: "bento", paragraphs: ["p"] },
    { type: "grid", heading: "Sideways", side: "top", items: two },
    { type: "grid", heading: "Tiles with a section photo", layout: "tiles", image: frame("s"), items: two },
    { type: "grid", heading: "Card photos in rows", layout: "rail", items: two.map((i) => ({ ...i, image: frame("c") })) },
    { type: "faq", image: frame("s"), items: [{ q: "q", a: "a" }] },
  ] as unknown as Section[];
  const problems = validateSections(bad);
  assert.deepEqual(problems.map((p) => p.index), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.match(problems[0].message, /unknown layout "carousel"/);
  assert.match(problems[1].message, /bento holds 3 to 4 blocks, not 2/);
  assert.match(problems[2].message, /split needs a section image/);
  assert.match(problems[3].message, /split faq needs an image/);
  assert.match(problems[4].message, /href or links, not both/);
  assert.match(problems[5].message, /"split" or "wide"/);
  assert.match(problems[6].message, /side must be/);
  assert.match(problems[7].message, /tiles has no place for a section image/);
  assert.match(problems[8].message, /rail does not show a block's own image/);
  assert.match(problems[9].message, /faq image shows only with layout "split"/);
});

test("internalHrefs lists every site-relative link across sections, callouts, link cards and cta", () => {
  const withLinks: Section[] = [
    { type: "grid", heading: "h", items: [{ title: "Safety", href: "/safety", linkLabel: "Read" }, { title: "b", links: [{ label: "Lip tint", href: "/services/lip-tint" }] }] },
    { type: "statement", heading: "h", paragraphs: ["p"], callout: { tone: "links", title: "Read next", links: [{ label: "FAQs", href: "/faqs" }, { label: "Call", href: "tel:+19494277664" }] } },
    { type: "cta", heading: "h", text: "t", links: [{ label: "Aftercare", href: "/aftercare" }, { label: "Site", href: "https://example.com" }] },
  ];
  assert.deepEqual(internalHrefs(withLinks), ["/safety", "/services/lip-tint", "/faqs", "/aftercare"]);
});

test("resolveLayout keeps an authored layout that fits and falls back when its photo is missing", () => {
  const four = [1, 2, 3, 4].map((n) => ({ title: `t${n}`, text: "x" }));
  const steps = [1, 2, 3].map((n) => ({ label: `${n}`, title: `s${n}` }));
  assert.equal(resolveLayout({ type: "grid", heading: "h", layout: "bento", image: frame("s"), items: four }), "bento");
  assert.equal(resolveLayout({ type: "grid", heading: "h", layout: "bento", items: four }), "tiles");
  assert.equal(resolveLayout({ type: "grid", heading: "h", image: frame("s"), items: four }), "split");
  assert.equal(resolveLayout({ type: "grid", heading: "h", items: four }), "tiles");
  assert.equal(resolveLayout({ type: "sequence", heading: "h", kind: "steps", items: steps }), "rail");
  assert.equal(resolveLayout({ type: "statement", heading: "h", paragraphs: ["p"] }), "solo");
  assert.equal(resolveLayout({ type: "statement", heading: "h", layout: "wide", image: frame("s", "5 / 2"), paragraphs: ["p"] }), "wide");
  assert.equal(resolveLayout({ type: "faq", layout: "split", items: [{ q: "q", a: "a" }] }), "grid");
  assert.equal(resolveLayout({ type: "cta", heading: "h", text: "t", image: frame("s", "1 / 1") }), "signoff");
  // The Studio pre-fills a new section's photo with only a ratio; that is not a photo yet.
  const prefilled = { ratio: "3 / 2" } as unknown as ImageSlot;
  assert.equal(resolveLayout({ type: "cta", heading: "h", text: "t", image: prefilled }), "band");
  assert.equal(resolveLayout({ type: "grid", heading: "h", image: prefilled, items: four }), "tiles");
  // A CMS section still carrying Sanity's _type has no type the site knows: nothing, not a crash.
  const unmapped = { _type: "sectionStatement", heading: "h", paragraphs: ["p"] } as unknown as Section;
  assert.equal(resolveLayout(unmapped), "none");
  assert.deepEqual(assignSides([unmapped]), [null]);
});

test("assignSides alternates away from the header photo and respects an authored side", () => {
  const img = frame("s");
  const four = [1, 2, 3, 4].map((n) => ({ title: `t${n}`, text: "x" }));
  const page: Section[] = [
    { type: "facts", items: [{ title: "a", text: "b" }, { title: "c", text: "d" }] },
    { type: "statement", heading: "h", image: img, paragraphs: ["p"] },
    { type: "grid", heading: "h", items: four },
    { type: "grid", heading: "h", layout: "bento", image: img, items: four },
    { type: "grid", heading: "h", layout: "rail", items: four },
    { type: "grid", heading: "h", layout: "split", side: "left", image: img, items: four },
    { type: "faq", layout: "split", image: img, items: [{ q: "q", a: "a" }] },
  ];
  assert.deepEqual(assignSides(page, "right"), [null, "left", null, "right", "left", "left", "left"]);
  // The strip beside a ledger's or a wide statement's head sits on a side like any photograph;
  // a ledger without one has no side.
  const strips: Section[] = [
    { type: "statement", heading: "h", layout: "wide", image: frame("s", "5 / 2"), paragraphs: ["p"] },
    { type: "grid", heading: "h", layout: "ledger", image: frame("s", "5 / 2"), items: four },
    { type: "grid", heading: "h", layout: "ledger", items: four },
  ];
  assert.deepEqual(assignSides(strips, "right"), ["left", "right", null]);
});

test("toBlocks numbers steps, tags timeline moments and turns link cards into one-link blocks", () => {
  const seq = toBlocks({ type: "sequence", heading: "h", kind: "steps", items: [{ label: "a", title: "One" }, { label: "b", title: "Two" }, { label: "c", title: "Three" }] });
  assert.deepEqual(seq.map((b) => b.marker), [{ kind: "number", n: 1 }, { kind: "number", n: 2 }, { kind: "number", n: 3 }]);
  const tl = toBlocks({ type: "sequence", heading: "h", kind: "timeline", items: [{ label: "Day 1", title: "Bold" }, { label: "Day 5", title: "Flaking" }, { label: "Week 6", title: "Settled" }] });
  assert.deepEqual(tl[0].marker, { kind: "tag", label: "Day 1" });
  const grid = toBlocks({ type: "grid", heading: "h", items: [{ title: "Safety", text: "t", href: "/safety", linkLabel: "Read" }, { title: "Brows", text: "t", links: [{ label: "Microblading", href: "/services/microblading" }] }] });
  assert.deepEqual(grid[0].links, [{ label: "Read", href: "/safety" }]);
  assert.equal(grid[1].links?.length, 1);
  assert.equal(grid[0].marker, undefined);
  const emptied = toBlocks({ type: "grid", heading: "h", items: [{ title: "a", href: "/safety", linkLabel: "Read", links: [] }, { title: "b" }] });
  assert.deepEqual(emptied[0].links, [{ label: "Read", href: "/safety" }]);
  const rail = toBlocks({ type: "grid", heading: "h", layout: "rail", items: [{ title: "a" }, { title: "b" }, { title: "c" }] });
  assert.deepEqual(rail[2].marker, { kind: "number", n: 3 });
});

test("withSlots removes image slots that are not really there, at section and block level", () => {
  const prefilled = { ratio: "3 / 2" } as unknown as ImageSlot;
  const s = withSlots({ type: "grid", heading: "h", image: prefilled, items: [{ title: "a", image: prefilled }, { title: "b", image: frame("b") }] });
  assert.equal(s.image, undefined);
  assert.equal(s.items[0].image, undefined);
  assert.equal(s.items[1].image?.shot, "b");
});

test("effectiveRatio keeps an authored ratio the role allows and otherwise uses the role default", () => {
  assert.equal(effectiveRatio("split", "1 / 1"), "1 / 1");
  assert.equal(effectiveRatio("split", "3 / 2"), "4 / 5");
  assert.equal(effectiveRatio("strip", "4 / 5"), "5 / 2");
  assert.equal(effectiveRatio("item"), "1 / 1");
});

test("balanced allows 1.5x or a 3-word difference", () => {
  assert.equal(balanced([6, 9]), true);
  assert.equal(balanced([6, 10]), false);
  assert.equal(balanced([10, 13]), true);
  assert.equal(balanced([2, 5]), true);
});

test("pageRhythmProblems flags each editorial rule at the section that breaks it", () => {
  const img = frame("A specific shot");
  const four = [1, 2, 3, 4].map((n) => ({ title: `Item ${n}`, text: "Six words of text in here." }));
  const cases: [string, Section[], RegExp][] = [
    ["same layout twice", [
      { type: "grid", heading: "a", layout: "tiles", items: four.map((i) => ({ ...i, image: img })) },
      { type: "grid", heading: "b", layout: "tiles", items: four.slice(0, 3).map((i) => ({ ...i, image: img })) },
    ], /same layout as the section before/],
    ["header side repeated", [
      { type: "statement", heading: "a", side: "right", image: img, paragraphs: ["p"] },
    ], /same side as the header/],
    ["neighbouring sides", [
      { type: "statement", heading: "a", image: img, paragraphs: ["p"] },
      { type: "grid", heading: "b", layout: "rail", image: img, items: four },
    ], /photo on the left again/],
    ["three of a layout", [
      { type: "grid", heading: "a", layout: "bento", image: img, items: four },
      { type: "grid", heading: "b", layout: "rail", image: img, items: four },
      { type: "grid", heading: "c", layout: "bento", side: "left", image: img, items: four },
      { type: "grid", heading: "d", layout: "ledger", image: frame("s", "5 / 2"), items: four },
      { type: "grid", heading: "e", layout: "bento", side: "left", image: img, items: four },
    ], /used 3 times/],
    ["three splits in a row", [
      { type: "statement", heading: "a", image: img, paragraphs: ["p"] },
      { type: "grid", heading: "b", layout: "rail", image: img, items: four },
      { type: "grid", heading: "c", layout: "split", image: img, items: four },
      { type: "faq", layout: "split", image: img, items: [{ q: "q", a: "a" }] },
      { type: "statement", heading: "e", side: "right", image: img, paragraphs: ["p"] },
    ], /third split-style section in a row/],
    ["no image", [{ type: "grid", heading: "a", items: four }], /grid has no image/],
    ["a strip beside the same side", [
      { type: "grid", heading: "a", layout: "split", side: "right", image: img, items: four },
      { type: "grid", heading: "b", layout: "ledger", side: "right", image: frame("s", "5 / 2"), items: four },
    ], /photo on the right again/],
    ["wide beside ledger", [
      { type: "statement", heading: "a", layout: "wide", image: frame("s", "5 / 2"), paragraphs: ["p"] },
      { type: "grid", heading: "b", layout: "ledger", items: four },
    ], /same layout as the section before it \("ledger"\)/],
    ["card photos a layout drops", [
      { type: "grid", heading: "a", items: [...four, { title: "Item 5", text: "x" }].map((i) => ({ ...i, image: img })) },
    ], /grid has no image/],
    ["uneven facts", [
      { type: "facts", items: [{ title: "a", text: "one two" }, { title: "b", text: "one two three four five six seven eight nine" }] },
    ], /facts are uneven/],
    ["long tile", [
      { type: "grid", heading: "a", layout: "tiles", items: [{ title: "Long", image: img, text: Array(30).fill("word").join(" ") }, { title: "Short", image: img, text: Array(28).fill("word").join(" ") }] },
    ], /runs 30 words/],
    ["too many notes", [
      { type: "statement", heading: "a", image: img, paragraphs: ["p"], callout: { tone: "note", title: "n", text: "t" } },
      { type: "grid", heading: "b", layout: "tiles", items: four.map((i) => ({ ...i, image: img })), callout: { tone: "voice", title: "n", text: "t" } },
    ], /a note right after another note/],
    ["three paragraphs", [{ type: "statement", heading: "a", side: "left", image: img, paragraphs: ["p", "q", "r"] }], /3 paragraphs/],
  ];
  for (const [name, sections, message] of cases) {
    const problems = pageRhythmProblems(sections);
    assert.ok(problems.some((p) => message.test(p.message)), `${name}: expected ${message}, got ${JSON.stringify(problems)}`);
  }
  const long: Section[] = Array.from({ length: 9 }, (_, i) =>
    i % 2 === 0
      ? ({ type: "grid", heading: `g${i}`, layout: "tiles", items: [{ title: "a", text: "x", image: img }, { title: "b", text: "y", image: img }] } as Section)
      : ({ type: "grid", heading: `r${i}`, layout: "ledger", image: frame("s", "5 / 2"), items: four } as Section)
  );
  assert.ok(pageRhythmProblems(long, { learn: true }).some((p) => /8 at most/.test(p.message)));
});

test("photoProblems checks refs, repeats, frame ratios, strips and pair captions", () => {
  const catalogue: Catalogue = {
    _about: "test",
    "brows/single": { kind: "single", ratios: ["1 / 1", "4 / 5", "3 / 2", "5 / 2"] },
    "brows/pair": { kind: "pair-v", ratios: ["1 / 1", "4 / 5"] },
    "brows/twin": { kind: "single", ratios: ["1 / 1"], duplicateOf: "brows/single" },
  };
  const slot = (ref: string, ratio: ImageSlot["ratio"], detail?: string): ImageSlot => ({ ratio, shot: "s", photo: { ref, alt: "a", detail } });
  const page = {
    sections: [
      { type: "statement", heading: "a", image: slot("brows/single", "4 / 5"), paragraphs: ["p"] },
      { type: "statement", heading: "b", layout: "wide", image: slot("brows/pair", "5 / 2", "Before and after"), paragraphs: ["p"] },
      { type: "grid", heading: "c", layout: "tiles", items: [{ title: "x", image: slot("brows/twin", "1 / 1") }, { title: "y", image: slot("nope/01", "1 / 1") }] },
      { type: "cta", heading: "d", text: "t", image: slot("brows/pair", "1 / 1") },
    ] as Section[],
  };
  const messages = photoProblems(page, catalogue).map((p) => p.message);
  assert.ok(messages.some((m) => /cannot be framed at 5 \/ 2/.test(m)), messages.join("\n"));
  assert.ok(messages.some((m) => /strips take single shots only/.test(m)));
  assert.ok(messages.some((m) => /"brows\/twin" is already on this page/.test(m)));
  assert.ok(messages.some((m) => /"nope\/01" is not in the catalogue/.test(m)));
  assert.ok(messages.some((m) => /caption it "Before and after"/.test(m)));
  assert.deepEqual(photoProblems({ sections: [page.sections[0]] }, catalogue, ["brows/twin"]).map((p) => p.message), [
    'photo "brows/single" is already on this page',
  ]);
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

interface AuthoredPage {
  slug: string;
  sections: Section[];
  lead?: ImageSlot;
  learn: boolean;
  cover?: string;
}

function authoredPages(): AuthoredPage[] {
  const learn = JSON.parse(readFileSync("src/content/seed/learn.json", "utf8"));
  const pages = JSON.parse(readFileSync("src/content/seed/pages.json", "utf8"));
  return [
    ...learn.filter((a: any) => a.sections).map((a: any) => ({ slug: a.slug, sections: a.sections, lead: a.lead, learn: true, cover: a.cover?.ref })),
    ...pages.map((p: any) => ({ slug: p.slug, sections: p.sections, lead: p.lead, learn: false })),
  ];
}

test("every authored page validates and links only to routes that exist", () => {
  const routes = knownRoutes();
  const authored = authoredPages();
  assert.ok(authored.length >= 1, "at least one page has sections");
  for (const page of authored) {
    const problems = validateSections(page.sections);
    assert.deepEqual(problems, [], `${page.slug}: ${problems.map((p) => `#${p.index} ${p.message}`).join("; ")}`);
    for (const href of internalHrefs(page.sections)) {
      assert.ok(routes.has(href.replace(/#.*$/, "")), `${page.slug}: link to ${href} has no route`);
    }
  }
});

test("every authored page keeps the editorial rhythm and uses its photos correctly", () => {
  const catalogue: Catalogue = existsSync("src/assets/gallery/catalogue.json")
    ? JSON.parse(readFileSync("src/assets/gallery/catalogue.json", "utf8"))
    : {};
  for (const page of authoredPages()) {
    const rhythm = pageRhythmProblems(page.sections, { headerSide: "right", learn: page.learn });
    assert.deepEqual(rhythm, [], `${page.slug}: ${rhythm.map((p) => `#${p.index} ${p.message}`).join("; ")}`);
    const photos = photoProblems(page, catalogue, page.cover ? [page.cover] : []);
    assert.deepEqual(photos, [], `${page.slug}: ${photos.map((p) => `#${p.index} ${p.message}`).join("; ")}`);
  }
});

test("every authored page names a layout for each section it composes", () => {
  // resolveLayout() has fallbacks for a section written before the layout library, but an
  // authored page chooses: a fallback on a finished page means a section nobody placed.
  for (const page of authoredPages()) {
    page.sections.forEach((s: any, i: number) => {
      if (s.type === "facts" || s.type === "cta") return;
      assert.ok(s.layout, `${page.slug} #${i} (${s.type} "${s.heading ?? ""}") names no layout`);
    });
  }
});
