# Info-page layouts: what professional designers do, and what this site takes from it

Written 2026-09-28 for the redesign of the slide-style info pages (Safety, Aftercare, the ten
Learn guides) and the service pages. The owner's brief: research what *professional designers*
do for informational/article pages — not other brow, PMU or med-spa sites — and fix the pages
they critiqued screenshot by screenshot. DESIGN.md "Slide pages" holds the resulting rules; this
file holds the evidence.

## How the research was done, and how far to trust it

Two research passes, run by sub-agents on 2026-09-28. The container's egress proxy blocked most
magazine, brand and award-gallery sites (Awwwards, Godly, SiteInspire, Stripe, Linear, Apple,
Aesop, Kinfolk, NN/g, Smashing, CSS-Tricks, The Pudding, gov.uk, nhs.uk). The strongest evidence
is therefore **production front-end code and design-system documentation that professional
editorial and public-service teams publish on GitHub**, read directly:

- The Guardian's `dotcom-rendering` (layout code for one of the most awarded news sites).
- Reuters Graphics' `graphics-components` (the kit behind Reuters' long-form features).
- BBC GEL, GOV.UK Design System and Frontend, the NHS service manual, USWDS, IBM Carbon,
  Shopify Polaris and the Shopify Dawn theme.
- Brad Frost's *Atomic Design* (full text), Tufte CSS, Scrollama, MDN, WCAG.

Everything else (NN/g articles, ProPublica's design guides, Andy Clarke, The Pudding, case-study
quotes) was confirmed through search-index text only. Claims below are marked **[F]** fetched and
read, **[S]** search text only, **[I]** our own synthesis.

## 1. Keep the system fixed; vary the composition

- The Guardian picks a container layout from the number and importance of items — a full-width
  "boosted" lead, then half-width pairs; four at 25% with a thin divider before each item after
  the first; a numbered two-column list for "most viewed". [F] `FlexibleGeneral.tsx`,
  `FlexibleSpecial.tsx`, `StaticMediumFour.tsx`, `StaticFeatureTwo.tsx`, `MostViewedFooterGrid.tsx`.
- Reuters' PhotoPack chooses rows per breakpoint and defaults to "bottom-heavy" packs; its
  Scroller takes a foreground position (left, right, middle, opposite). [F] `PhotoPack`, `Scroller`.
- ProPublica wanted a range of layout objects "wide but not overwhelming", anchored left, right
  or centre of the text. [S] guides.propublica.org/design.
- Work & Co built Aesop "a full suite of modular components" for custom page layouts; Folch
  Studio's Openhouse layouts "reflect the unique subject matter of each article, whilst at the
  same time maintaining rhythm and flow". [S]
- Shopify Dawn's "collage" section: at most three blocks, the large one left or right. [F]
- Andy Clarke's compound grids give asymmetric but coherent spans. [S]
- **Taken:** a library of seven block layouts (below), chosen per section by content and count.
  No layout twice in a row; no layout more than twice per page. [I]

## 2. Vary the *type* of composition, not just the image side

- NN/g: alternating decorative images left and right ("zig-zag") makes people stumble while
  scanning; aligned layouts scan more efficiently. Zig-zag is tolerable for two or three rows. [S]
- So professional pages rotate composition types — split, a heading hung in a left rail
  (the Guardian's FrontSection puts the title in a 2–3 column rail with a 1px divider from
  1140px), photo packs, columns divided by thin rules — and change proportion when they mirror.
  [F] `FrontSection.tsx`.
- Alternate dense sections with image-led ones; give each section one dominant element (a bento
  anchor is about twice a supporting cell). [S]
- Align text to the image's top edge rather than centring it beside a tall photo. [I, from
  ProPublica split openers and the Guardian's immersive grid]
- **Taken:** rhythm rules 1–4 in DESIGN.md, enforced by `pageRhythmProblems` in
  `src/lib/sections.ts`.

## 3. Cards versus lists

- NN/g: cards suit mixed content; for uniform items a list scans faster, because cards make the
  eye re-orient from card to card. [S] "Layer-cake" scanning — reading headings and skipping body
  until one matches — only works when headings stand out. [S]
- USWDS: cards summarise and link out; no purely decorative bordered boxes; not for text meant to
  be read card to card. [F] NHS: thirds and quarters get narrow on phones. [F]
