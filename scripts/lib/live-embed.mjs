// Parser for the previous GoDaddy site's "custom HTML" page embeds.
//
// Every page body on pomibrow.com is a hand-authored HTML document that GoDaddy serialises
// into the `srcDoc` attribute of an <iframe> (entity-encoded) and renders client-side via
// `src="javascript: window.frameElement.getAttribute('srcdoc')"`. Text extractors that walk
// the outer DOM never see it. This module decodes that attribute and turns the embed into
// (a) a standalone HTML file, (b) ordered content blocks, (c) style tokens, (d) markdown.
//
// Pure functions, no I/O. Exercised by tests/live-embed.test.ts.
import { parse } from "node-html-parser";
import { decodeHTML, escapeUTF8 } from "entities";

const RESIZE_SCRIPT = /^\s*<script>window\.onmessage[\s\S]*?<\/script>/;
const BLOCK_TAGS = new Set(["h1", "h2", "h3", "h4", "p", "li"]);
// An element whose element children are only these is a text leaf (a price, a badge, a label).
const LEAF_INLINE = new Set(["strong", "em", "b", "i", "br", "span", "sup", "sub"]);

/** Every embed on a served page, decoded, with GoDaddy's iframe-resize script removed. */
export function extractEmbeds(rawHtml) {
  const out = [];
  for (const m of rawHtml.matchAll(/\ssrcdoc="([^"]*)"/gi)) {
    out.push(decodeHTML(m[1]).replace(RESIZE_SCRIPT, ""));
  }
  return out;
}

/** Wraps a decoded embed (which starts at <body>) so it opens on its own in a browser. */
export function wrapStandalone(doc, { title, url, capturedAt }) {
  return [
    "<!doctype html>",
    `<!-- Captured from ${url} on ${capturedAt}. Reference copy of the previous site's page embed; the copy and design belong to Pomi B. Brow Studio. -->`,
    '<html lang="en">',
    `<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeUTF8(title)}</title></head>`,
    doc.trim(),
    "</html>",
    "",
  ].join("\n");
}

const pomiClass = (el) => el?.classList?.value?.find((c) => c.startsWith("pomi-")) ?? null;

/** First `pomi-*` class on the nearest ancestor (not the node itself). */
function containerClass(el) {
  for (let p = el.parentNode; p; p = p.parentNode) {
    const c = pomiClass(p);
    if (c) return c;
  }
  return null;
}

const squash = (s) => s.replace(/ /g, " ").replace(/\s+/g, " ");

/** Inline content as markdown: links, bold, italics; everything else is its text. */
function inlineMd(node) {
  if (node.nodeType === 3) return squash(decodeHTML(node.rawText));
  if (node.nodeType !== 1) return "";
  const tag = node.rawTagName?.toLowerCase();
  if (tag === "br") return " ";
  if (tag === "svg") return "";
  const inner = node.childNodes.map(inlineMd).join("");
  if (tag === "a") return `[${inner.trim()}](${node.getAttribute("href") ?? ""})`;
  if (tag === "strong" || tag === "b") return `**${inner.trim()}**`;
  if (tag === "em" || tag === "i") return `_${inner.trim()}_`;
  return inner;
}

const textOf = (node) => inlineMd(node).trim();

/** Ordered content blocks plus metadata for one decoded embed. */
export function parseEmbed(doc) {
  const root = parse(doc);
  const section = root.querySelector("section[id], div[id]");
  const embedId = section?.getAttribute("id") ?? null;

  const styleCss = root.querySelectorAll("style").map((s) => s.innerHTML).join("\n");
  let faqSchema = null;
  for (const s of root.querySelectorAll("script")) {
    if (/ld\+json/.test(s.getAttribute("type") ?? "")) {
      try {
        faqSchema = JSON.parse(decodeHTML(s.innerHTML));
      } catch {
        /* malformed schema: leave null, the raw text is still in the .html file */
      }
    }
    s.remove();
  }
  for (const s of root.querySelectorAll("style")) s.remove();

  const blocks = [];
  const links = [];
  const images = [];
  const push = (tag, text, el, extra = {}) => {
    if (!text) return;
    blocks.push({ tag, text, cls: containerClass(el), ...extra });
  };

  const walk = (el) => {
    if (el.nodeType !== 1) return;
    const tag = el.rawTagName?.toLowerCase();
    const cls = pomiClass(el) ?? "";
    if (tag === "img") {
      images.push(el.getAttribute("src") ?? "");
      return;
    }
    if (tag === "svg") {
      push("svg", "[inline SVG illustration]", el);
      return;
    }
    if (tag === "a") {
      const href = el.getAttribute("href") ?? "";
      links.push(href);
      const label = el.childNodes.map(inlineMd).join("").trim();
      push(cls.startsWith("pomi-btn") ? "button" : "link", label, el, { href });
      return;
    }
    if (cls === "pomi-kicker") {
      push("kicker", textOf(el), el);
      return;
    }
    if (tag === "summary") {
      push("summary", textOf(el), el);
      return;
    }
    if (BLOCK_TAGS.has(tag)) {
      for (const a of el.querySelectorAll("a")) links.push(a.getAttribute("href") ?? "");
      push(tag, textOf(el), el);
      return;
    }
    const kids = el.childNodes.filter((n) => n.nodeType === 1);
    if (kids.every((k) => LEAF_INLINE.has(k.rawTagName?.toLowerCase()))) {
      const text = textOf(el);
      if (text) {
        push("text", text, el);
        return;
      }
    }
    for (const c of el.childNodes) walk(c);
  };
  for (const c of root.childNodes) walk(c);

  const words = (t) => t.replace(/\]\([^)]*\)/g, "]").split(/\s+/).filter(Boolean).length;
  return {
    embedId,
    kicker: blocks.find((b) => b.tag === "kicker")?.text ?? null,
    h1: blocks.find((b) => b.tag === "h1")?.text ?? null,
    blocks,
    links: [...new Set(links.filter(Boolean))],
    images: [...new Set(images.filter(Boolean))],
    wordCount: blocks.filter((b) => b.tag !== "svg").reduce((n, b) => n + words(b.text), 0),
    faqSchema,
    styleCss,
  };
}

