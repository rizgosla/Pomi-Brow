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

## 2026-09-11 changes (client feedback: "not enough pink", "text too small and too far")

These supersede anything above that contradicts them. DESIGN.md is updated to match.

- **Pink box line.** Cards, FAQ cards, form fields, the form status, quiet buttons, the menu toggle and the map are outlined in blush `#F8A8C4`, stepping to `#F26193` on hover and open. Photo frames and structural rules stay grey. This is the Two-Line Rule; it replaces "everything is a 1px #EAEAEA line".
- **Narrower column, bigger type.** Site-wide `--page-max` is 82rem (was 106rem), sized so the price grid lands as two rows of four. Every text step is one size up (body 1.125rem). The hero shares the column at 36fr / 43fr with a 3rem gap, so the work wall is unchanged and the headline sits tight against it. About's photo is capped at 26rem.
- **Hero word swap.** A CSS keyframe loop ported from the Oasis Dental hero: each word rises out of a blur, holds, and lifts out. It replaced the JS opacity crossfade. This is now the surface's one authored motion, next to the reveal.
- **Horizontal healing rail.** From 60rem the timeline is six columns under a left-to-right rail, with no method photograph. Phones keep the vertical rail. The signature element is unchanged in meaning.
- **Hover is open.** Hovering any card or FAQ question gives it the open FAQ look (Pale Pink fill, #F26193 line), on pointer devices only. It replaced the hover shadow.
- **Pink photo frames.** Photographs standing on the page (hero wall, Instagram, About) are framed in the blush line; photographs inside cards keep a grey frame.
- **Hero rule.** The timeline section opens with the full-width structural rule, so the one-screen hero is closed off exactly at the fold.

### 2026-09-19 changes (client review with Pomi)

- **The healing timeline left the home page.** A six-week calendar that early made the process read as complex to a first-time visitor. `HealingAxis.astro` is unchanged and still runs on the service pages; its finer detail (the day-ten disappearance, the week-four true color) moved into `/aftercare`'s existing timeline section, which already owned that job at lower resolution. Nothing was duplicated.
- **Its slot is now `OneArtist.astro`, and it is not a rail.** The first attempt kept the rail and swapped its content to the four moments of the appointment. That was rejected on sight: a rail with dots reads as a *process diagram*, the visual language of a clinic explaining a procedure, and the argument here is about a person, not a process. Rails, dots and tag pills all went. What shipped is four numbered entries opening on hairlines, set like a specification — the numeral in the display face and `--pigment-brow`, body in muted ink, four columns from 60rem and stacked below. No rule but the hairline, no color that does not mean something.
- **"One artist. Every stroke." moved up.** It was `aboutHeading`, used once, low on the page. It now heads the method rail at position two, where four labelled beats argue it instead of a sentence asserting it. About takes her name, "Pomi."
- **The proof block is one object.** The Yelp count left `AboutPomi` (where it was a sentence referring to quotes two sections away) and became the heading of `Reviews`. This is the merge the open critique asked for; `.count` is no longer on the home page at all. `ReviewCount.astro` still serves `/about` and `/contact`.
- **The claim is now accurate, and read off the listing rather than remembered.** The site said "200+ five-star reviews"; the previous site said 250+; neither was checked. The listing at `yelp.com/biz/pomi-b-brow-studio-tustin` reads **5.0 across 235 reviews** (2026-09-19), and `yelpUrl` now points there instead of at a Yelp *search*. `yelpReviewCount` is therefore every review, not the five-star subset — the listing publishes the total and the average, never the breakdown — so the proof block leads with "5.0 on Yelp, across 235 reviews." New fields: `yelpRating`, and `yelpOtherReviewCount` for the one review said not to be five stars. `aggregateRating` JSON-LD in `Base.astro` uses the true total, which is what Google expects.
- **The Pomi section stopped being a quarter full.** With `headshot` null and the bio still a placeholder, it was a heading, one sentence and two links beside a 552px photograph -- 201px of copy in an 809px section, and the sentence was a near-verbatim repeat of the `OneArtist` lede. Three fixes: `OneArtist`'s lede was rewritten ("No assistants, no apprentices, no handoffs") so the two no longer say the same thing; a four-fact row was added under the bio, every fact read off the Yelp listing or the address (10 years in business, free consultations, by appointment only, Tustin); and the figure column narrowed from 26rem to 22rem. Copy is now 374px against a 472px figure. This is a holding pattern, not the fix -- the section still wants a portrait and Pomi's own words.
- **The home page carries real quotes, each beside Pomi's work.** Three, copied word for word from the listing with reviewer, month and year: Amity T. (the brows do not look tattooed), Anne P. (what the appointment is actually like), Jenn H. (still going back years later). Chosen to answer three different doubts rather than to repeat one compliment. Each card carries one of Pomi's own photographs, captioned with the service and "Healed, by Pomi" -- never the reviewer, whose Yelp profile picture is deliberately not used: those are photographs of identifiable private people, and republishing them to advertise a business is a right-of-publicity question (Cal. Civ. Code s3344) as well as a Yelp terms one. A review that names its service gets that service; the rest take services nobody else used, so the row shows range rather than three identical captions. `visibleReviews()` in `lib/content.ts` is shared by the page and the component so the photographs line up with the reviews that actually render, and every pick is checked against the hero tiles, the Instagram picks, the price-grid covers and the About photograph, which `check-image-reuse.mjs` enforces.
- **The Yelp mark was broken everywhere it appeared.** Its first path, `M11.2 3.2 12 11 l-4.6-6.4`, drew a chevron instead of a ray, so the burst rendered as a lopsided asterisk in the footer and on the reviews button. Redrawn as five rays at 4.4 stroke width — the set's 2px is too fine for a five-petal mark to resolve at 16px — still in `currentColor`, never Yelp red.
- **A `star` glyph joined the icon set.** Solid rather than stroked, because five outlined stars at 1rem read as noise and a rating has to be countable. It takes `currentColor` at `--pigment-brow` — no gold, no Yelp red. It sits in the section foot beside the source link, never above a heading.

### 2026-09-27 changes

- **`OneArtist` is gone; About follows the hero.** The client disliked the four numbered text columns. Research on solo PMU studios (Browhouse, Kim Bouman, Gladka Glow, Trieu Beauty, Muse) found the slot after the hero is almost always "meet your artist": a face, a short bio, a few facts. `AboutPomi` already was that, four sections down, so `OneArtist` was saying the same thing twice without a photograph. It was deleted and About moved up. The one-artist claim survives in the hero lede ("drawn by one artist") and the bio's second paragraph. The fold rule it drew is now `.hero + .section` in `global.css`.

## Rejected, do not retry

- **A text-only "one artist" process block after the hero** (`OneArtist.astro`, 2026-09-19 to 2026-09-27). Four numbered consult / mapping / procedure / touch-up entries. It read as a spec sheet, duplicated About, and a trust claim about a person needs the person's face.

- **Tinted section grounds.** Tried 2026-09-08 (warm shell #FAF2EE with blush #F2D3DC and sand #ECDCC7 bands) and reverted the same day. Two reasons: white cards on beige and blush bands read as the med-spa template this brief exists to refuse, and #ECDCC7 is a skin-tone section field, which DESIGN.md already recorded as a confirmed client rejection carried from the Brow Map decision. Colour belongs on the work, not behind it.
- **Abstract semantic colour for the service categories.** The pastel yellow/blue/red/green tags had no relationship to a business that sells shades, and two of them were cool-cast on a warm page. Pale red and pale green survive only as form status.
- **Accent spread across the page.** Pink on links, arrows, the numeral, and nav hover was tried and pulled back; an accent that appears everywhere signals nothing.

## Unresolved decisions (never invent)

Booking target (Book falls back to tel:), form backend (FORM_WEBHOOK_URL), Yelp URL, hours, bio and headshot.

The Yelp listing URL, rating and count were resolved on 2026-09-19 by reading the listing directly: `yelp.com/biz/pomi-b-brow-studio-tustin`, **5.0 across 235 reviews**, 10 years in business. One figure remains unverified: `yelpOtherReviewCount` (1) is the client's own account of a single non-five-star review, and the listing's rating breakdown was not captured to confirm it. It drives the sentence "All but one of them five stars." on the home page, `/about` and `/contact` — set it to 0 to drop that sentence if it turns out to be wrong.

Placeholder content is now **guarded, not printed**: `Reviews.astro` and `AboutPomi.astro` filter placeholder entries and hide rather than render scaffolding, and `scripts/check-no-placeholders.mjs` fails the production build if the word reaches rendered HTML. As of 2026-09-19 that guard is split rather than whole. The quote cards are still withheld until real Yelp quotes exist — they promise words copied word for word, so they ship only when they can keep it. The rating and the count are facts about the listing, not quotations, so the section renders them regardless and simply omits the cards. Before the split, moving the count into this block took the Yelp proof off the home page entirely while the seed quotes were still placeholders.

## Open critique

`.impeccable/critique/2026-09-08T05-56-59Z__src-pages-index-astro.md` scored this surface 27/40 and remains open. Unaddressed priority issues: nine near-identical price cards at the money moment; 39 of 48 tap targets under 44×44 at 390px; the hero Call button's focus ring at 2.89:1 against its own pink fill; and no safety fact anywhere on the page for the anxious first-timer. `/impeccable polish` inherits these.
