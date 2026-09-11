/**
 * Section content model for the slide-style pages (Safety, Aftercare, the Learn guides).
 *
 * A page is a list of sections, each one idea: a strip of facts, a statement with a callout,
 * a grid of cards, a numbered or dated sequence, a two-sided comparison, questions, a close.
 * Authored in src/content/seed/*.json (and mirrored in the Sanity schema), rendered by
 * src/components/sections/Sections.astro, checked by validateSections() in the tests.
 *
 * Image slots carry the intended shot as text until a photograph exists; a slot with a
 * `photo` renders the real thing. The word "placeholder" must never reach the page: the
 * build fails on it (scripts/check-no-placeholders.mjs).
 */

/** A seed photo pick, resolved by the content layer to a Photo. */
export interface SeedPhotoRef {
  ref: string;
  alt: string;
  focus?: string;
  detail?: string;
}

export interface ImageSlot {
  ratio: "5 / 2" | "4 / 5" | "3 / 2" | "1 / 1";
  /** The shot list entry: what the photograph should show. Shown under the slot until then. */
  shot: string;
  photo?: SeedPhotoRef;
}

export interface Link {
  label: string;
  href: string;
}

export interface Callout {
  tone: "note" | "voice" | "caution" | "links";
  title: string;
  text?: string;
  bullets?: string[];
  links?: Link[];
}

export interface FactItem {
  title: string;
  text: string;
}

export interface GridItem {
  title: string;
  text?: string;
  bullets?: string[];
  image?: ImageSlot;
}

export interface SequenceItem {
  label: string;
  title: string;
  text?: string;
  bullets?: string[];
}

export interface CompareSide {
  title: string;
  bullets: string[];
  image?: ImageSlot;
}

export interface FaqItem {
  q: string;
  a: string;
}

export type Section =
  | { type: "facts"; items: FactItem[] }
  | { type: "statement"; heading: string; lede?: string; paragraphs: string[]; image?: ImageSlot; callout?: Callout }
  | { type: "grid"; heading: string; lede?: string; columns?: 2 | 4; items: GridItem[]; callout?: Callout }
  | {
      type: "sequence";
      heading: string;
      lede?: string;
      kind: "steps" | "timeline";
      items: SequenceItem[];
      image?: ImageSlot;
      callout?: Callout;
    }
  | { type: "compare"; heading: string; lede?: string; sides: [CompareSide, CompareSide] }
  | { type: "faq"; heading?: string; lede?: string; items: FaqItem[] }
  | { type: "cta"; heading: string; text: string; links?: Link[] };

export type SectionType = Section["type"];

/** A page of sections with the header copy that sits above them. */
export interface SectionPage {
  slug: string;
  title: string;
  lede: string;
  meta?: string;
  lead?: ImageSlot;
  sections: Section[];
}

export interface Problem {
  index: number;
  message: string;
}

const TYPES = new Set<SectionType>(["facts", "statement", "grid", "sequence", "compare", "faq", "cta"]);
const BANNED = /placeholder/i;

/** Every string a section can put on the page. */
function visibleStrings(s: any): string[] {
  const out: string[] = [];
  const walk = (v: any) => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") for (const [k, val] of Object.entries(v)) if (k !== "href" && k !== "ref") walk(val);
  };
  walk(s);
  return out;
}

/** Problems with a page's sections; an empty list means the page is well-formed. */
export function validateSections(sections: Section[]): Problem[] {
  const problems: Problem[] = [];
  sections.forEach((s: any, index) => {
    const add = (message: string) => problems.push({ index, message });
    if (!TYPES.has(s?.type)) {
      add(`unknown type "${s?.type}"`);
      return;
    }
    const needsHeading = s.type !== "facts" && s.type !== "faq";
    if (needsHeading && !s.heading) add(`${s.type} needs a heading`);

    switch (s.type as SectionType) {
      case "facts":
        if (!Array.isArray(s.items) || s.items.length < 2 || s.items.length > 4) add("facts needs 2 to 4 items");
        break;
      case "statement":
        if (!Array.isArray(s.paragraphs) || s.paragraphs.length === 0) add("statement needs paragraphs");
        break;
      case "grid":
        if (!Array.isArray(s.items) || s.items.length < 2 || s.items.length > 4) add("grid needs 2 to 4 items");
        break;
      case "sequence":
        if (s.kind !== "steps" && s.kind !== "timeline") add('sequence kind must be "steps" or "timeline"');
        if (!Array.isArray(s.items) || s.items.length < 3) add("sequence needs at least 3 items");
        break;
      case "compare":
        if (!Array.isArray(s.sides) || s.sides.length !== 2) add("compare needs exactly 2 sides");
        break;
      case "faq":
        if (!Array.isArray(s.items) || s.items.length === 0) add("faq needs items");
        else if (s.items.some((i: any) => !i?.q || !i?.a)) add("every faq item needs q and a");
        break;
      case "cta":
        if (!s.text) add("cta needs text");
        break;
    }

    const banned = visibleStrings(s).find((t) => BANNED.test(t));
    if (banned) add(`visible text contains "placeholder": ${JSON.stringify(banned)}`);
  });
  return problems;
}

/** Site-relative hrefs (starting with "/") across callouts and cta links, in page order. */
export function internalHrefs(sections: Section[]): string[] {
  const out: string[] = [];
  const walk = (v: any) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      if (typeof v.href === "string" && v.href.startsWith("/")) out.push(v.href);
      for (const val of Object.values(v)) if (val && typeof val === "object") walk(val);
    }
  };
  walk(sections);
  return out;
}
