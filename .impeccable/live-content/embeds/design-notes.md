# The previous site's page design, read from the embeds

Hand-written after reading the captured embeds (`<slug>.html` in this folder). The measured
tokens (colours, radii, grids, per-page class inventory) are generated into `design-tokens.md`
by `scripts/import-live-embeds.mjs`; this file is about how the pages are built, not raw values.
Screenshots of every page at 1440 and 390 wide are in `../screenshots/`. They were taken from the
standalone `<slug>.html` files (`capture-live.mjs --local`), so they show the embed exactly as
designed without GoDaddy's header, footer and cookie banner around it.

## What these pages are

Every page body on pomibrow.com is one hand-authored HTML document dropped into a GoDaddy
"custom HTML" block. GoDaddy renders it in an `<iframe>` between its own header and footer. The
pages share one visual system and one vocabulary of `pomi-*` classes, with three families:

| Family | Pages | Embed id pattern | Distinctive parts |
|---|---|---|---|
| Info pages | safety, aftercare, faqs, about-pomi | `#pomi-<name>-page` | hero card with SVG, note/warning boxes, numbered process, FAQ accordion |
| Service pages | microblading, microblading-shading, ombre-powder-brows, eyeliner, lash-enhancement, lip-tint, scalp-micropigmentation | `#pomi-<service>-page` | trust badges, illustrated "who it suits" cards, pricing block, location box, FAQ, closing CTA |
| Learn articles | the 10 Learn slugs | `#pomi-<topic>-learn-page` | "Short answer" box first, then explainer sections; timeline or compare grids on some |
| Home intro | home | `#pomi-home-intro-block` | small block: kicker, one h2, intro paragraph, 3 photo cards, note box |

Word counts (including FAQ questions, prices and badges): info pages 1,380 to 1,770; Learn
articles 1,180 to 1,410; service pages 740 to 800; home block 233. All 22 embeds together are
about 24,800 words. Per-page numbers are in `index.json`.

## Page skeleton (info, service and Learn pages all follow it)

1. **Hero** (`.pomi-hero` > `.pomi-wrap` > `.pomi-hero-grid`): two columns, `1.08fr 0.92fr`.
   Left: kicker pill, h1, lead paragraph, one more paragraph, a primary + secondary button pair.
   Right: a white rounded card (`.pomi-hero-card` / `.pomi-hero-art`) holding a gradient inner
   panel with an inline SVG illustration, a bold one-line claim and a one-line caption. Hero
   background is a warm radial + linear gradient with a `0 0 34px 34px` bottom radius.
   Service and Learn pages add a **trust row** under the buttons: three `.pomi-trust-item`
   badges (translucent white, `18px` radius, bold brown text).
2. **Quick-facts strip**: a `.pomi-card-grid` of four small cards (`repeat(4, 1fr)`), each an h3
   plus one sentence. Service and Learn pages put a small SVG icon above each h3.
3. **Sections** (`.pomi-section`, 64px vertical padding; alternate `.pomi-section-light` white
   on the cream page). Each opens with a mini kicker (same pill), then an h2, then one of:
   - `.pomi-two-col` (`0.9fr 1.1fr`): prose on the left, a card or box on the right
   - `.pomi-card-grid` (4-up) or `.pomi-wide-grid` (2-up) of h3 + paragraph cards
   - `.pomi-process`: three `.pomi-step` cards with a 42px round brown `.pomi-step-number`
   - `.pomi-timeline` (healing, how-long pages): stacked `.pomi-time-item` rows, `150px 1fr`,
     a solid brown `.pomi-time-label` pill on the left ("Day 1", "Days 4 to 7")
   - `.pomi-compare` (lip tint vs blush, eyeliner vs lash, powder brows): 2-up compare cards
   - callout boxes: `.pomi-note-box` / `.pomi-answer-box` / `.pomi-link-box` (cream `#fff4ed`,
     30px radius), `.pomi-warning-box` (dark `#2b211d` on white text), `.pomi-note` (24px radius)
4. **Pricing** (service pages only): `.pomi-pricing`, a dark rounded block, `1fr auto`, with the
   package name and copy on the left and a big `.pomi-price` on the right ("$600 + $100",
   `clamp(38px, 5vw, 58px)`, weight 800), followed by a button pair.
