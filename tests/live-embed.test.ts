// Parser for the old GoDaddy site's "custom HTML" embeds. Runs under `node --test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  extractEmbeds,
  wrapStandalone,
  parseEmbed,
  parseNativeBlocks,
  styleTokens,
  toMarkdown,
} from "../scripts/lib/live-embed.mjs";

/** Encode a string the way GoDaddy's server serialises the srcDoc attribute. */
const attr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

const RESIZE =
  "<script>window.onmessage = function(event) {event.source.postMessage({iframeId: event.data, scrollHeight: document.body.getBoundingClientRect().height || document.body.scrollHeight}, event.origin);};</script>";

const CSS = `
    #pomi-test-page { font-family: Arial, Helvetica, sans-serif; color: #2b211d; background: #fffaf7; }
    #pomi-test-page .pomi-kicker { background: #f1d8cc; color: #6e3f31; border-radius: 999px; }
    #pomi-test-page .pomi-hero-grid { display: grid; grid-template-columns: 1.08fr 0.92fr; }
    #pomi-test-page .pomi-card { border-radius: 24px; box-shadow: 0 18px 45px rgba(74, 50, 40, 0.12); color: #2b211d; }
`;

const EMBED_BODY = `<body style='margin: 0'><section id="pomi-test-page">
  <style>${CSS}</style>
  <div class="pomi-hero">
    <span class="pomi-kicker">Test Kicker</span>
    <h1>Main Heading &amp; More</h1>
    <p class="pomi-lead">Lead paragraph with <a href="https://pomibrow.com/faqs#top">a link</a> and <strong>bold</strong>.</p>
    <div class="pomi-actions">
      <a class="pomi-btn pomi-btn-primary" href="https://pomibrow.com/contact-form">Book</a>
    </div>
    <div class="pomi-hero-card"><svg viewBox="0 0 10 10"><circle r="1"/></svg></div>
  </div>
  <div class="pomi-section">
    <div class="pomi-card-grid">
      <div class="pomi-card"><h3>Card One</h3><p>Card text.</p></div>
    </div>
    <h2>List Section</h2>
    <ul><li>First item</li><li>Second <em>item</em></li></ul>
  </div>
  <script type="application/ld+json">{"@type":"FAQPage","mainEntity":[{"name":"Q?"}]}</script>
</section>
</body>`;

const RAW_PAGE = `<html><head><title>Test Page | Pomi</title></head><body>
<section data-ux="Section"><iframe id="iframe-1" src="javascript: window.frameElement.getAttribute(&quot;srcdoc&quot;);" srcDoc="${attr(RESIZE + EMBED_BODY)}"></iframe></section>
<section data-ux="Section">
  <div data-ux="ContentBasic"><h2 data-ux="ContentHeading"><span>Native Heading</span></h2>
    <div data-ux="ContentText"><p style="margin:0"><span>Native paragraph.&nbsp;</span></p></div></div>
</section>
</body></html>`;

test("extractEmbeds decodes the srcDoc attribute and drops GoDaddy's resize script", () => {
  const docs = extractEmbeds(RAW_PAGE);
  assert.equal(docs.length, 1);
  assert.ok(docs[0].startsWith("<body style='margin: 0'><section id=\"pomi-test-page\">"));
  assert.ok(!docs[0].includes("window.onmessage"));
  assert.ok(docs[0].includes('<a href="https://pomibrow.com/faqs#top">'));
});

test("extractEmbeds returns nothing for a page without an embed", () => {
  assert.deepEqual(extractEmbeds("<html><body><p>native only</p></body></html>"), []);
});

test("wrapStandalone makes the embed a full document with a title and provenance comment", () => {
  const [doc] = extractEmbeds(RAW_PAGE);
  const html = wrapStandalone(doc, { title: "Test Page", url: "https://pomibrow.com/test", capturedAt: "2026-09-10" });
  assert.ok(html.startsWith("<!doctype html>"));
  assert.ok(html.includes("<title>Test Page</title>"));
  assert.ok(html.includes("https://pomibrow.com/test"));
  assert.ok(html.includes('<section id="pomi-test-page">'));
  assert.equal((html.match(/<body/g) ?? []).length, 1);
});

