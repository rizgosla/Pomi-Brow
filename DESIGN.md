---
name: Pomi B. Brow Studio
description: A document, not a brochure. White canvas, one hairline, an editorial serif over a clean sans, and real healed photography doing the persuading.
colors:
  canvas: "#ffffff"
  bone: "#f7f6f3"
  surface: "#f9f9f8"
  ink: "#111111"
  ink-hover: "#333333"
  ink-body: "#2f3437"
  ink-muted: "#665b5d"
  border: "#eaeaea"
  pale-red: "#fdebec"
  pale-red-ink: "#9f2f2d"
  pale-blue: "#e1f3fe"
  pale-blue-ink: "#1f6c9f"
  pale-green: "#edf3ec"
  pale-green-ink: "#346538"
  pigment-brow: "#3d2a23"
  pigment-eye: "#3e2b24"
  pigment-lip: "#6a2524"
  pigment-hair: "#281712"
  tag-brow: "#f3e9df"
  tag-brow-ink: "#5a3d2b"
  tag-eye: "#ebe7e6"
  tag-eye-ink: "#3b3230"
  tag-lip: "#f9e8e6"
  tag-lip-ink: "#7e2f2c"
  tag-hair: "#e6e7e9"
  tag-hair-ink: "#33383d"
  heal-0: "#d8cfc9"
  heal-1: "#33221b"
  heal-2: "#4a342a"
  heal-3: "#b7a399"
  heal-4: "#6b4e3f"
  heal-5: "#5a4133"
  pale-yellow: "#fbf3db"
  pale-yellow-ink: "#956400"
  pink: "#f26193"
  pink-ink: "#c42a66"
  pink-ink-hover: "#a82255"
  pale-pink: "#fdebf1"
  line-pink: "#f8a8c4"
  line-pink-strong: "#f26193"
typography:
  display:
    fontFamily: "Newsreader Variable, Newsreader, Lyon Text, Georgia, serif"
    fontSize: "clamp(2.75rem, 1.9rem + 3.4vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
    fontVariation: "'opsz' 72"
  numeral:
    fontFamily: "Newsreader Variable, Newsreader, Lyon Text, Georgia, serif"
    fontSize: "clamp(4rem, 3rem + 5vw, 7rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontVariation: "'opsz' 72"
  numeral-sm:
    fontFamily: "Newsreader Variable, Newsreader, Lyon Text, Georgia, serif"
    fontSize: "clamp(3rem, 2.4rem + 2.4vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.03em"
    fontVariation: "'opsz' 72"
  headline:
    fontFamily: "Newsreader Variable, Newsreader, Lyon Text, Georgia, serif"
    fontSize: "clamp(2rem, 1.55rem + 1.8vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.025em"
    fontVariation: "'opsz' 72"
  quote:
    fontFamily: "Newsreader Variable, Newsreader, Lyon Text, Georgia, serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "-0.01em"
    fontVariation: "'opsz' 24"
  title:
    fontFamily: "Geist Variable, Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Geist Variable, Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif"
    fontSize: "clamp(1.1875rem, 1.1rem + 0.45vw, 1.4375rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Geist Variable, Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Geist Variable, Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "Geist Variable, Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Geist Variable, Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.06em"
  meta:
    fontFamily: "Geist Mono, SF Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    letterSpacing: "0"
rounded:
  rail: "3px"
  sm: "6px"
  md: "12px"
  pill: "9999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4rem"
  "9": "6rem"
  section: "clamp(6rem, 4rem + 5vw, 8rem)"
  gutter: "clamp(1.25rem, 0.6rem + 2.6vw, 3.25rem)"
components:
  button-primary:
    backgroundColor: "{colors.pink-ink}"
    textColor: "{colors.canvas}"
    typography: "{typography.small}"
    rounded: "{rounded.sm}"
    padding: "0 1.25rem"
    height: "2.875rem"
  button-primary-hover:
    backgroundColor: "{colors.pink-ink-hover}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.pink-ink}"
    typography: "{typography.small}"
    rounded: "{rounded.sm}"
    padding: "0 1.25rem"
    height: "2.875rem"
  button-quiet-hover:
    backgroundColor: "{colors.pale-pink}"
  tag:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 0.6rem"
    height: "1.5rem"
  tag-brow:
    backgroundColor: "{colors.tag-brow}"
    textColor: "{colors.tag-brow-ink}"
  tag-eye:
    backgroundColor: "{colors.tag-eye}"
    textColor: "{colors.tag-eye-ink}"
  tag-lip:
    backgroundColor: "{colors.tag-lip}"
    textColor: "{colors.tag-lip-ink}"
  tag-hair:
    backgroundColor: "{colors.tag-hair}"
    textColor: "{colors.tag-hair-ink}"
  tag-yellow:
    backgroundColor: "{colors.pale-yellow}"
    textColor: "{colors.pale-yellow-ink}"
  tag-blue:
    backgroundColor: "{colors.pale-blue}"
    textColor: "{colors.pale-blue-ink}"
  tag-red:
    backgroundColor: "{colors.pale-red}"
    textColor: "{colors.pale-red-ink}"
  tag-green:
    backgroundColor: "{colors.pale-green}"
    textColor: "{colors.pale-green-ink}"
  tag-pink:
    backgroundColor: "{colors.pale-pink}"
    textColor: "{colors.pink-ink}"
  card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-body}"
    rounded: "{rounded.md}"
    padding: "clamp(1.5rem, 1.2rem + 1.2vw, 2.5rem)"
  input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 0.85rem"
  photo-frame:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
