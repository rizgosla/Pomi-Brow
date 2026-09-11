---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

# Surface brief: Home (`/`, src/pages/index.astro)

## Scope and visitor mode

Persuade. The marketing home page for Pomi B. Brow Studio. Production-ready, mobile-first, Astro static with Sanity content (seed JSON until a project ID exists). Not in scope: service pages, Learn articles, About/FAQ/Safety/Aftercare pages, deploy.

## Audience, job, action, proof

A woman 30–60 on her phone, often late at night, afraid of looking tattooed, deciding whether to trust one practitioner. Primary action: click-to-call (949) 427-7664. Secondary: contact form; the pinned mobile bar and the header carry a single Call control until a booking link exists. Proof in order: real healed photography with quiet captions, the healing timeline, a four-tile work sample linking to Instagram, the Yelp count and curated quotes, the full editable price grid.

## Chosen direction and memorable moment

The client replaced the original "Brow Map" world on 2026-09-07 with the installed `minimalist-ui` protocol (`.agents/skills/minimalist-ui/SKILL.md`): premium utilitarian minimalism, editorial serif over a clean sans, warm monochrome, one hairline, no colored fields, no pill buttons.

On 2026-09-08 the client asked for the studio's original pink back and for the site to carry colour. Two things came out of that, and only the second one survived:

- **Kept:** the pink returned as a strictly rationed accent, and colour was moved onto the product itself — the healing timeline became a pigment rail and the category tags were rebuilt on pigment sampled from the studio's own healed photographs.
- **Reverted the same day:** tinted section grounds (a warm shell with blush and sand bands). See "Rejected, do not retry" below.

The memorable moment is now the **healing rail**: the six-week story told in the actual pigment, resolving to pink at the touch-up. Restraint still governs everything around it — one serif line, one honest photograph of both brows, one pink button.

## Direction contract

THESIS: A document, not a brochure — and the only colour in it comes from the work. Everything that is not a photograph, a sentence, or the pigment rail is a 1px #EAEAEA line. It refuses the category's soft-focus face hero, rose-gold, script accents, coloured section slabs, drop shadows, and pill buttons; it refuses the previous world's diagram over the hero; and it refuses decorative colour, including the tinted grounds tried on 2026-09-08.

OWN-WORLD: White canvas #FFFFFF, bone #F7F6F3 and #F9F9F8 surfaces, #111111 headings, #2F3437 body, #665B5D secondary (deepened from #787774 for a 30–60 audience reading on a phone at night), #EAEAEA borders. Newsreader (opsz 72, tracking -0.025em, line-height 1.1) for h1, h2, the review numeral, and short quotes; Geist for body and UI at line-height 1.6.

Accent: #C42A66, derived from the client's original #F26193 (which cannot carry contrast at 3.0:1 and is never applied directly). It is spent on exactly two things — a **Call control** and the **Week 6 resolution**. Not links, not arrows, not the numeral, not nav hover. Buttons: #C42A66 fill, white text at 5.4:1, 6px radius, no shadow, hover #A82255, active scale .98. Text links are ink with a 1px #EAEAEA underline.

Pigment: sampled from the studio's healed photographs — the mean of the darkest 5% of pixels per category. #3D2A23 brow, #3E2B24 eye, #6A2524 lip, #281712 hair. These feed the four category tags and the healing rail. Brow and eye come back nearly identical because the pigment genuinely is; tags separate on hue direction and lightness, and the label text always carries the category so colour is never the only code. Any new colour on this surface is **sampled, not chosen**.

Cards: 1px #EAEAEA, 12px radius, 24–40px padding, hover shadow 0 2px 8px rgba(0,0,0,.04). Photography: mild uniform grade (saturate .88) and a 4% warm grain, framed 12px. Content width 64rem. Section padding 6–8rem. No atmospheric layer and no section grounds: an ambient light spot was tried and removed because it banded; the canvas is flat white.

STORY: She reads one line, sees one healed face, and understands the method and the six weeks before she sees a price. Then 200 people agree. She calls.

FIRST VIEWPORT: Desktop: two columns inside 64rem. Left: h1 "Natural enough that no one asks." at ~4.1rem Newsreader, two lines, gray lede, pink Call button beside a "See the work" text link, a hairline-topped meta line (location, two-visit note); the header carries the number as a pink text link, and the button is the only filled pink in the viewport. Right: healed microblading-and-shading photo of both brows, 6:5 on desktop (4:5 on phones), 12px frame, caption beneath. Phone: h1, lede, link, meta line, then the photo; the pinned bar carries Call.

FORM: minimalist-ui protocol, user-pinned; replaces the seeded "Brow Map" (seed key 4e1957d1) after the client rejected the rendered result. Code-led.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

Signature element: the **healing rail** — a 3px vertical gradient running #D8CFC9 before pigment, #33221B dense on day one, #4A342A flaking, #B7A399 washed out around day ten, #6B4E3F returning at week four, #5A4133 settled, then a pink Week 6 dot. Each 11px dot is filled at its own moment's value. The page argues in prose that "the colour looks like it disappeared — it has not"; the rail makes that argument in colour.

Signature interaction: scroll-entry reveal (12px lift, 600ms, 80ms stagger on grids) via IntersectionObserver; nothing else moves.

## Rejected, do not retry

- **Tinted section grounds.** Tried 2026-09-08 (warm shell #FAF2EE with blush #F2D3DC and sand #ECDCC7 bands) and reverted the same day. Two reasons: white cards on beige and blush bands read as the med-spa template this brief exists to refuse, and #ECDCC7 is a skin-tone section field, which DESIGN.md already recorded as a confirmed client rejection carried from the Brow Map decision. Colour belongs on the work, not behind it.
- **Abstract semantic colour for the service categories.** The pastel yellow/blue/red/green tags had no relationship to a business that sells shades, and two of them were cool-cast on a warm page. Pale red and pale green survive only as form status.
- **Accent spread across the page.** Pink on links, arrows, the numeral, and nav hover was tried and pulled back; an accent that appears everywhere signals nothing.

## Unresolved decisions (never invent)

Booking target (Book falls back to tel:), form backend (FORM_WEBHOOK_URL), Yelp URL, hours, bio and headshot.

Placeholder content is now **guarded, not printed**: `Reviews.astro` and `AboutPomi.astro` filter placeholder entries and hide rather than render scaffolding, and `scripts/check-no-placeholders.mjs` fails the production build if the word reaches rendered HTML. The reviews block is therefore absent from the live page until real Yelp quotes exist — that is correct behaviour, not a bug.

## Open critique

`.impeccable/critique/2026-09-08T05-56-59Z__src-pages-index-astro.md` scored this surface 27/40 and remains open. Unaddressed priority issues: the proof block (`.count`) spends a near-full viewport and reads as a flourish; nine near-identical price cards at the money moment; 39 of 48 tap targets under 44×44 at 390px; the hero Call button's focus ring at 2.89:1 against its own pink fill; and no safety fact anywhere on the page for the anxious first-timer. `/impeccable polish` inherits these.