5. **Location** box (`.pomi-location`, cream) naming Tustin, Irvine and Orange County.
6. **FAQ**: `.pomi-faq` is a grid of native `<details><summary>` accordions; the FAQ page groups
   them under h3s in `.pomi-faq-group`. Most pages also carry a `FAQPage` JSON-LD script
   (captured as `faqSchema` in the JSON records).
7. **Closing CTA** (`.pomi-final`): centred h2 + paragraph + button pair on the dark brown ground.

Every page ends on the same two buttons: book (contact form, sometimes with `?from=<service>`)
and call `(949) 427-7664`. Cross-links between the pages use `.pomi-text-link` (brown, bold,
underlined).

## Visual language

- **Type**: Arial/Helvetica throughout. h1 `clamp(38px, 5vw, 64px)` at line-height 1.05,
  h2 `clamp(28px, 4vw, 42px)`, h3 22px, body 17px on line-height 1.6, lead 20px, lists 16px.
  Kicker: 14px, uppercase, weight 700, letter-spacing 0.03em.
- **Palette**: warm brown on cream. Ink `#2b211d`, body text `#4b3c36`, accent `#8f5a47`
  (buttons, step numbers, timeline labels, links), deep accent `#6e3f31` (kicker text),
  page `#fffaf7`, section tint `#fff4ed`, borders `#efd9cf` / `#e8cfc3` / `#d5b6a8`,
  kicker pill `#f1d8cc`, gradient stops `#fff7f2` → `#f0d7cc` / `#f3ded2`. Learn and service
  pages add `#5b3b31` / `#5d4a43` for badge and secondary text.
- **Shape**: everything is rounded. Pills `999px` (kicker, buttons); cards 24px; boxes and
  hero cards 30px; hero card inner panel 26px to 28px; hero bottom corners 34px.
- **Depth**: two soft shadows only: `0 10px 28px rgba(74,50,40,.08)` on cards and
  `0 18px 45px rgba(74,50,40,.12)` on the hero card. Cards also carry a 1px `#efd9cf` border.
- **Buttons**: `.pomi-btn` pill, 14px 22px padding, weight 700, 16px; primary = solid accent on
  white text, secondary = white with `#d5b6a8` border and accent text; hover lifts 2px.
- **Illustration**: no photography except the three stock photos on the home block. Every hero
  and many quick-fact cards use small inline SVGs (shield with tick, brow arcs, eye, lips, clock,
  calendar) drawn in the palette. The SVG markup is preserved in each `<slug>.html`.
- **Responsive**: at 900px every two-column grid collapses to one column and the 4-up card grid
  becomes 2-up; at 560px cards go 1-up, the hero loses top padding, and the button pair stacks
  full-width.

## Reading the captured files

- `<slug>.html`: open in a browser for the layout as designed (GoDaddy header/footer absent).
- `<slug>.md`: the copy in order. `<!-- pomi-… -->` comments mark where the container changes,
  so a run of h3/paragraph pairs under `<!-- pomi-card -->` is a card grid, `#### ` lines are
  FAQ questions, `**[label](href)**` lines are buttons, and lone lines under `pomi-trust`,
  `pomi-pricing` or `pomi-time-item` are badges, prices and timeline labels.
- `<slug>.json`: the same as `blocks[]` (`tag`, `text`, `cls`, `href`), plus `links`, `images`,
  `faqSchema`, `style` tokens and the raw `styleCss`. `nativeBlocks[]` holds the older GoDaddy
  articles that sit under the embed on `how-long-it-lasts` and `are-powder-brows-for-me`.
- `contact-form` has no embed: it is a native GoDaddy form.

## Things to carry over vs. leave behind

Worth keeping: the "short answer first" opening on Learn articles, the four-fact strip under
every hero, the numbered three-step process, the healing timeline rows, the FAQ accordions with
matching JSON-LD, the always-present book/call pair, and the consistent local signal (Tustin,
Irvine, Orange County) in headings and location boxes.

Leave behind: Arial, the iframe embed itself, per-page duplicated stylesheets, `?` in slugs, and
the `/faq` links on the Learn pages (the FAQ page in the nav is `/faqs`; map both to the new route).