- NN/g "common region": a border groups content strongly enough to override spacing; ask first
  whether whitespace would do. [S] Bands and big gaps create false floors. [S]
- **Taken:** equal tiles only for parallel items of 25 words or fewer; everything longer becomes
  rows inside one rounded tile. The client's 2026-09-11 ruling (containers are rounded tiles, not
  bare lines) is kept: hairlines appear only inside a tile.

## 4. One lede per page; one paragraph size

- GOV.UK: a lead paragraph (24px against 19px body) "at the top of a page to summarise the
  content … only once per page". [F]
- The Guardian's standfirst sits above the body, not beside it, and on phones is the same size as
  the body, distinguished by typeface and weight. [F] `Standfirst.tsx`
- Two sizes side by side read as a mistake: two competing starting points, baselines that never
  line up, and larger type in a narrow column falls under Bringhurst's 45–75 characters. [S]
- **Taken:** the page header's standfirst is the page's lede; every section paragraph is body
  size. Statements hold two paragraphs at most.

## 5. Notes: title, label under it, text to the right

- GOV.UK's summary list — "a list of key facts" — uses a 30% key column beside the value and
  stacks on phones. [F] Print "sideheads" put headings in the margin beside the text. [S]
- HTML's `hgroup` groups a heading with a following subtitle; Apple's `.subtitle` cell puts
  detail text under a title. [F/S] NN/g: scanners read the first two words of a heading, and the
  word "Note" carries no information — so the title goes first. [S]
- Note text stays at body size. One or two notes per page, never two in a row, with prose between
  them (NHS warning callout, GitHub Docs alerts). [F]
- A11y: `role="note"` for ancillary content; don't give inline asides an accessible name (each
  would become a landmark); a visually hidden "Note:" prefix in the heading, the visible label
  hidden from screen readers. [F] MDN, NHS/GOV.UK patterns.
- **Taken:** `Callout.astro`'s two-column anatomy for every tone; at most three notes per page
  (medical cautions exempt), never on neighbouring sections.

## 6. Placeholders show the final frame

- Print's "FPO" (for position only): a frame at the final position and size, labelled so nobody
  mistakes it for the final. [S] Wireframe convention: a box with the brief written inside. [S]
- Brad Frost: templates must "articulate important properties of components like image sizes";
  client-facing pages should carry real representative content. [F] *Atomic Design* ch. 2–3.
- **Taken:** empty frames keep their final ratio and carry "Photo to come", the shot brief and the
  ratio *inside* the frame, with no caption below.

## 7. FAQ

- NN/g: for short and medium FAQs a list of questions and answers is still best; question
  typography must stand apart from answers; accordions suit independent chunks. [S] BBC GEL:
  opening one item must not close the others. [F] Reuters FaqBox: native `details`/`summary`,
  heading above, borders between items. [F]
- **Taken:** on slide pages the FAQ splits — heading, intro and a 1:1 photo in a sticky left
  column, one column of slimmer rows on the right, several open at once. The home page and
  `/faqs` keep the two-column grid.

## 8. Timelines and steps

- Reuters SimpleTimeline: a 1px line, hollow markers, bold dates, **no images inside events**. [F]
- The Guardian's timeline switches off an event's bullet when a large image sits before it: the
  image breaks the rail. [F]
- Sticky media beside scrolling steps (Scrollama "sticky graphic side by side", Reuters Scroller);
  on phones, stack. [F] USWDS process list: 3–10 numbered steps, parallel verb-led headings. [F]
- NN/g: avoid horizontal scrolling for essential content; keep carousels to about five items. [S]
- **Taken:** steps and timelines render as rows beside (split) or under a hanging head (rail);
  the photo never sits inside the timeline. The pigment-rail HealingAxis is retired.

## 9. Related links without dead space

- Match the layout to the count: one → a full-width row; two → halves; three → an L-shape or
  stacked rows beside a photo; five or more → a list. [I, from Guardian FlexibleSpecial [F]]
- Reuters referrals: two per row with a thumbnail; the Guardian's numbered list, 2 × 5. [F]
- **Taken:** "Before you book" is three pale-pink link rows stacked beside one photo (the owner's
  own suggestion); "More guides" stays a 3×3 of pale-pink tiles.

## 10. Phones

- Reflow into a different pattern rather than squeezing: the Guardian turns four-across rows into
  image-left list rows and stacks two-up features. [F]
