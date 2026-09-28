# Slide-format rollout: Safety and the Learn guides

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

Written 2026-09-11 for a fresh session. Read this first; it carries everything the previous
session knew that is not in the code.

**Goal:** Bring Safety and the 10 Learn guides up to the approved Aftercare format, and make
DESIGN.md describe that format.

**Architecture:** Content edits in `src/content/seed/pages.json` (safety) and
`src/content/seed/learn.json` (10 guides) do most of the work, since the section components
(`src/components/sections/*`) are shared and already carry the approved styling. Two small
component changes (LearnReader lead photo, MoreGuides tiles) and one docs change (DESIGN.md).

**Tech Stack:** Astro 7 static site, TypeScript, `node --test`, puppeteer-core screenshots via
`scripts/capture-routes.mjs`, `sharp` for crops.

**Spec:** The approved Aftercare page. Reference points: `src/content/seed/pages.json`
(`aftercare` entry), `src/pages/aftercare.astro`, and "The approved format" below. Open
`http://localhost:4400/aftercare` (dev server) to see it.

## Where things stand

- Branch `design/pink-accent-and-pigment`, pushed. The user merges to `main` through the GitHub
  compare page; this machine has no `gh` CLI and the session may not merge to `main` itself.
- Aftercare is approved and committed. Its feedback pass and the format it produced are the
  spec for this plan.
- The site deploys as a Cloudflare Worker with static assets (`wrangler.jsonc`, `src/worker.ts`).
  A home-only launch gate exists (`docs/home-only-launch.md`) and is off.
- The previous handoff (`2026-09-11-aftercare-feedback-handoff.md`) is done except its
  "after approval" section, which this plan is.

## Global constraints

- Copy is Pomi's own, condensed from `.impeccable/live-content/embeds/<slug>.md`. Medical wording
  (infection signs, cold-sore warning, "ask your healthcare provider") stays verbatim.
- The visible word "placeholder" never reaches a page; `npm run build` fails on it. Empty photo
  slots say "Photo to come" plus the shot.
- Every internal link must resolve; `npm run build` fails otherwise. Routes:
  `/`, `/about`, `/safety`, `/aftercare`, `/faqs`, `/contact`, `/learn`, `/learn/<slug>`,
  `/services/<slug>`.
- `tests/sections.test.ts` validates every authored page: grid 2 to 4 items, `columns` 2/3/4,
  link cards need both `href` and `linkLabel`, sequence needs 3+ items, compare exactly 2 sides.
- Only one `ContactForm` per page.
- Screenshots: `npm run build:nocheck` then
  `node scripts/capture-routes.mjs .impeccable/critique/capture-rollout safety learn/<slug>`
  (routes without a leading slash). Crop the 1440px PNG into 1100px-tall slices with `sharp`
  before judging; full-page PNGs are too small to read. A crop script must live inside the
  repo to resolve `sharp` (e.g. `.impeccable/critique/capture-rollout/crop.mjs`, delete after):
  ```js
  import sharp from "sharp";
  const [src, outPrefix, w, step] = process.argv.slice(2);
  const { height } = await sharp(src).metadata();
  for (let y = 0, n = 0; y < height; y += Number(step), n++) {
    await sharp(src).extract({ left: 0, top: y, width: Number(w), height: Math.min(Number(step), height - y) })
      .png().toFile(`${outPrefix}-${String(n).padStart(2, "0")}.png`);
  }
  ```
  Mobile full-page captures above ~16000px wrap in Chrome; trust only the first crops.
- The dev server on port 4400 caches stale component styles after long uptime; if a change does
  not show, `npx astro dev stop` then `npx astro dev --port 4400`.
- Another session may have uncommitted work in the tree (pink lines, larger type, Hero,
  HealingAxis, DESIGN.md, tokens.css). Check `git status` before every commit and stage only
  your own files or hunks. Never `git add -A`. To stage part of a file, write a small patch
  against HEAD and `git apply --cached patch.diff`.

## The approved format (from Aftercare, 2026-09-11)

1. **Header.** `PageHeader` with title, lede, meta on the left and the lead photo in the `aside`
   slot on the right, ratio `4 / 5`, vertically centred. Stacked below 60rem.
2. **Facts strip.** Four tiles directly under the header, no heading.
3. **Tile.** Fill `var(--tile)` (#fcfcfb), `1px solid var(--outline-pink)` (the studio's box-line
   pink), 12px radius, padding `--space-5`. Used by grid cards, compare sides, facts, timeline
   tiles. Link cards are `var(--pale-pink)` fill with no outline.