---

# Design System: Pomi B. Brow Studio

## Overview

**Creative North Star: "The Document"**

This site is a document, not a brochure. Everything on the page that is not a photograph or a sentence is a one-pixel `#EAEAEA` line. The world follows the installed `minimalist-ui` protocol (premium utilitarian minimalism): a pure white canvas, a warm off-black type family, an editorial serif for the few lines that carry the argument, and a clean sans for everything else. Color is scarce and only ever means something. The persuasion is carried by real healed photography with quiet sentence-case captions, a healing timeline, and third-party reviews; the interface stays out of their way.

Density is low and rhythm is macro-first. Sections breathe at six to eight rem, sit on a single hairline, and hold one heading, one lede, and one body of proof each. Nothing lifts, glows, or slides except a scroll-entry reveal that fades content twelve pixels upward as it arrives. The client's brush-script wordmark is the only ornament and the only thing on the page that is not set in Newsreader or Geist.

This world replaced the earlier "Brow Map" system on 2026-09-07 after the client rejected it. Confirmed rejections carried from that decision: no skin-tone or brown colored section fields, no mapping lines or diagrams drawn over photographs, no pill-shaped buttons, no drop shadows, no script or display faces beyond the wordmark, no soft-focus face hero.

**Key Characteristics:**
- White canvas only; surfaces differ by a hairline, never by a colored slab.
- Every line is pink at one weight (1px): pale `#FBD0DF` for structure (section rules, dividers, header and footer edges, link underlines), blush `#F8A8C4` for every box and control (cards, FAQ cards, fields, quiet buttons, the menu toggle, the map), deepening to `#F26193` on hover and open. Photographs standing on the page are framed in the blush line too; a photograph inside a card keeps a grey `#EAEAEA` frame. Hovering any container fills it Pale Pink, the look of the open FAQ question.
- Newsreader at optical size 72 for h1, h2, and the review numeral; Geist for body and every control.
- Four muted pastels appear only inside tags and form status, always with a semantic meaning.
- Every photograph is framed at 12px with a 1px border, receives the same mild grade and 4% warm grain, and carries a caption.
- Buttons are solid `#C42A66`, 6px radius, no shadow. Tags are the only pill shape.
- The studio's pink fills and colours text in two places only: a Call control, and the Week 6 resolution. Since 2026-09-11 it also outlines every box, as a blush line.
- The colour that is not pink is sampled from the work: four category tags and a six-step healing rail built on pigment values taken from the studio's own healed photographs.
- Motion is two gestures: the scroll-entry reveal, and the hero's occasion swap. Nothing else animates beyond 200ms color and arrow-nudge transitions.

## Colors

A warm monochrome with one near-black and one hairline, plus four pastels reserved for tags.

### Primary
- **Ink** (`#111111`): headings and focus outlines. Ink no longer fills buttons; it holds the type hierarchy and nothing else.
- **Pink Ink** (`#C42A66`): the accent that ships, and it is spent on exactly two things -- **the Call controls** (hero button, header number, mobile call bar, form submit, the phone links in the form aside and footer) and **the Week 6 resolution** (its tag and its timeline dot). Plus the input focus border and the caret. 5.4:1 on white, so it carries body-size text and white-on-pink buttons at AA. An accent that appears everywhere signals nothing; this one means "act" or "this is where it resolves."
- **Pink Ink Hover** (`#A82255`): the primary button hover; the only tonal shift a button makes.
- **Pigment** (`#3D2A23` brow, `#3E2B24` eye, `#6A2524` lip, `#281712` hair): sampled from the studio's own healed photographs -- the mean of the darkest 5% of pixels across three images per category, which is the deposited pigment rather than the skin around it. Brow and eye come back almost identical because the pigment genuinely is the same brown. These are the source of the category tags and the healing rail, and since 2026-09-08 they also set type directly: each price group's heading and its 2px rule are drawn in that category's pigment (Brows 13.5:1, Eyes 13.3:1, Lips 11.0:1, Hair 17.2:1 on white). The four `--tag-*` chip fills are now derived rather than declared -- `color-mix(in oklab, <pigment> 12%, canvas)` with the pigment itself as the text -- so a chip is visibly a lighter print of its own group heading. Pigment never fills a section ground.
- **Pink** (`#F26193`): the studio's original pink, exactly as the brief supplies it. It is the documented source of the ramp and is not applied directly: at 3.0:1 on white it washes out under Newsreader's thin strokes and cannot carry text. Every shipped pink derives from it.

### Tertiary
Four pastel pairs (background / ink), used only as tag fills and form status. Each has a fixed meaning on the home page:
- **Pale Yellow** (`#FBF3DB` / `#956400`): the Eyebrows service category.
- **Pale Pink** (`#FDEBF1` / `#C42A66`): the "Week 6" touch-up milestone on the healing timeline, and the text-selection highlight. It reads near Pale Red, but the two never co-occur: Week 6 lives on the timeline, Lips on the service cards.
- **Pale Blue** (`#E1F3FE` / `#1F6C9F`): the Eyes service category.
- **Pale Red** (`#FDEBEC` / `#9F2F2D`): the Lips service category, the form's error status, and the invalid-field border.
- **Pale Green** (`#EDF3EC` / `#346538`): the Hair service category and the form's success status.