- Switch to portrait or square crops: the Guardian's feature card uses 5:3 on desktop and 4:5 on
  mobile; ProPublica squares split openers. This is the main defence against thin strips. [F/S]
- **Taken:** every layout drops to one column (head, photo, body, note) below 60rem; 5:2 strips
  become 4:3; no carousels.

## 11. The cursor spotlight

- Technique: two custom properties hold the pointer position relative to the tile; a
  `radial-gradient` on a `::before` layer reads them and fades in on hover. [S] Measure once per
  frame, then write; attach one listener per group, not per card (Paul Irish's list of forced
  reflows). [F] Gate with `(hover: hover) and (pointer: fine)`; honour reduced motion; hide
  under `forced-colors`; keep the glow under the text. [F] MDN, WCAG 2.3.3.
- **Taken:** `src/scripts/spotlight.ts` and `LinkTiles.astro`, on pale-pink link tiles only.

## Not verified

The award galleries (Awwwards, Godly, SiteInspire, Minimal Gallery), Stripe and Stripe Press,
Linear, Apple, Aesop's own site, Kinfolk, Cereal and Openhouse layouts could not be loaded; only
design-press quotes about them were read. No published "rotate N variants" rule exists in a
major design system — NN/g's position is that consistency is the default and deliberate variety
needs a reason, which is why the rotation here is constrained by explicit rhythm rules.

## Sources

- Guardian dotcom-rendering (github.com/guardian/dotcom-rendering, `dotcom-rendering/src`):
  `grid.ts`, `layouts/ImmersiveLayout.tsx`, and in `components/`: `FrontSection`, `Figure`,
  `FlexibleGeneral`, `FlexibleSpecial`, `StaticMediumFour`, `StaticFeatureTwo`,
  `MostViewedFooterGrid`, `MostViewedFooterItem`, `Standfirst`, `DropCap`, `TextBlockComponent`,
  `Timeline`, `ScrollableCarousel`, `ScrollableFeature.island`, `Carousel.island`,
  `MultiImageBlockComponent`, `KeyTakeaways`, `PullQuoteBlockComponent`.
- Reuters graphics-components (github.com/reuters-graphics/graphics-components): `Block`,
  `Scroller`, `PhotoPack` (+ `utils.ts`), `ReferralBlock/Referral`, `SimpleTimeline`, `FaqBox`.
- BBC GEL (github.com/bbc/gel): promos, carousels, accordions, breakout boxes.
- GOV.UK Design System: layout, paragraphs, headings, summary list, inset text, warning text,
  accordion, details; GDS blog "FAQs: why we don't have them".
- NHS service manual: inset text, warning callout, care cards, card.
- USWDS: process list, card, typography, summary box. IBM Carbon notification usage; Carbon for
  IBM.com spacing. Shopify Polaris banner. Shopify Dawn `sections/collage.liquid`,
  `sections/multicolumn.liquid`. Material carousel strategies.
- NN/g: cards component; card vs list view; layer-cake scanning; zigzag page layout; common
  region; illusion of completeness; accordions on desktop and mobile; accordion icons; FAQs;
  mobile carousels; horizontal scrolling; photos as web content; first two words; chunking;
  mobile list thumbnails; fancy formatting looks like an ad; low contrast; web form design;
  horizontal attention leans left.
- ProPublica design guides (grid, article openers) and "Inside ProPublica's article layout
  framework"; Rob Weychert, "CSS Grid editorial layouts"; Andy Clarke (Smashing: Pressing
  Matters, Avaunt; "Using a 4+5 compound grid"; CSS-Tricks on images in long-form content);
  Josh Comeau and Ryan Mulligan on full-bleed/breakout layouts; Every Layout (Sidebar, Switcher,
  Reel); The Pudding (responsive scrollytelling, sticky); Scrollama README; Mike Bostock "How to
  scroll"; Brad Frost *Atomic Design*; Tufte CSS; webtypography.net (Bringhurst); Butterick's
  Practical Typography; Baymard on line length.
- MDN: `aside`, `role="note"`, `hgroup`, `details`, `aspect-ratio`, responsive images,
  `@media (hover)`, `prefers-reduced-motion`, `@property`, `scroll-snap-type`. WCAG 2.3.3.
- Case-study quotes: Work & Co for Aesop; Folch Studio for Openhouse; the Kinfolk redesign
  (It's Nice That); Studio Airport for Emergence Magazine (Webby Awards).