4. **Statement.** Heading and lede sit in the copy column beside a `4 / 5` photo, vertically
   centred with it. The callout is a full-width band beneath.
5. **Sequence.** A horizontal row of tiles under one hairline. One pink dot per tile, spread so
   the first starts the line and the last ends it. A section `image` becomes the first tile at
   `4 / 5`. Steps show the serif numeral; timelines show a label tag.
6. **Grid.** Bullet-list grids run four across (a 2-item grid stays two columns). Every
   bullet-list tile carries a `3 / 2` image slot with a specific shot. Text-only 4-grids (like
   "Why touch-ups matter") carry no images. The callout is a full-width band beneath.
7. **Callouts.** `note` and `links` are bone bands; `voice` is a pale-pink band in the serif;
   `caution` is a margin note (left hairline, stacked label, title, text, 60ch).
8. **Before you book.** A `grid` with `columns: 3` of link cards (title, one line, `href`,
   `linkLabel: "Read"`) placed after the last content section and before the FAQ. It replaces
   the page's final `links` callout.
9. **No ruled strips.** Containers are tiles, not lines. Section rules between slides stay.
10. **Shot labels** are distinct and specific: subject, moment, framing, light. Aftercare examples:
    "Healed lip tint, day 5, light flaking at the border"; "Gloved hand holding a clean cotton
    swab over a healing brow, fingers kept off the skin". Never reuse a label on a page.

## Task 1: DESIGN.md describes the slide format

**Files:** Modify `DESIGN.md` (the "Don't" list near the end, and add a section).

Check `git status DESIGN.md` first. If it is modified by someone else, make your edits in the
working file but stage with a crafted patch (`git diff DESIGN.md`, keep only your hunks,
`git apply --cached`), or wait for that work to be committed.

- [ ] Replace the line beginning `- **Don't** give any section, hero, or card a colored or tinted background` with:
  `- **Don't** tint a section ground. Tiles on the slide pages are the one filled container: Tile (#FCFCFB) inside the pink box line; link cards are Pale Pink. Nothing else carries a fill. (A warm shell with blush and sand bands was tried on 2026-09-08 and reverted the same day.)`
- [ ] Delete the line beginning `- **Don't** tint a section ground. This was tried on 2026-09-08` (its point is now in the line above).
- [ ] Add a section before "### FAQ" titled `### Slide pages (Safety, Aftercare, the Learn guides)` containing the ten numbered rules from "The approved format" above, verbatim, plus one line: "Content lives in `src/content/seed/pages.json` and `learn.json`; components in `src/components/sections/`."
- [ ] Add `tile: "#fcfcfb"` under `colors:` in the YAML front matter, after `pale-pink`.
- [ ] Commit: `git add DESIGN.md && git commit -m "DESIGN.md: the slide-page format"`.

## Task 2: MoreGuides as link tiles

**Files:** Modify `src/components/MoreGuides.astro` (the `<ul>`/`<li>` styles only).

- [ ] Remove `border-top` from the list and `border-bottom` from the items.
- [ ] Give each item: `position: relative; padding: var(--space-5); border-radius: var(--radius); background: var(--pale-pink); display: grid; gap: var(--space-3); align-content: start;` and keep the grid columns (1 / 2 at 40rem / 3 at 60rem) with `gap: var(--space-5)`.
- [ ] Keep the "Read →" link; make the whole tile clickable the way `Grid.astro` does: on the link, `::after { content: ""; position: absolute; inset: 0; border-radius: inherit; }`.
- [ ] Verify on `http://localhost:4400/learn/how-long-it-lasts` (bottom of page): three pale-pink tiles, no rules.
- [ ] Commit: `git add src/components/MoreGuides.astro && git commit -m "More guides as link tiles"`.

## Task 3: Learn guides get the header photo

**Files:** Modify `src/components/LearnReader.astro` (sections branch only).