The quiet button's hover fill is Pale Pink; Bone remains the neutral tag fill.

### Neutral
- **Canvas** (`#FFFFFF`): the page, every card, the header and call bar (at 85% and 92% with a 12px backdrop blur), and inputs.
- **Bone** (`#F7F6F3`): the neutral tag fill (timeline dates, "Existing clients", the review source) and the quiet button's hover fill. Never a section background.
- **Surface** (`#F9F9F8`): the placeholder fill behind a photograph before it loads and behind the map embed. Not a card color.
- **Ink Body** (`#2F3437`): default body text. Body is never pure black.
- **Ink Muted** (`#787774`): ledes, captions, secondary copy, nav links at rest, timeline dots, placeholders.
- **Border** (`#FBD0DF`, `--border`): the structural hairline, a pale print of the studio pink (`#F26193` at ~30% over white). Section rules, dividers inside a card, header, footer and call bar edges, the link underline at rest. Grey until 2026-09-11.
- **Frame** (`--frame`, = Line Pink `#F8A8C4`): the frame of every photograph standing on the page -- the hero wall, Instagram tiles (deepening to `#F26193` on hover), About, service and Learn photographs, image placeholders.
- **Frame in card** (`#EAEAEA`, `--frame-in-card`): a photograph inside a card, such as a price cover. The card already carries the pink, and a pink frame inside a pink box reads as a double rule. The one grey line left.
- **Line Pink** (`#F8A8C4`, `--line-pink`): the box line -- `#F26193` at about 55% over white. Cards, FAQ cards, form fields, the form status box, quiet buttons, the menu toggle, the map. It is decoration and grouping, not a control boundary that must hit 3:1 (the grey it replaced was 1.2:1). **Line Pink Strong** (`#F26193`, `--line-pink-strong`) is the same line on hover and on the open FAQ card.

### Named Rules
**The Pink Line Rule.** Every border is 1px, and every line is pink except a photo frame. Structure (section rules, dividers inside a box, header and footer edges, link underlines) is pale pink `#FBD0DF`. Boxes and controls are blush `#F8A8C4`, one step deeper so a box still reads against the rules around it, stepping up to `#F26193` on hover or open. A photograph standing on the page takes the blush line as its frame; a photograph inside a card keeps a grey `#EAEAEA` frame so the card's pink is not doubled. Added 2026-09-11 at the client's request for more pink (boxes first, then the structural lines, then the free-standing photo frames, all the same day); it replaced the One Hairline Rule.

**The Hover-Is-Open Rule.** Hovering any container -- a card or an FAQ question -- gives it the open FAQ question's look: Pale Pink fill, `#F26193` line. Applied only under `(hover: hover)`, so a tap on a phone never leaves a card stuck pink. It replaced the 4% hover shadow on cards. The timeline dot's outline is the one other stroke, because it must read at 11px.

**The Tag-Only Color Rule.** Pastel fills appear only in tags (24px tall pills), the form status line, and hover and open states (the quiet button, a hovered container, the open FAQ question -- all Pale Pink). Never as a resting section field, card fill, icon background, or heading color.

**The Accent-Means-Action Rule.** Pink as a fill or as text appears in three places only: a Call or Contact control, the Week 6 resolution, and one recorded exception -- the cycling word in the hero line ("Perfect brows for every *meeting*"), which is the client's own device and is spent there on purpose. The blush box line (see the Two-Line Rule) is the one ambient use of the hue, and it is always a 1px outline, never a fill or a type colour. The open FAQ card's Pale Pink fill and Pink Ink mark are the same family: the one question you are reading is the one thing on that block in colour. Not links, not arrows, not the numeral, not nav hover. It never colors a heading, a paragraph, a caption, a section field, a hairline, or the logo. Every word of running copy stays in ink.

**The Pigment Rule.** Colour that is not the accent comes from the work itself. The four category tags and the six-step healing rail are built on values sampled from the studio's own healed photographs, never on abstract semantic hues. If a new colour is needed, it is sampled, not chosen. Category is always carried by the tag's label text as well as its colour, so colour is never the only code.

**The White Field Rule.** Sections have no background color. Adjacent sections are separated by one hairline and six to eight rem of white, nothing else.

## Typography

**Display Font:** Newsreader Variable (with Lyon Text, Georgia, serif), self-hosted via Fontsource with the optical-size axis loaded
**Body Font:** Geist Variable (with Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif), self-hosted via Fontsource
**Label/Mono Font:** Geist Mono stack (SF Mono, ui-monospace, Menlo). Not self-hosted; the `.meta` price and phone style resolves to the system monospace.

**Character:** A high-contrast editorial pairing. Newsreader at opsz 72 is tight (-0.025em) and low (1.1) and appears only where a sentence carries the argument. Geist does everything functional at a generous 1.6 line-height. The contrast between the two, not size alone, builds hierarchy. Headings sit directly on the canvas with no label above them.

