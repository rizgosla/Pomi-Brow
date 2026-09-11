// The slide-page section types, mirroring src/lib/sections.ts so a Learn article edited in the
// Studio renders exactly like one from the seed. Keep the two in step.
import { defineArrayMember, defineField, defineType } from "sanity";

const RATIOS = ["5 / 2", "4 / 5", "3 / 2", "1 / 1"];

export const imageSlot = defineType({
  name: "imageSlot",
  title: "Photograph",
  type: "object",
  fields: [
    defineField({ name: "ratio", type: "string", options: { list: RATIOS }, initialValue: "3 / 2", validation: (r) => r.required() }),
    defineField({
      name: "shot",
      title: "What the photo should show",
      type: "string",
      description: "Shown under the empty frame until a photo is added.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "photo", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] }),
  ],
  preview: { select: { title: "shot", subtitle: "ratio" } },
});

const link = defineArrayMember({
  type: "object",
  name: "link",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", type: "string", validation: (r) => r.required() }),
  ],
});

export const callout = defineType({
  name: "callout",
  title: "Callout",
  type: "object",
  fields: [
    defineField({
      name: "tone",
      type: "string",
      options: { list: ["note", "voice", "caution", "links"] },
      initialValue: "note",
      description: "note: neutral. voice: in Pomi's words. caution: medical note. links: where to read next.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "text", type: "text", rows: 3 }),
    defineField({ name: "bullets", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "links", type: "array", of: [link] }),
  ],
  preview: { select: { title: "title", subtitle: "tone" } },
});

const heading = defineField({ name: "heading", type: "string", validation: (r) => r.required() });
const lede = defineField({ name: "lede", type: "text", rows: 2 });
const bullets = defineField({ name: "bullets", type: "array", of: [{ type: "string" }] });

export const sectionFacts = defineType({
  name: "sectionFacts",
  title: "Facts strip",
  type: "object",
  fields: [
    defineField({
      name: "items",
      type: "array",
      validation: (r) => r.min(2).max(4),
      of: [
        defineArrayMember({
          type: "object",
          fields: [defineField({ name: "title", type: "string" }), defineField({ name: "text", type: "string" })],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Facts strip" }) },
});

export const sectionStatement = defineType({
  name: "sectionStatement",
  title: "Statement",
  type: "object",
  fields: [
    heading,
    lede,
    defineField({ name: "paragraphs", type: "array", of: [{ type: "text" }], validation: (r) => r.min(1).max(3) }),
    defineField({ name: "image", type: "imageSlot" }),
    defineField({ name: "callout", type: "callout" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title, subtitle: "Statement" }) },
});

export const sectionGrid = defineType({
  name: "sectionGrid",
  title: "Cards",
  type: "object",
  fields: [
    heading,
    lede,
    defineField({ name: "columns", type: "number", options: { list: [2, 4] } }),
    defineField({
      name: "items",
      type: "array",
      validation: (r) => r.min(2).max(4),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", type: "text", rows: 2 }),
            bullets,
            defineField({ name: "image", type: "imageSlot" }),
          ],
        }),
      ],
    }),
    defineField({ name: "callout", type: "callout" }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title, subtitle: "Cards" }) },
});

export const sectionSequence = defineType({
  name: "sectionSequence",
  title: "Steps or timeline",
  type: "object",
  fields: [
    heading,
    lede,
    defineField({ name: "kind", type: "string", options: { list: ["steps", "timeline"] }, initialValue: "steps", validation: (r) => r.required() }),
    defineField({
      name: "items",
      type: "array",
      validation: (r) => r.min(3),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", description: "Day 1, Week 6, or the step's short name.", validation: (r) => r.required() }),
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", type: "text", rows: 2 }),
            bullets,
          ],
        }),
      ],
    }),
    defineField({ name: "image", type: "imageSlot" }),
    defineField({ name: "callout", type: "callout" }),
  ],
  preview: { select: { title: "heading", kind: "kind" }, prepare: ({ title, kind }) => ({ title, subtitle: kind }) },
});

export const sectionCompare = defineType({
  name: "sectionCompare",
  title: "Compare",
  type: "object",
  fields: [
    heading,
    lede,
    defineField({
      name: "sides",
      type: "array",
      validation: (r) => r.length(2),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "bullets", type: "array", of: [{ type: "string" }], validation: (r) => r.min(1) }),
            defineField({ name: "image", type: "imageSlot" }),
          ],
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title, subtitle: "Compare" }) },
});

export const sectionFaq = defineType({
  name: "sectionFaq",
  title: "Questions",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string" }),
    lede,
    defineField({
      name: "items",
      type: "array",
      validation: (r) => r.min(1),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "q", title: "Question", type: "string", validation: (r) => r.required() }),
            defineField({ name: "a", title: "Answer", type: "text", rows: 2, validation: (r) => r.required() }),
          ],
        }),
      ],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title: title ?? "Questions", subtitle: "FAQ" }) },
});

export const sectionCta = defineType({
  name: "sectionCta",
  title: "Close",
  type: "object",
  fields: [
    heading,
    defineField({ name: "text", type: "text", rows: 2, validation: (r) => r.required() }),
    defineField({ name: "links", type: "array", of: [link] }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }) => ({ title, subtitle: "Close" }) },
});

/** The array field a document uses to hold its sections. */
export const sectionsField = defineField({
  name: "sections",
  title: "Sections",
  type: "array",
  description: "The page, one idea per section. Leave empty to show the body text instead.",
  of: [
    { type: "sectionFacts" },
    { type: "sectionStatement" },
    { type: "sectionGrid" },
    { type: "sectionSequence" },
    { type: "sectionCompare" },
    { type: "sectionFaq" },
    { type: "sectionCta" },
  ],
});

export const sectionTypes = [
  imageSlot,
  callout,
  sectionFacts,
  sectionStatement,
  sectionGrid,
  sectionSequence,
  sectionCompare,
  sectionFaq,
  sectionCta,
];