- [ ] Read `src/components/Photo.astro`, `Caption.astro` and `sections/ImageSlot.astro` for the exact prop names. Then, in the sections layout, delete the `.lead` section and render the cover in the header instead:
  ```astro
  <PageHeader title={article.title} lede={article.summary} parent={{ href: "/learn", label: "Learn" }}>
    {article.cover && (
      <figure slot="aside" class="slot">
        <Photo photo={article.cover} ratio="4 / 5" sizes="(min-width: 60rem) 40vw, 100vw" widths={[640, 960]} loading="eager" fetchpriority="high" />
        <figcaption><Caption service={/* the related service title the existing ".related" line already computes, else "Pomi B. Brow Studio" */} detail={article.cover.detail ?? article.title} /></figcaption>
      </figure>
    )}
    {!article.cover && article.lead && <ImageSlot slot="aside" image={{ ...article.lead, ratio: "4 / 5" }} loading="eager" fetchpriority="high" />}
  </PageHeader>
  ```
- [ ] Remove the now-unused `.lead` styles from the sections branch.
- [ ] `npm run build:nocheck`, screenshot `learn/how-long-it-lasts`, crop, confirm the photo sits right of the title at 1440 and under it at 390.
- [ ] Commit: `git add src/components/LearnReader.astro && git commit -m "Learn guides: cover photo beside the title"`.

## Task 4: Safety page content

**Files:** Modify `src/pages/safety.astro`, `src/content/seed/pages.json` (`safety` entry).

- [ ] `safety.astro`: replace the `<PageHeader ... />` plus the `.lead` section with the Aftercare pattern:
  ```astro
  <PageHeader title={page.title} lede={page.lede} meta={page.meta}>
    {page.lead && <ImageSlot slot="aside" image={page.lead} sizes="(min-width: 60rem) 40vw, 100vw" widths={[640, 960]} loading="eager" fetchpriority="high" />}
  </PageHeader>
  ```
  and delete the `.lead` style block.
- [ ] `pages.json` safety `lead`: `{"ratio": "4 / 5", "shot": "The studio set for one appointment: disinfected surface, fresh barriers, sealed single-use tools, shot from the doorway"}`.
- [ ] Add a `3 / 2` `image` to each item of the three bullet-list grids:
  - "One client at a time.": "Why privacy matters" → "The studio door closed, one chair, one client's setup on the tray, no one else in frame"; "Why control matters" → "Tray laid out for one appointment: gloves, sealed tools, pigment cup, in order".
  - "Who should ask first.": "Health and healing" → "Consultation form on a clipboard, the health questions page, a pen resting on it"; "The treatment area" → "Close, even-light shot of a brow area with clear, calm skin, ready for treatment".
  - "Safety continues after.": "Protect the healing area" → "Healing brows on day three, dry and undisturbed, no makeup nearby"; "Know when to ask" → "Phone on the studio counter beside the printed aftercare card".
- [ ] Remove the `links` callout ("Read next") from "Safety continues after.".
- [ ] Insert before the `faq` section:
  ```json
  {
    "type": "grid",
    "heading": "Before you book.",
    "lede": "Three things worth reading first: how to prepare, what healing looks like, and the questions clients ask most.",
    "columns": 3,
    "items": [
      {"title": "How to prepare", "text": "Skin, timing and what to tell me before we start.", "href": "/learn/prepare-for-appointment", "linkLabel": "Read"},
      {"title": "Aftercare", "text": "What is normal while it heals, day by day.", "href": "/aftercare", "linkLabel": "Read"},
      {"title": "Frequently asked questions", "text": "Short answers to the questions clients ask most.", "href": "/faqs", "linkLabel": "Read"}
    ]
  }
  ```
- [ ] `npm test` then `npm run build`; both pass.
- [ ] Screenshot `safety` at 1440 and 390, crop, check: photo right of the title; six new "Photo to come" frames; "Before you book" as three pink cards before the FAQ; caution callout as a margin note.
- [ ] Commit: `git add src/pages/safety.astro src/content/seed/pages.json && git commit -m "Safety: the approved slide format"`.

## Tasks 5 to 14: one Learn guide each

Each task follows the same recipe on one `learn.json` entry. Do them in this order, one commit
each (`git add src/content/seed/learn.json && git commit -m "Learn: <slug> in the approved format"`),
and screenshot each page before committing.

**Recipe for one guide:**