### Hierarchy
- **Display** (400, `clamp(2.75rem, 1.9rem + 3.4vw, 4.75rem)`, 1.1, -0.025em, opsz 72): the hero h1 and subpage h1s, balanced wrapping. Raised on 2026-09-11 with the rest of the scale when the client read the page as too small. The hero h1 is capped at 18ch and fills its column up to the work wall.
- **Numeral** (400, `clamp(4rem, 3rem + 5vw, 7rem)`, 1, -0.03em, opsz 72): the Yelp review count as one object beside a sans title.
- **Numeral, small** (400, `clamp(3rem, 2.4rem + 2.4vw, 4.5rem)`, 1, -0.03em, opsz 72): the same count when it sits inside the home About column under the bio, where 7rem would swamp a 32rem block.
- **Headline** (400, `clamp(2rem, 1.55rem + 1.8vw, 3.25rem)`, 1.1, -0.025em, opsz 72): every section h2, inside a `.section-head` capped at 56rem. The review count's h2 is set here too: it was the only h2 on the page in Geist, a hole in the type rhythm and a quiet break of the Two-Voice Rule.
- **Quote** (400, `clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem)`, 1.35, -0.01em, opsz 24): short review quotes. Quotes over 220 characters fall back to Body in Geist.
- **Title** (500, 1.375rem, 1.3, -0.01em, Geist): h3s (service names, timeline step titles, the review-count sentence).
- **Lede** (400, `clamp(1.1875rem, 1.1rem + 0.45vw, 1.4375rem)`, 1.5, Ink Muted): the one deck under each h2, max 40ch. The hero lede runs one step larger (`clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)`, 34ch).
- **Body** (400, 1.125rem, 1.6, Ink Body): paragraphs, FAQ answers, inputs. Measure 62ch; secondary paragraphs drop to Ink Muted.
- **Small** (500, 1rem): buttons, nav links, text links, price rows, footer, the hero meta line, timeline step bodies on desktop. Numbers tabular.
- **Caption** (400, 0.875rem, 1.4, Ink Muted): photo captions, form labels, price footnote. Sentence case, with the service name in Ink at 500.
- **Label** (500, 0.6875rem, 0.06em, uppercase): tag text only.
- **Meta** (mono, 0.8125rem, Ink Muted): the optional price in a caption.

### Named Rules
**The Two-Voice Rule.** Newsreader is used for h1, h2, the numeral, and short quotes; everything else is Geist. No third face except the client's wordmark SVG.

**The No-Kicker Rule.** Nothing sits above a heading. Section heads are h2 then lede, full stop. Tags label cards and timeline steps, never headings.

**The Sentence-Case Rule.** Uppercase exists only inside tags. Captions, labels, nav, and buttons are sentence case.

## Layout

A single centered column: `min(100% - 2 * gutter, 82rem)` with a fluid gutter of `clamp(1.25rem, 0.6rem + 2.6vw, 3.25rem)`. History: 64rem until 2026-09-08 (read narrow), then 106rem (47px margins at 1440), which the client read on 2026-09-11 as text too small and too far apart with oversized photographs; 76rem was tried the same day, then settled at 82rem. The width is **sized to the price grid**: eight cards as two rows of four at ~316px each (1312px). It is also exactly what the hero's work wall needs, so every section, hero included, shares one edge. That leaves ~64px of margin per side at 1440 and ~304px at 1920, and it moved together with a one-step increase across the type scale. Every text measure is still capped per component: `.lede` 40ch, `.service__summary` 48ch, `.about__bio` 52ch, `.faq__answer` 58ch. Section padding is `clamp(6rem, 4rem + 5vw, 8rem)` on both sides, and each section after the first opens with a 1px hairline across the full viewport width. Section heads (h2 + lede) are capped at 56rem with a 4rem gap before content. The hero has no top rule of its own; the timeline section after it opens with the full-width rule, which lands exactly on the fold. The hero is exactly one screen: `min-height: calc(100svh - header)` with its content centred, so on first load nothing below it is visible and the next section starts at the fold. The wall's height is derived from the same screen (less header, 2rem padding each side and ~4rem for the caption row, capped at 42rem), so it fits on a 768px laptop as well as at 1080.

Two-column sections split unevenly: the hero at 36fr / 43fr with a 3rem gap (copy tight against the wall), About at `1fr / 26rem` (the photograph capped so it supports the bio), contact at 3fr / 2fr. The method section is no longer two columns: it is the section head over a horizontal timeline, with no photograph.

The bento price grid is the one asymmetrical grid: three columns at 60rem with the first service spanning two, two columns at 40rem with the first and the extras card spanning both, one column below. Grid gaps are 1rem. The Instagram sample is two-up on phones and four-up on desktop with a 1.5rem row gap.

Breakpoints, all `min-width`: **60rem** is the primary switch (nav appears, header Call button appears, the mobile call bar disappears, multi-column sections engage). **40rem** steps the bento and the form's name/phone row to two columns. **48rem** steps the footer to 1.6fr / 1fr / 1fr and puts the review numeral beside its text. There is no dark mode and no container query; `color-scheme` is fixed to light.

On phones, the body reserves 4rem plus the safe-area inset for the fixed call bar, and scroll-padding respects it.

## Elevation & Depth

The system is flat. Depth comes from the hairline and from whitespace, not from shadow or tone. Cards and photographs are white on white, distinguished only by their 1px `#EAEAEA` edge. The sole atmospheric device is one fixed, non-scrolling radial light spot behind the top of the page (`radial-gradient(60% 45% at 70% 0%, rgba(214,178,140,0.12), transparent 70%)`), visible as a faint warmth behind the hero and gone by the second section. The header and mobile call bar float over content with a 12px backdrop blur on near-white, never with a shadow.

