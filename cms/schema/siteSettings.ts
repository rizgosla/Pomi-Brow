import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "businessName", type: "string", initialValue: "Pomi B. Brow Studio" }),
    defineField({ name: "phone", type: "string", description: "As shown: (949) 427-7664" }),
    defineField({ name: "phoneTel", title: "Phone for dialing", type: "string", description: "+19494277664" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "street", type: "string" }),
    defineField({ name: "city", type: "string" }),
    defineField({ name: "state", type: "string" }),
    defineField({ name: "zip", type: "string" }),
    defineField({
      name: "locationLine",
      title: "Location line",
      type: "string",
      description: "Short phrase used in headlines and captions, e.g. “Tustin, across from Irvine”.",
    }),
    defineField({ name: "mapEmbedUrl", title: "Google Maps embed link", type: "url" }),
    defineField({ name: "mapLinkUrl", title: "Google Maps directions link", type: "url" }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "days", type: "string", description: "e.g. Tue–Sat" }),
            defineField({ name: "opens", type: "string", description: "24h, e.g. 10:00" }),
            defineField({ name: "closes", type: "string", description: "24h, e.g. 18:00" }),
          ],
          preview: { select: { title: "days", subtitle: "opens" } },
        },
      ],
    }),
    defineField({ name: "hoursNote", type: "string", description: "e.g. “By appointment”" }),
    defineField({ name: "bookingUrl", title: "Booking link", type: "url", description: "Leave empty to make Book buttons call the studio." }),
    defineField({ name: "yelpUrl", type: "url" }),
    defineField({ name: "yelpReviewCount", title: "Yelp five-star review count", type: "number" }),
    defineField({ name: "instagramHandle", type: "string", description: "Without the @" }),
    defineField({ name: "instagramUrl", type: "url" }),
    defineField({
      name: "instagramPicks",
      title: "Instagram grid on the home page",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] }],
      description: "Six to nine of your favorite recent posts.",
    }),
    defineField({ name: "aboutHeading", type: "string" }),
    defineField({ name: "bio", title: "About Pomi", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "headshot", type: "image", options: { hotspot: true } }),
    defineField({ name: "metaDescription", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