- [ ] Read the guide's `sections` and its source copy in `.impeccable/live-content/embeds/<slug>.md` (for shot ideas; the SMP guide's file is `learn-scalp-micropigmentation.md`).
- [ ] For every `grid` whose items have `bullets`, add a `3 / 2` `image` to each item with a specific shot label (rule 10). Text-only grids stay without images.
- [ ] If the guide ends its content with a `links` callout, remove that callout and insert a "Before you book." `grid` (`columns: 3`) before the `faq`, with the callout's links as link cards (title, one line, `href`, `linkLabel: "Read"`). Fill to three cards from `/safety`, `/aftercare`, `/faqs` in that order, skipping any the guide already links and never linking the guide to itself. An earlier `links` callout in the same guide stays as a band.
- [ ] Any `sequence` with an `image` keeps it (it renders as the first tile).
- [ ] Any `statement` without an `image`: leave it; the heading still moves into the copy column.
- [ ] `npm test` (validator + link check), `npm run build`.
- [ ] Screenshot `learn/<slug>` at 1440, crop, check the four things: frames on every bullet tile, the link section before the FAQ, no dead callout, distinct shot labels.

**Per-guide specifics (from the 2026-09-11 survey):**

| Task | slug | bullet-list grids to add images to | links callouts |
|---|---|---|---|
| 5 | `how-long-it-lasts` | none with bullets ("Why results vary." is text-only) | 2: convert the last, keep the first |
| 6 | `is-permanent-makeup-safe` | "Clean studio practices to look for." (4 items, all bullets) | 2: convert the last |
| 7 | `are-powder-brows-for-me` | check each grid; none flagged in the survey | 2: convert the last |
| 8 | `pmu-healing-timeline` | none flagged ("By service." is text-only) | 1: convert it |
| 9 | `eyeliner-vs-lash-enhancement` | check the two `columns: 2` grids | 1: convert it |
| 10 | `lip-tint-vs-lip-blush` | check "What color to expect." | 1: convert it |
| 11 | `good-pmu-candidates` | "Who should ask before booking." | 1: convert it |
| 12 | `prepare-for-appointment` | "Before brows.", "Before eyeliner or lash enhancement.", "Before lip tint.", "Before scalp micropigmentation.", "When to ask before booking." | 1: convert it |
| 13 | `scalp-micropigmentation` | "Who should ask before booking SMP?" | 1: convert it |
| 14 | `importance-of-touch-up` | "Yearly and additional touch-ups." | 1: convert it |

"Check" means: open the grid, and if its items have `bullets`, add images; if they only have
`text`, leave it.

## Task 15: Photo frames inside tiles

**Files:** Modify `src/components/sections/{Grid,Compare,Sequence}.astro`.

Only once `--frame-in-card` exists in `src/styles/tokens.css` (it is in another session's
uncommitted work; check with `grep -n frame-in-card src/styles/tokens.css`). A pink photo frame
inside a pink-outlined tile reads as a double rule.

- [ ] In each of the three components add, next to the tile rule block, one selector matching that file's tile class:
  `.cards__item :global(.slot__frame) { border-color: var(--frame-in-card, var(--border)); }` (Grid),
  `.compare__side :global(.slot__frame) { ... }` (Compare), `.strip__tile :global(.slot__frame) { ... }` (Sequence).
- [ ] Screenshot `aftercare`, confirm the frames inside tiles are grey and the tile outline is pink.
- [ ] Commit: `git add src/components/sections/Grid.astro src/components/sections/Compare.astro src/components/sections/Sequence.astro && git commit -m "Grey photo frames inside pink-outlined tiles"`.

## Task 16: Final verification and handoff back

- [ ] `npm test`, `npm run build`, `npm run check` (5 pre-existing errors in files this plan does not touch: ContactForm.astro, content.ts, services/[slug].astro; no new ones).
- [ ] Screenshot all 11 pages at 1440 and 390 in one run:
  `node scripts/capture-routes.mjs .impeccable/critique/capture-rollout safety learn/how-long-it-lasts learn/is-permanent-makeup-safe learn/are-powder-brows-for-me learn/pmu-healing-timeline learn/eyeliner-vs-lash-enhancement learn/lip-tint-vs-lip-blush learn/good-pmu-candidates learn/prepare-for-appointment learn/scalp-micropigmentation learn/importance-of-touch-up`
- [ ] Send the user one crop per page (the header plus first section) and wait for approval.
- [ ] Push the branch. The user merges via the GitHub compare page:
  `https://github.com/rizgosla/Pomi-Brow/compare/main...design/pink-accent-and-pigment?expand=1`

## Out of scope, for the next handoff

Services pages (`src/pages/services/[slug].astro`, copy in `services.json`, no `sections`
field yet), FAQs, About and Contact. Captured copy for services, FAQs and About is ready in
`.impeccable/live-content/embeds/` (`about-pomi.md`, `faqs.md`, seven service pages at ~900
words each); Contact has no captured copy. `learn/index.astro` is hardcoded to the first guide.