### Shadow Vocabulary
- **Hover lift** (`box-shadow: 0 2px 8px rgba(0,0,0,0.04)`): kept as a token but no longer applied. Cards and Instagram tiles now answer hover with pink (see the Hover-Is-Open Rule), not with a shadow.
- **Input focus ring** (`box-shadow: 0 0 0 3px rgba(196,42,102,0.12)`): a spread ring with the border turned to Pink Ink; not a shadow in intent.

### Named Rules
**The Flat-At-Rest Rule.** Nothing carries a shadow at rest. Buttons never carry one at all. The only shadow is the 4% hover lift on cards and tiles.

**The No-Atmosphere Rule.** No gradients, light spots, or textures on or behind sections; the only tone is inside photographs.

## Shapes

Two radii and one pill. Small controls (buttons, inputs, the menu toggle, the skip link, the map, the form status) use 6px. Containers (cards, every photo frame) use 12px. Tags alone use 9999px. There is no radius larger than 12px on anything with area; the protocol's ban on pill containers and pill buttons holds throughout.

Borders are always 1px, grey for structure and blush pink for boxes (the Two-Line Rule), never doubled. Photographs are clipped to their 12px frame with `object-fit: cover` at a declared ratio: 4:5 for About; 1:1 for Instagram tiles and price covers. Icons are a hand-drawn 24-unit set at a uniform 2px round-capped stroke in `currentColor`, sized 1rem to 1.15rem inline; the set is phone, arrow, instagram, yelp, pin, menu, close, external, plus, minus. The timeline is the one place a rule is not a hairline: a 5px rail at 3px radius carrying a pigment gradient, with 11px dots each filled at that moment's value. The hero is the one place a photograph has no declared ratio: its nine tiles take their proportions from the grid cell they land in (see Hero work wall).

## Components

Restrained and functional: everything is a white rectangle with one line around it, a black button, or a small pastel pill.

### Buttons
- **Shape:** slightly rounded (6px), 2.875rem tall, 1.25rem horizontal padding, inline-flex with a 0.55em gap for an optional 2px-stroke icon. Text is Small (0.9375rem, 500), tabular numerals when it carries the phone number.
- **Primary:** Pink Ink fill (`#C42A66`), white text at 5.4:1, no border, no shadow. The hero Call, form submit, mobile call bar, and the skip link.
- **Hover / Focus / Active:** hover to `#A82255` over 200ms; active `scale(0.98)` with the `cubic-bezier(0.16, 1, 0.3, 1)` ease; focus-visible is the global 2px **Ink** outline at 3px offset, except on a pink-filled button, where it is **white** drawn inside the button at -5px offset. Ink on the pink fill measured 2.89:1, under the 3:1 an indicator needs; white on the same fill is 5.4:1. Everywhere else the ring stays ink.
- **Quiet:** transparent with the blush Line Pink border and Ink text; hover fills Pale Pink and the line goes to `#F26193`. Used for outbound proof links (the Instagram handle, "All 200+ reviews on Yelp"). It is not a Call control, so it carries no pink.
- **Text link (`.link`):** Small 500 in Ink with a 1px `#EAEAEA` underline at 0.25em offset that goes to `currentColor` on hover, plus the arrow icon that nudges 3px right. Links read as links from the underline, not from the accent -- the accent is reserved for Call.

### Chips (tags)
- **Style:** pill, 1.5rem tall, 0.6rem horizontal padding, Label type (0.6875rem, 500, 0.06em, uppercase). Neutral: Bone fill, Ink Muted text.
- **State:** four pigment variants for the service categories (brow `#F3E9DF`/`#5A3D2B`, eye `#EBE7E6`/`#3B3230`, lip `#F9E8E6`/`#7E2F2C`, hair `#E6E7E9`/`#33383D`), each sampled from that category's healed photographs, plus pink for Week 6. Pale red and pale green survive only as form status. No selected, hover, or interactive state -- tags are labels, not controls.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** Canvas.
- **Shadow Strategy:** none, at rest or on hover.
- **Border:** 1px Line Pink `#F8A8C4`. Dividers inside the card are the pale structural pink; a photograph inside keeps a grey frame.
- **Hover:** Pale Pink fill and a `#F26193` line, the open FAQ question's look, on pointer devices only.
- **Internal Padding:** `clamp(1.5rem, 1.2rem + 1.2vw, 2.5rem)`, a 0.75rem internal grid gap. Service cards stack h3, muted summary, then a hairline-topped price row (1.125rem 500 amount, muted touch-up note, then a footer row with the category tag left and the arrow right, pinned to the card bottom so every card shares one rhythm). Tags never sit above a heading. Review cards stack a quote and a name / source-tag footer. The studio card stacks address, hours, a 4:3 map at 6px, and a directions link.

### Inputs / Fields
- **Style:** Canvas fill, 1px Line Pink stroke, 6px radius, `0.7rem 0.85rem` padding, Body type in Ink. Labels are Caption size at 500 above the field, with "optional" in Ink Muted. Selects hide the native chevron and draw a 1.5px Ink Muted corner.
- **Focus:** border to Ink plus a 3px `rgba(17,17,17,0.06)` ring; native outline removed.
- **Error / Status:** invalid fields take the Pale Red ink border. The status line is a 6px hairline box in Pale Green (success) or Pale Red (error). Submitting dims the button to 60%.