/** GoDaddy's own content widgets on the served page (older articles left under the embed). */
export function parseNativeBlocks(rawHtml) {
  const root = parse(rawHtml.replace(/\ssrcdoc="[^"]*"/gi, ""));
  const out = [];
  for (const basic of root.querySelectorAll('[data-ux="ContentBasic"]')) {
    for (const h of basic.querySelectorAll('[data-ux="ContentHeading"]')) {
      const tag = /^h[1-4]$/i.test(h.rawTagName) ? h.rawTagName.toLowerCase() : "h2";
      const text = textOf(h);
      if (text) out.push({ tag, text });
    }
    for (const t of basic.querySelectorAll('[data-ux="ContentText"]')) {
      const ps = t.querySelectorAll("p");
      for (const p of ps.length ? ps : [t]) {
        const text = textOf(p);
        if (text) out.push({ tag: "p", text });
      }
    }
  }
  return out;
}

const uniq = (arr) => [...new Set(arr.map((s) => s.trim()))];
const values = (css, prop) =>
  uniq([...css.matchAll(new RegExp(`${prop}:\\s*([^;]+);`, "g"))].map((m) => m[1]));

/** Design tokens as they appear in one embed's stylesheet. */
export function styleTokens(css) {
  const colors = {};
  for (const m of css.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g)) colors[m[0]] = (colors[m[0]] ?? 0) + 1;
  return {
    fonts: values(css, "font-family"),
    colors,
    radii: values(css, "border-radius"),
    shadows: values(css, "box-shadow"),
    grids: values(css, "grid-template-columns"),
    classes: uniq([...css.matchAll(/\.(pomi-[\w-]+)/g)].map((m) => m[1])),
  };
}

/** Markdown of the page copy, with container classes marked so the visual grouping survives. */
export function toMarkdown(r) {
  const lines = [`# ${r.h1 ?? r.title ?? ""}`, ""];
  lines.push(`Source: ${r.url}`);
  if (r.title) lines.push(`Title: ${r.title}`);
  if (r.kicker) lines.push(`Kicker: ${r.kicker}`);
  if (r.embedId) lines.push(`Embed id: ${r.embedId}`);
  lines.push("");

  let cls = null;
  let prevTag = null;
  for (const b of r.blocks) {
    if (b.tag === "h1") continue;
    if (b.cls !== cls) {
      cls = b.cls;
      if (cls) lines.push(`<!-- ${cls} -->`, "");
      prevTag = null;
    }
    if (b.tag === "li") {
      if (prevTag === "li") lines.pop(); // join consecutive items into one list
      lines.push(`- ${b.text}`, "");
    } else if (/^h[2-4]$/.test(b.tag)) {
      lines.push(`${"#".repeat(Number(b.tag[1]))} ${b.text}`, "");
    } else if (b.tag === "summary") {
      lines.push(`#### ${b.text}`, "");
    } else if (b.tag === "button") {
      lines.push(`**[${b.text}](${b.href})**`, "");
    } else if (b.tag === "link") {
      lines.push(`[${b.text}](${b.href})`, "");
    } else if (b.tag === "kicker" || b.tag === "svg") {
      lines.push(`_${b.text}_`, "");
    } else {
      lines.push(b.text, "");
    }
    prevTag = b.tag;
  }

  if (r.nativeBlocks?.length) {
    lines.push("---", "", "## Native sections (outside the embed)", "");
    for (const b of r.nativeBlocks) {
      lines.push(/^h[1-4]$/.test(b.tag) ? `${"#".repeat(Number(b.tag[1]))} ${b.text}` : b.text, "");
    }
  }
  return lines.join("\n").trimEnd() + "\n";
}
