# Handoff: apply the Aftercare design feedback, then generalise

Written 2026-09-11 for a fresh session. Read this first; it carries everything the previous
session knew that is not in the code.

## Where things stand

- The old GoDaddy site's pages were captured to `.impeccable/live-content/embeds/` (`<slug>.md`
  copy with container markers, `<slug>.json` blocks, `<slug>.html` standalone originals,
  `design-notes.md`, screenshots in `../screenshots/`). Committed as `22f9f2e`.
- Twelve pages were rebuilt as slide-style sections (Safety, Aftercare, the 10 Learn guides).
  **This work is in the working tree, uncommitted** (19 changed or new files). Commit it before
  or after the feedback below; the user has not said.
  - Content model: `src/lib/sections.ts` (`Section` union: facts, statement, grid, sequence,
    compare, faq, cta; `ImageSlot`; `Callout`; `validateSections`, `internalHrefs`).
  - Renderer: `src/components/sections/Sections.astro` dispatching to `Facts`, `Statement`,
    `Grid`, `Sequence`, `Compare`, `ImageSlot`, `Callout`; plus `src/components/CtaBand.astro`,
    `MoreGuides.astro`; `Faq.astro` gained an `items` prop.
  - Content: `src/content/seed/pages.json` (Safety, Aftercare) and `sections` on every entry in
    `src/content/seed/learn.json`. Sanity mirror in `cms/schema/sections.ts`.
  - Pages: `src/pages/safety.astro`, `src/pages/aftercare.astro`, `LearnReader.astro` (sections
    layout when `article.sections` exists, old sidebar layout otherwise).
  - Tests: `tests/sections.test.ts` (validator + every authored page validates and links only to
    real routes). `npm test`, `npm run check` (10 pre-existing errors in files not touched),
    `npm run build` (fails on the visible word "placeholder" and on broken internal links) all pass.
  - Image placeholders: `ImageSlot` renders a Surface-filled 12px frame at the slot's ratio with
    "Photo to come" and the shot label beneath. Never render the word "placeholder".
- Screenshots: `npm run build:nocheck` then
  `node scripts/capture-routes.mjs .impeccable/critique/capture-sections aftercare learn/how-long-it-lasts`
  (routes without a leading slash; the site has `trailingSlash: "never"`). Full-page PNGs are too
  small to judge; cut 1440px-wide crops with `sharp` (available transitively) and read those.
- Dev server: Astro runs it as a managed background service (`npx astro dev stop`, `npx astro dev logs`).
  After a new file is imported before it exists, Vite caches the failure; restart the server.
- The service pages, FAQs, About and Home intro still show none of the captured content. That
  was scoped out by the user; the embeds for them are ready.

## The feedback (on Aftercare, verbatim intent)

1. The lead photo under the title looks wrong and needs a huge file. Put it to the right of the title.
2. The vertical timeline (same rail as the home page, black-brown-pink dots) is ugly. Make it horizontal so it fills the width.
3. Every "what is normal" and "what to avoid" section should carry photo placeholders for now.
4. The four bullet cards plus medical note should be a compact 4-column layout with the note spanning the full width beneath, so the section is shorter.
5. Medical notes as their own card is right, but a big card for little text looks silly. Try something else.
6. "Before you book" should be its own, bigger, clearly separated section, not a tiny afterthought.
7. The 4-across "Why touch-ups matter" cards are the right format: compact, not cramped. (Format reference only.)
8. Use colour on containers: pastel pink, brown or gray.
9. Some blocks use lines instead of rounded containers. Make them all rounded containers.

Scope: **Aftercare only, until the user approves it.** Then, as a separate task, write simple
rules/formats from the approved page and apply them to the other pages.

Two points override `DESIGN.md` ("no tinted card ground", "pill radius only on tags"). The
feedback wins. Do not rewrite `DESIGN.md` now; do it in the generalisation task.

Note: the section components are shared, so component changes will show on Safety and the
Learn guides immediately. That is acceptable and intended; only the content edits are
Aftercare-specific.

## The plan

### 1. Lead photo beside the title
- `src/components/PageHeader.astro`: add an optional named slot `aside`. When filled: two-column
  grid at 60rem+ (`minmax(0, 3fr) minmax(0, 2fr)`, text left, aside right, vertically centred);
  stacked below 60rem. Pages that pass no aside are unchanged.