### Navigation
- **Header:** the nav is Services / Learn / Safety / Aftercare. On the right, the phone number as a pink text link and a **Contact** button (Pink Ink, white text) that points at `/#contact`, the booking form at the foot of the home page, so it works from every page and needs no booking URL to exist. Sticky, 5rem tall on phones and 6.5rem from 60rem, Canvas at 85% with 12px blur, hairline bottom. The **full wordmark lockup** (script plus the "A BROW STUDIO" subline) at 3.25rem tall, 4.25rem from 60rem, on the left. The mark-only variant at 2.25rem was dropped on 2026-09-08: the subline had been cut because it was illegible at 36px, and at 52-68px it reads again. This is a practice people book by name, and the wordmark was the smallest it had ever been. on desktop, Small 500 links in Ink Muted (Ink on hover, no underline), then the phone number as a Small 500 text link with a 1rem phone icon while booking is by phone (a Book button appears only when a booking URL exists), so the hero holds the page's only black button in the first viewport. On phones the links collapse behind a 2.5rem square hairline-bordered menu toggle (menu / close icons cross-fade) that opens an inline panel of 1.125rem links separated by hairlines, with address and handle beneath.
- **Mobile call bar:** fixed bottom, hairline top, Canvas at 92% with blur, one full-width primary Call button (2.75rem) while booking is by phone; two columns (quiet Call + primary Book) only once a booking link exists. Slides away while the contact form has focus. Hidden at 60rem.
- **Footer:** hairline top, 6rem top padding, Small in Ink Muted; mark-only wordmark at 2.5rem, address in Ink Body, social links with 1rem icons, two link columns under 500 Ink heads, then a hairline-topped Caption-size bottom row.

### Photograph and caption (signature)
Every image on the site is the same object: a 12px-rounded, 1px-framed box over a Surface placeholder (the frame blush pink on the page, grey inside a card), `filter: saturate(0.88) contrast(1.02)` on the image, and a 4% multiply-blended warm fractal-noise grain on top. The grade is deliberately mild because the pigment color is the evidence and must not be misrepresented. Beneath sits a Caption row at 0.75rem top padding: service name in Ink 500, detail in Ink Muted, optional mono price pushed right. Nothing is ever drawn over the photograph.

### Hero work wall (signature)

Nine photographs on the right of the hero, in three columns over a twelve-row grid, each tile spanning 5, 4 or 3 rows. The three columns run their spans in a different order (5-4-3 / 3-5-4 / 4-3-5), so no tile edge meets its neighbour across the wall -- that offset is the whole effect. Placement is explicit (`--col` / `--row` / `--span` per tile), never auto-flowed, so the wall is identical every build.

Ratio variety is authored, not found. Every source is square (0.90-1.29, all 1320px on the long edge), so proportion comes from the cell and `object-fit: cover`, with a per-tile `--focus` because the subject sits high in most frames. Span choice is not free: the studio's before/after images are **stacked pairs at roughly 1:1**, and a pair only survives in the squarest cell (span 5 -- 0.81 at 1440, 1.04 at 1920). Anywhere wider the crop lands on the seam and reads as a broken image, so span 5 holds pairs and spans 4 and 3 hold single healed shots. Never full-bleed a single photograph here: at 1320px a source cannot carry an edge-to-edge frame on a 2x display, but a tile never exceeds ~570px.

Beneath the wall sits one caption row -- a sentence and the four category tags. The tags are not pinned to the tiles, because nothing is ever drawn over a photograph.

On phones the wall drops to the first five tiles: one wide 3:2 anchor across both columns, then a 2x2 at 1:1. Those five are ordered to cover all four categories and to lead with a single rather than a pair, since the anchor is also the LCP image. Nine tiles at 390px render each face at ~170px and prove nothing.

### Covers, and why they are a 5:2 strip

Every card and page header that needs one photograph uses a **cover**: a `{ref, focus}` pick stored on the service or the article, resolved to a `Photo` that carries its own crop point. `Photo.astro` turns `photo.focus` into `object-position`, so the crop travels with the image instead of living in each consumer's stylesheet.

Price-card covers are **1:1** at the card's full width -- a square frame on a square source crops nothing, so the four before/after covers show as the pair they are, the same as the hero wall. Elsewhere (the article lead, the aftercare lead) the strip is **5:2**, and that ratio is arithmetic, not taste. Most of the studio's library is stacked before/after pairs at roughly 1:1. With `object-fit: cover`, the visible band of a square image is `1/ratio` of its height, so isolating one half of a pair needs a box **wider than 2:1** — and a portrait box crops nothing vertically at all, which is why the service hero cannot hide a seam and does not try to. At 3:1 the band is 33% of the image and at 5:2 it is 40%; either way a focus of `50% 85%` lands it below a seam at 48%. A **square** frame on a square source crops nothing at all, which is why the Learn sidebar thumbnails are a 5:2 swatch rather than a square: as squares they showed the pairs whole and read as quartered grids.

Seams are not all in the same place: `microblading-shading/04` has its seam at 66%, where nothing below it fits, so that one crops **above** the seam at `50% 25%`. Any new cover gets its focus computed from its own seam, not copied.

Every price card is the same size. Microblading used to span two columns purely because it is first in the array, which read as a claim about importance that nothing supported; the grid is a plain 1 → 2 (40rem) → 3 (60rem) → **4 (80rem)** progression, so the eight cards land as two rows of four on a laptop or wider. At four across the card padding tightens to 1.5rem so the longer service names hold one line in a ~316px card. Covers are **framed** — the standard 1px `#EAEAEA` hairline and 12px radius, inside the card padding — because an edge-to-edge cover ran the cards together down the grid and was the one photograph on the site not obeying the frame rule.

