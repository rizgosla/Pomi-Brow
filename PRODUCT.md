# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static output) + Sanity CMS, Sanity Studio hosted at `/admin` on the same deploy. Hosting: Cloudflare Pages (user-confirmed). Redirects via a `_redirects` file; Sanity publish webhook triggers a Cloudflare Pages deploy hook. One Pages Function (`/api/instagram`) proxies the Instagram feed for the home page: token as a Pages secret, `INSTAGRAM_KV` namespace for weekly token refresh, one-hour edge cache. Sanity Free plan (verify current limits at sanity.io/pricing before quoting).

## Users

Primary: women aged 30–60 (client-stated) in Orange County, researching permanent makeup on their phones, often late at night, before committing to a first appointment. Time-poor, careful researchers. Dominant pre-booking emotion is anxiety ("will it look natural or will I look tattooed"), not excitement.

Secondary: existing clients returning for the 6-week perfecting touch-up or the yearly touch-up.

Content editor: Pomi herself, a non-technical solo operator editing services, pricing, and articles in Sanity after handoff.

## Product Purpose

Marketing and booking site for Pomi B. Brow Studio, a solo-operator permanent makeup (cosmetic tattoo) studio. The site must turn an anxious researcher into a booked first appointment by showing real results and real trust signals, and answer the healing/safety/candidacy questions that block booking. Success: more first-appointment inquiries, with the site fully editable by the client and fully crawlable by search engines.

## Positioning

Natural-looking results, done by one named practitioner. Clients book Pomi specifically; this is a personal-brand practice, not a chain or med-spa. The word "natural" stays central. Two client-stated differentiators must be first-class, not footer items: 200+ five-star Yelp reviews, and an active Instagram (@pomib.browstudio) that functions as the living portfolio.

## Operating Context

- Location: 2801 El Camino Real Ste 13, Tustin, CA 92782. Marketed as "near Irvine, directly across from Irvine." Phone (949) 427-7664. Tustin/Irvine geographic signals matter for local search.
- Every service is a two-appointment structure: initial session, then a perfecting touch-up about 6 weeks later after healing. Touch-up is part of the product, not an upsell.
- Services: Eyebrows (Microblading; Microblading + Shading combo; Ombre Powder Brows), Eyes (Eyeliner; Lash Enhancement), Lips (Lip Tint), Hair (Scalp Micropigmentation), plus Maintenance (yearly touch-up for existing clients; additional touch-up) and Correction (tattoo removal, up to 4 sessions).
- Pricing (as of May 2026, subject to change): most services $600 + $100 touch-up; Microblading/Shading combo $700 + $100; SMP $500/hr; yearly touch-up $300; additional touch-up $100; removal $200/session. Must be client-editable, never hardcoded.
- Existing site: GoDaddy Website Builder, ~21 pages in four groups: Core (Home, About Pomi, FAQs, Safety, Aftercare, Contact), 7 Service pages, 10 "Learn" educational articles (the SEO engine). Client wants the content architecture reused as a general template. Every existing URL must be preserved or 301-mapped, including cleanup of two encoded-`?` slugs (`are-powder-brows-for-me%3F-1`, `is-permanent-makeup-safe%3F`) and collapsing duplicate `/` and `/home`.
- Editing workflow: static build, so Sanity publishes take a couple of minutes to go live. Client must be told this. Desk structure shows only Services / Learn / Settings as a UI guardrail (Sanity Free has only Admin and Viewer roles).

## Capabilities and Constraints

Confirmed must-haves:
- Yelp reviews surfaced prominently: homepage social-proof block plus pull-through on service pages.
- Instagram feed embed on Home and About.
- Before/after gallery per service from the MEDIA images.
- Click-to-call and a booking CTA persistent in the header on mobile.
- Contact/booking form.
- Location and map with Tustin/Irvine signals.
- Mobile-first build.
- Clean crawlable HTML; schema markup for LocalBusiness, Service, and FAQ.
- Analytics without a forced cookie-consent wall.
- Client-editable pricing.

CMS model (keep flat): Service (7 entries, `category` of Eyebrows/Eyes/Lips/Hair; title, slug, price, touch-up price, description, gallery), Learn article (10 entries; title, slug, body, optional related service), Site settings singleton (hours, phone, address, social links, Yelp/Instagram handles), Pricing (fields on Service or a standalone document).

Constraints:
- Sanity Free datasets are public. Never store internal notes, unpublished pricing, or form submissions in the dataset. Form submissions go elsewhere (undecided; not Sanity).
- Logo is EPS only; convert to SVG and export PNG/favicons. Never reference the EPS.

Undecided product facts (do not invent):
- **Booking mechanism.** No online scheduler is confirmed. Options on the table: call/form only, an external scheduler, or Instagram DM. Design the booking CTA so its target can be swapped without redesign.
- Form submission backend.
- Analytics provider.

## Brand Commitments

- Name: Pomi B. Brow Studio. Practitioner: Pomi. Instagram @pomib.browstudio.
- Logo supplied as EPS in black and white variants (`MEDIA/Pomi-B-Logo-Black.eps`, `MEDIA/Pomi-B-Logo-White.eps`).
- No existing brand guidelines. Current site's pink accent `rgb(242, 97, 147)` is explicitly not binding.
- Brief-stated direction, recorded without expansion: warm, calm, premium; reduce anxiety; the work is the hero; big photography, generous whitespace, restrained type. Should read as a practitioner's portfolio, not a med-spa template.

## Evidence on Hand

In repo (`MEDIA/`, flat folder, service name as filename prefix; originals full-resolution and unprocessed):
- Microblading: 8 images
- Microblading - Shading Brows: 8 images
- Powder Brows: 5 images
- Eyeliner: 3 images
- Lash Enhancement: 1 image
- Lip Tint: 4 images (some are stacked before/after composites)
- Scalp Micropigmentation: 2 images
- Logo: 2 EPS files

Note: the brief describes seven subfolders; the actual folder is flat. Treat the filename prefix as the category.

Confirmed to exist but not yet supplied (user-confirmed; obtain before launch, never fabricate):
- Yelp listing URL (backs the "200+ five-star reviews" claim; count should be verified against the live listing at build time).
- Business hours.
- Current GoDaddy site URL (needed for URL inventory and 301 map).
- Pomi bio and headshot for the About page.

Absent: no testimonial text, no press, no certifications list, no video. Do not invent any.

## Product Principles

1. Reduce anxiety before asking for action. Every surface answers "will this look natural" and "is this safe" before it sells.
2. Real work is the proof. Client photography and third-party reviews carry trust; the interface stays out of their way.
3. Pomi is the product. One practitioner, one voice, one portfolio; nothing that reads like a chain or template.
4. The phone is the primary device and the primary action. Call and book must always be within thumb reach.
5. Editable without a developer. Anything that changes (prices, hours, articles) lives in the CMS.

## Accessibility & Inclusion

No product-specific standard was set. Audience skews 30–60 on phones, so readable type sizes and strong contrast on photography are baseline expectations; no additional requirement confirmed.
