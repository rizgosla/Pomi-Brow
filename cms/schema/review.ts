import { defineField, defineType } from "sanity";

export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  description: "A real review copied from Yelp or Google. Never write one yourself.",
  fields: [
    defineField({ name: "quote", type: "text", rows: 4, validation: (r) => r.required() }),
    defineField({
      name: "reviewer",
      title: "Reviewer name as shown on Yelp",
      type: "string",
      description: "e.g. “Jessica M.”",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "source",
      type: "string",
      options: { list: ["Yelp", "Google", "Instagram"] },
      initialValue: "Yelp",
    }),
    defineField({ name: "sourceUrl", title: "Link to the original review", type: "url" }),
    defineField({
      name: "service",
      type: "reference",
      to: [{ type: "service" }],
      description: "Optional. Shows the review on that service page too.",
    }),
    defineField({ name: "showOnHome", type: "boolean", initialValue: true }),
    defineField({ name: "order", type: "number" }),
  ],
  preview: { select: { title: "reviewer", subtitle: "quote" } },
});