A photograph shown whole because it cannot be cropped is captioned **"Before and after"**, never "Healed".

### One image per slot, per page

No photograph appears twice on the same page. `scripts/check-image-reuse.mjs` enforces it against the built HTML, matching known-unavoidable repeats by alt text rather than by hashed filename. There is exactly one waiver: the studio owns a single lash-enhancement photograph, needed by both the hero wall and the Lash Enhancement price card.

Two things this caught that eye and arithmetic both missed: three of the four Instagram tiles were also hero tiles, and the service hero cover was also in its own gallery below it. Note also that `microblading-shading/02` and `ombre-powder-brows/02` are **byte-identical** — the client filed one photograph under two services — so the library is 30 unique images, not 31.

### Image scale

One tile size, not one column count. The service gallery is `repeat(auto-fill, minmax(16rem, 1fr))` above 40rem, so tiles stay about 260–320px and the column count moves with the viewport; a fixed three columns made them 430px at 1440 and 550px at 1920 while thumbnails elsewhere were 260px. The service hero photograph is 1:1 (the sources are square, so any other ratio crops for nothing) and capped at 32rem.

### The Learn section

Learn is a reader, not an index. **`/learn` opens on the first article** ("How long does permanent makeup last?", first in `learn.json` because it has the most to say) with its canonical pointing at the article's own URL, and every article renders through one `LearnReader.astro`: **`LearnNav.astro`** on the left as a list of titles only, the article on the right. The nav is sticky under the header, capped at the viewport height with its own scroll. No buttons in this section -- it informs, and the header and pinned bar carry the call everywhere.

Articles are set in magazine order: standfirst, lead photograph, drop cap on the opener, h3 subheads with more space above than below, real lists where the source ran items together, one pull quote in Newsreader on a hairline. Every word is the client's; only the containers changed.

The one image on the previous site's longevity page is an AI-style stock render (`1 (2).png`, a generic face and a generic treatment chair). It is not used: beside 31 phone photographs of real healed brows it would read as a different site.

It replaced grouping the articles under Brows / Eyes / Lips / Hair. Someone arriving at Learn has one question, not a category to shop; the grouping asked them to first decide which bucket the question belonged in, and stranded a fifth "Start here" group for the articles that map to no single service.

The row for the article you are reading is ink and weight; no coloured bar, which the floor bans.

Below 60rem the nav is not a column. It collapses to a `<details>` above the content with a plus/minus affordance, so the answer comes first and the index only if asked for. The open state is set in script rather than CSS because `open` is an attribute, and re-synced on resize so a rotation cannot leave the desktop column shut.

### Subpages

Every page other than the home page opens with **PageHeader**: an optional parent link, an h1 capped at 20ch, one lede at 46ch, and an optional meta line on a hairline. It carries its own bottom space, so the first `.section` after it drops to `--space-6` on top (`.pagehead + .section`). Without that rule the two pads stacked into roughly 14rem of dead white on every subpage.

**PortableText** renders CMS long-form: h2 and h3 (h4 folds to h3, since this scale has no fourth level), paragraphs and list items at `--measure`, a hairline-bordered blockquote in Newsreader, and links as ink with a hairline underline. It builds escaped HTML in frontmatter rather than nested JSX -- this project has @astrojs/react installed, so a JSX component defined inside a `.map()` is handed to React and throws. Every string is escaped and link hrefs are restricted to http(s), mailto, tel and same-site, because body content comes from a CMS and, for two articles, from a scrape of the previous site.

The **Learn index** is where the pigment `.group-head` lives now that the price grid has gone back to the flat bento: articles group under Brows / Eyes / Lips / Hair by the category of the service they relate to, plus a neutral "Start here" for the general ones.

Article pages with no body are not padded out. They render the summary as the lede and hand off to the related service and a call. Eight of the ten Learn articles are in that state, because the previous site never had bodies for them.

### Healing timeline (signature)
An ordered list along a **5px pigment rail**, each step a neutral tag for the moment, a Title h3, and a muted body. From 60rem it is **horizontal**: six equal columns with a 1.5rem gap, the rail running left to right above them and stopping at the Week 6 dot, each dot at the head of its column, bodies in Small. Below 60rem it is the vertical rail down a 2rem inset with 1.5rem between steps. There is no photograph beside it: on 2026-09-11 the client found the vertical list next to a 4:5 method photo far too big (well over a screen), and the six weeks now read in one glance.

The rail is the signature. It runs a gradient through the real thing the page is describing, with its stops landing on the dots (step n at n/5 of the rail on desktop): `#D8CFC9` before pigment, `#33221B` dense on day one, `#4A342A` flaking, `#B7A399` washed out around day ten, `#6B4E3F` returning at week four, `#5A4133` settled -- then the Week 6 dot resolves to Pink Ink. Each 11px dot is filled at its own moment's value and carries a 1px ring plus a 3px canvas halo, because the day-ten dot is deliberately the palest object on the page (2.4:1) and the ring is what keeps it perceivable. The page argues in prose that "the color looks like it disappeared -- it has not"; the rail makes that argument in colour, and no other business could use it.