test("parseEmbed reads id, kicker, h1, and ordered blocks with container class, hrefs, inline marks", () => {
  const [doc] = extractEmbeds(RAW_PAGE);
  const r = parseEmbed(doc);
  assert.equal(r.embedId, "pomi-test-page");
  assert.equal(r.kicker, "Test Kicker");
  assert.equal(r.h1, "Main Heading & More");
  assert.deepEqual(
    r.blocks.map((b: any) => [b.tag, b.text, b.cls, b.href ?? null]),
    [
      ["kicker", "Test Kicker", "pomi-hero", null],
      ["h1", "Main Heading & More", "pomi-hero", null],
      ["p", "Lead paragraph with [a link](https://pomibrow.com/faqs#top) and **bold**.", "pomi-hero", null],
      ["button", "Book", "pomi-actions", "https://pomibrow.com/contact-form"],
      ["svg", "[inline SVG illustration]", "pomi-hero-card", null],
      ["h3", "Card One", "pomi-card", null],
      ["p", "Card text.", "pomi-card", null],
      ["h2", "List Section", "pomi-section", null],
      ["li", "First item", "pomi-section", null],
      ["li", "Second _item_", "pomi-section", null],
    ]
  );
  assert.deepEqual(r.links, ["https://pomibrow.com/faqs#top", "https://pomibrow.com/contact-form"]);
  assert.equal(r.wordCount, 24);
  assert.deepEqual(r.faqSchema, { "@type": "FAQPage", mainEntity: [{ name: "Q?" }] });
  assert.ok(r.styleCss.includes(".pomi-kicker"));
});

test("parseNativeBlocks reads GoDaddy ContentBasic sections and ignores the embed", () => {
  assert.deepEqual(parseNativeBlocks(RAW_PAGE), [
    { tag: "h2", text: "Native Heading" },
    { tag: "p", text: "Native paragraph." },
  ]);
});

test("styleTokens collects colours with counts, fonts, radii, shadows, grids and class names", () => {
  const t = styleTokens(CSS);
  assert.deepEqual(t.fonts, ["Arial, Helvetica, sans-serif"]);
  assert.deepEqual(t.colors, {
    "#2b211d": 2,
    "#fffaf7": 1,
    "#f1d8cc": 1,
    "#6e3f31": 1,
    "rgba(74, 50, 40, 0.12)": 1,
  });
  assert.deepEqual(t.radii, ["999px", "24px"]);
  assert.deepEqual(t.shadows, ["0 18px 45px rgba(74, 50, 40, 0.12)"]);
  assert.deepEqual(t.grids, ["1.08fr 0.92fr"]);
  assert.deepEqual(t.classes, ["pomi-kicker", "pomi-hero-grid", "pomi-card"]);
});

test("toMarkdown keeps heading levels, lists, buttons with hrefs, and marks container changes", () => {
  const [doc] = extractEmbeds(RAW_PAGE);
  const md = toMarkdown({ ...parseEmbed(doc), title: "Test Page | Pomi", url: "https://pomibrow.com/test", nativeBlocks: [{ tag: "h2", text: "Native Heading" }] });
  const lines = md.split("\n");
  assert.equal(lines[0], "# Main Heading & More");
  assert.ok(md.includes("Source: https://pomibrow.com/test"));
  assert.ok(md.includes("Kicker: Test Kicker"));
  assert.ok(md.includes("<!-- pomi-hero -->"));
  assert.ok(md.includes("**[Book](https://pomibrow.com/contact-form)**"));
  assert.ok(md.includes("<!-- pomi-card -->\n\n### Card One"));
  assert.ok(md.includes("## List Section"));
  assert.ok(md.includes("- First item\n- Second _item_"));
  assert.ok(md.includes("## Native sections (outside the embed)\n\n## Native Heading"));
});

const FAQ_DOC = `<body><section id="pomi-x">
  <div class="pomi-faq"><details><summary>Q one?</summary><p>A one.</p></details></div>
  <div class="pomi-trust"><div class="pomi-trust-item">Fast</div></div>
  <div class="pomi-pricing"><div class="pomi-price">$600 + $100</div></div>
  <div class="pomi-time-item"><div class="pomi-time-label">Day 1</div><div><h3>Bold</h3></div></div>
</section></body>`;

test("parseEmbed keeps FAQ questions from <summary> and text from leaf divs", () => {
  const r = parseEmbed(FAQ_DOC);
  assert.deepEqual(
    r.blocks.map((b: any) => [b.tag, b.text, b.cls]),
    [
      ["summary", "Q one?", "pomi-faq"],
      ["p", "A one.", "pomi-faq"],
      ["text", "Fast", "pomi-trust"],
      ["text", "$600 + $100", "pomi-pricing"],
      ["text", "Day 1", "pomi-time-item"],
      ["h3", "Bold", "pomi-time-item"],
    ]
  );
});

test("toMarkdown renders FAQ questions as level-4 headings above their answers", () => {
  const md = toMarkdown({ ...parseEmbed(FAQ_DOC), url: "u" });
  assert.ok(md.includes("#### Q one?\n\nA one."));
  assert.ok(md.includes("\nFast\n"));
});
