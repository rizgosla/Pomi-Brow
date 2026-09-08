# Pomi B. Brow Studio — Project Brief

## The business

Pomi B. Brow Studio is a solo-operator permanent makeup (PMU) studio at 2801 El Camino Real Ste 13, Tustin, CA 92782 — positioned in marketing as "near Irvine, directly across from Irvine." Phone: (949) 427-7664.

The operator is Pomi. This is a personal-brand business, not a chain or a spa with staff. Clients are booking *her* specifically. That matters for the design: the site should feel like a practitioner's portfolio, not a med-spa template.

**Service category:** cosmetic tattooing — pigment implanted in the skin to replace or enhance daily makeup. Brows, eyeliner, lips, and scalp. Every service is a two-appointment structure: an initial session, then a perfecting touch-up ~6 weeks later once it heals.

**Target audience:** women 30–60 (client-stated). This demographic is time-poor, researching carefully before committing, and highly sensitive to "will this look natural or will I look tattooed." The dominant emotion pre-booking is anxiety, not excitement.

**Positioning:** natural-looking results. The word "natural" is doing heavy lifting in their existing meta description and should stay central.

**Competitive differentiators (client-stated priorities):**
1. 200+ five-star Yelp reviews — the single strongest trust asset
2. Active Instagram (@pomib.browstudio) — Pomi posts frequently, functions as the real portfolio

Both need to be first-class elements on the new site, not footer icons.

## Services and pricing

| Category | Service | Price |
|---|---|---|
| Eyebrows | Microblading + touch up | $600 + $100 |
| Eyebrows | Microblading / Shading (combo) + touch up | $700 + $100 |
| Eyebrows | Ombre Powder Brows + touch up | $600 + $100 |
| Eyes | Eyeliner + touch up | $600 + $100 |
| Eyes | Lash Enhancement + touch up | $600 + $100 |
| Lips | Lip Tint + touch up | $600 + $100 |
| Hair | Scalp Micropigmentation | $500/hr |
| Maintenance | Yearly touch up (existing clients) | $300 |
| Maintenance | Any additional touch up (if needed) | $100 |
| Correction | Tattoo removal, per session | $200 (up to 4 sessions) |

Prices current as of May 2026, subject to change. Build the pricing table as editable content, not hardcoded — this will change.

## Current site structure

GoDaddy Website Builder. Content architecture is actually decent and the client said to use it as a general template. It breaks into four groups:

**Core pages**
- Home — hero, Yelp trust line, services/pricing table, contact form, map
- About Pomi
- FAQs
- Safety
- Aftercare
- Contact Form

**Service pages (7)** — Microblading, Microblading-Shading, Ombre Powder Brows, Eyeliner, Lash Enhancement, Lip Tint, Scalp Micropigmentation

**"Learn" educational hub (10)** — Are Powder Brows for Me?, How Long It Lasts, PMU Healing Timeline, Is Permanent Makeup Safe?, Eyeliner vs Lash Enhancement, Lip Tint vs Lip Blush, Good PMU Candidates, Prepare for Appointment, Scalp Micropigmentation, Importance of Touch Up

That's ~21 pages total. The Learn section is the SEO engine — it's answering the exact questions a nervous 45-year-old types into Google at 11pm. Preserve every one of those URLs or map them with 301s.

**Known problems to fix**
- Custom HTML pages aren't fully crawlable by SEO/AEO bots
- Duplicate home pages that can't be merged (`/` and `/home` both resolve — pick one, redirect the other)
- Forced cookie consent popup just to enable analytics
- Two URLs have encoded `?` characters (`are-powder-brows-for-me%3F-1`, `is-permanent-makeup-safe%3F`) — clean these up in the migration
- Reviews and Instagram are buried in the footer

## What the new site needs

**Platform:** Astro + Sanity. Static build for speed and clean crawlable HTML; Sanity as the CMS so the client can self-edit content after handoff. Studio hosted at `/admin` on the same deploy. Sanity's Free plan covers this project — the caps (10k documents, 20 seats) are far above what a ~21-page site needs.

**Must-haves**
- Yelp reviews surfaced prominently — homepage social proof block, plus review pull-through on individual service pages
- Instagram feed embed, ideally on home and About
- Before/after gallery per service, driven by the image sets John organized (folders match the 7 service names)
- Click-to-call and a booking CTA persistent in the header on mobile
- Contact/booking form
- Location + map, with Tustin/Irvine geographic signals
- Full mobile-first build — this audience is on phones
- Clean, crawlable HTML (fixes the core GoDaddy complaint), proper schema markup for LocalBusiness + Service + FAQ
- Analytics without a forced consent wall
- Pricing table the client can edit

**Design direction:** free reign per client, no existing brand guidelines. Logo supplied as EPS. Current site uses a pink accent (`rgb(242, 97, 147)`) — not binding. The brief here is warm, calm, and premium; the visual job is to reduce anxiety and make the work itself the hero. Big photography, generous whitespace, restrained type.

## Assets received

Everything the client provided lives in the `MEDIA` folder at the root of this repo. Images are organized into subfolders matching the seven service categories:

- Microblading
- Microblading-Shading
- Ombre Powder Brows
- Eyeliner
- Lash Enhancement
- Lip Tint
- Scalp Micropigmentation

The logo is in there as an EPS. Convert it to SVG for web use and export PNG fallbacks/favicons — don't reference the EPS directly.

Pull service page galleries and before/afters straight from the matching subfolder. Optimize and resize on the way in; assume the originals are full-resolution and unprocessed.

## CMS notes

Content types to model — keep it flat, don't over-engineer:

- **Service** (one type, seven entries, with a `category` field for Eyebrows / Eyes / Lips / Hair) — title, slug, price, touch-up price, description, gallery
- **Learn article** (one type, ten entries) — title, slug, body, optional related service reference
- **Site settings** (singleton) — hours, phone, address, social links, Yelp/Instagram handles
- **Pricing** — either fields on Service or a standalone table document; either way it must be editable without a deploy from the client's side

Configure the desk structure so the client sees only Services / Learn / Settings. Sanity's free plan only has two roles (Administrator and Viewer), so she'll be a full admin — the desk structure is a UI guardrail, not a permission boundary. Document history covers accidental deletions.

Static build means content changes need a rebuild. Wire a Sanity webhook to the host's deploy hook, and tell the client edits take a couple minutes to go live so she doesn't panic.

## One flag

Free-tier Sanity datasets are public — readable by anyone with the project ID. Fine here since everything on this site is published content anyway, but never put internal notes, unpublished pricing, or form submissions in the dataset.

Verify current Sanity plan limits on sanity.io/pricing before quoting anything to John. Third-party sources disagree on the specifics.