### FAQ
Heading and lede on top, then the questions as a **two-column grid of Line Pink cards**; hover and the open card take the `#F26193` line, and the open card fills Pale Pink with a Pink Ink minus. The first is open by default. The earlier sticky two-column layout left most of a wide left column empty at every width. Native `<details>` items, no container inside the card. Summary is Body-size 500 in Ink at 1.1rem vertical padding with a plus / minus icon that swaps on open. Answers are Ink Muted at 58ch with a "Full answer" text link. First item open by default.

### Scroll-entry reveal
Any block with `.reveal` starts at `opacity: 0; translateY(12px)` and resolves over 600ms with `cubic-bezier(0.16, 1, 0.3, 1)` when an IntersectionObserver (threshold 0.05, bottom margin -8%) sees it. Siblings in grids and lists stagger by `--i * 80ms`. Under `prefers-reduced-motion` the class is inert and blocks render in place.

### Hero occasion swap
The pink word in "Perfect brows for every *meeting*" cycles through seven occasions. The technique is taken from the Oasis Dental hero (`Oasis-Demo/src/styles/global.css`, `.hero-swap`). Every word is stacked in one inline-grid cell, so the line never reflows. Each word runs the same 16.8s CSS keyframe loop, delayed by `index * 2.4s`: it rises 0.35em out of a 4px blur, holds, then lifts out upward into blur exactly as the next one arrives. It uses no JavaScript. Under `prefers-reduced-motion` the animation is removed and only the first word shows. This is the page's one authored motion; the reveal is the other gesture.

## Do's and Don'ts

### Do:
- **Do** keep the canvas white and separate sections with one full-width `1px solid #EAEAEA` rule and `clamp(6rem, 4rem + 5vw, 8rem)` of padding.
- **Do** use `1px solid #EAEAEA` for structure (section rules, photo frames, inner dividers) and `1px solid #F8A8C4` for every box and control, stepping to `#F26193` on hover and open.
- **Do** set h1 and h2 in Newsreader at opsz 72, weight 400, -0.025em, line-height 1.1, and everything else in Geist at line-height 1.6.
- **Do** make every button `#C42A66` with white text, 6px radius, 2.875rem tall, hover `#A82255`, active `scale(0.98)`, and no shadow.
- **Do** reserve the pastels for tags and form status, each with a fixed meaning (yellow Eyebrows, blue Eyes, red Lips, green Hair, pink Week 6; green success, red error).
- **Do** spend Pink Ink only on a Call control or the Week 6 resolution, and keep every heading, paragraph, caption, link, and arrow in ink.
- **Do** sample any new colour from the healed photographs rather than choosing one.
- **Do** frame every photograph at 12px with a hairline, apply `saturate(0.88) contrast(1.02)` and the 4% warm grain, and caption it in sentence case.
- **Do** open every subpage with PageHeader, and let the section after it use the tightened top pad.
- **Do** give any new cover a focus computed from that image's own seam, and caption an uncroppable pair "Before and after".
- **Do** keep one photograph to one slot per page; run `node scripts/check-image-reuse.mjs` after the build rather than checking by eye.
- **Do** hold content to the 82rem column and section heads to 56rem; ledes to 40ch, body to 62ch, and give every paragraph its own ch cap rather than trusting the container.
- **Do** group the price grid by the four categories, each under its own pigment heading and 2px pigment rule, with the touch-up convention restated once per group beneath that rule.
- **Do** keep every touch target at least 44x44 at 390px, growing the hit area rather than the mark.
- **Do** enter content with the scroll-entry reveal (12px, 600ms, 80ms stagger); the hero occasion swap is the only other motion.
- **Do** draw icons from the hand-drawn 2px-stroke set in `currentColor`, sized 1rem to 1.15rem.
- **Do** show one pink Call button in the first viewport (the hero on desktop, the pinned bar on phones); the header carries the number as a Pink Ink text link while booking is by phone.

### Don't:
- **Don't** give any section, hero, or card a colored or tinted background; Bone and Surface are for tag fills and image placeholders only.
- **Don't** put a kicker, eyebrow, or tag above a heading; h2 then lede is the whole section head.
- **Don't** use a pill radius on anything except a tag; buttons and cards top out at 6px and 12px.
- **Don't** add a shadow at rest anywhere, or exceed `0 2px 8px rgba(0,0,0,0.04)` on hover.
- **Don't** draw lines, maps, or overlays on a photograph, or push the grade past the mild uniform grade.
- **Don't** introduce a third typeface, uppercase anything outside a tag, or use pure `#000000` for text.
- **Don't** put pink on a heading, a paragraph, a caption, a link's text, an arrow, a resting section background, the logo, or the focus ring; and don't use `#F26193` for text or fills, since it cannot hold contrast. As a 1px line it is fine.
- **Don't** tint a section ground. This was tried on 2026-09-08 -- a warm shell with blush and sand bands -- and reverted the same day: it read as the med-spa template the brief exists to refuse, and `#ECDCC7` was a skin-tone section field, which the client had already rejected. Colour belongs on the work, not behind it.
- **Don't** give a service category an abstract semantic colour. The tags are pigment or they are nothing.
- **Don't** use a third border colour, a thicker rule, or any gradient outside the healing rail.
- **Don't** animate on scroll position, use `top`/`left`/`width` transitions, or add ambient motion beyond the hero occasion swap; the reveal is the only entrance.
- **Don't** add a dark mode or a Book control until a booking target exists; neither is built.