- `src/pages/aftercare.astro`: render the lead `ImageSlot` in that slot, drop the separate lead
  section. In `pages.json` set aftercare `lead.ratio` to `"4 / 5"`.

### 2. Horizontal sequence
- `src/components/sections/Sequence.astro`: rewrite as a horizontal strip of rounded tiles (3 to
  5 columns at 60rem, 2 at 40rem, 1 below). Each tile: label tag, h3, text, bullets. One hairline
  across the top of the row with a small single-colour ink dot per tile (no pigment ramp, no
  pink end). `steps` shows the serif numeral instead of the label tag. If the section has an
  `image`, it becomes the first tile at tile width, ratio 4:5. Callout under the strip, full width.
  Tile fill pale brown (`--tag-brow`). Leave `HealingAxis.astro` (home page) untouched.

### 3. Placeholders on every normal/avoid section (content, `pages.json` aftercare)
- "What to avoid while it heals." (4 bullet items): add a 3:2 `image` to each item.
- "Eyes.", "Lips.", "Scalp." (2 items each): add a 3:2 `image` to each item, matching "Brows."
  (a compare with two 1:1 images). "What is normal" already has a 4:5 image.
- Every shot label distinct and specific ("Healed lip tint, day 5, light flaking at the border").

### 4 and 7. Compact 4-column grids, note spanning beneath
- `src/components/sections/Grid.astro`: bullet-card grids render 4 columns at 60rem (2 at 40rem)
  whether `columns` is 2 or 4; two-item grids stay two columns. Tiles: bone fill (`--bone`), no
  border, 12px radius, padding `--space-5`, optional 3:2 image at the top, title, then bullets or
  text. The section callout spans the full grid width beneath as a band.
- `GridItem` gains optional `href` and `linkLabel` (link card); `columns` allows `2 | 3 | 4`.
  Update `src/lib/sections.ts`, the validator, `tests/sections.test.ts` (add a 3-column link grid
  to the good fixture), and `cms/schema/sections.ts`.

### 5. Callouts as bands
- `src/components/sections/Callout.astro`: at 60rem+ a horizontal band: tag + title in a ~16rem
  left column, text/bullets/links on the right; stacked below. Padding `--space-5`, 12px radius,
  no border. Fill by tone: caution = `--pale-pink` + red "Medical note" tag; voice = `--pale-pink`
  + pink "From Pomi" tag + serif quote type; note = `--bone` + neutral tag; links = `--bone`,
  links in a row.
- `Statement.astro`: a callout goes under the copy at full width; the image is the only side element.

### 6. "Before you book" as its own section (content)
- Remove the links callout from "Why touch-ups matter." Add a `grid` section "Before you book."
  with a lede, `columns: 3`, three link cards (Safety `/safety`, FAQs `/faqs`, Why touch-ups
  matter `/learn/importance-of-touch-up`; title, one line, `href`, `linkLabel: "Read"`), placed
  after the touch-ups grid and before the FAQ. Link cards use the pale pink fill.

### 8. Colour rule for containers
Grid tiles bone; sequence tiles pale brown; compare tiles bone; link cards and caution/voice
bands pale pink; note bands bone; facts tiles bone. Fills replace hairline borders; nothing keeps
both. Image frames keep their surface fill and hairline.

### 9. Rounded containers instead of lines
- `Facts.astro`: the ruled strip becomes 4 rounded bone tiles (2 per row at 40rem, 4 at 60rem).
- Sequence steps lose their hairline separators (covered by 2).
- `MoreGuides.astro` is ruled but not on Aftercare; leave for the later pass.

## Verify
1. `npm test`, `npm run build`.
2. Screenshot Aftercare at 1440 and 390 (command above), crop, and check: photo right of the
   title; horizontal timeline with one hairline and single-colour dots; "what to avoid" as one
   4-tile row with the medical band beneath; a "Photo to come" frame on every normal/avoid tile;
   callouts as bands; "Before you book" as its own three-card section; no ruled strips; fills in
   bone, pale brown and pale pink.
3. Show the crops to the user and wait for approval before touching other pages.

## After approval (separate task)
Write the rules/formats derived from the approved Aftercare page (container fills, band
callouts, horizontal sequences, header-with-photo, per-section placeholders, "Before you book"
block), update `DESIGN.md` to match, then apply them to Safety and the 10 Learn guides (content
edits in `pages.json` / `learn.json`; components are already shared). The service pages, FAQs,
About and Home intro still need their captured content brought in the same way.
