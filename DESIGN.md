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
typography:
  display:
    fontFamily: "Newsreader Variable, Newsreader, Lyon Text, Georgia, serif"
    fontSize: "clamp(2.5rem, 1.9rem + 2.6vw, 4.125rem)"
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
  headline:
    fontFamily: "Newsreader Variable, Newsreader, Lyon Text, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.4rem + 1.4vw, 2.75rem)"
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
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Geist Variable, Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.05rem + 0.35vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Geist Variable, Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Geist Variable, Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "Geist Variable, Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif"
    fontSize: "0.8125rem"
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
  rail: "2px"
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
  gutter: "clamp(1.25rem, 0.75rem + 2vw, 2.5rem)"
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
- One border color (`#EAEAEA`) at one weight (1px) does all structural work: section rules, card edges, photo frames, dividers, the timeline axis.
- Newsreader at optical size 72 for h1, h2, and the review numeral; Geist for body and every control.
- Four muted pastels appear only inside tags and form status, always with a semantic meaning.
- Every photograph is framed at 12px with a 1px border, receives the same mild grade and 4% warm grain, and carries a caption.
- Buttons are solid `#C42A66`, 6px radius, no shadow. Tags are the only pill shape.
- The studio's pink marks two things only: a Call control, and the Week 6 resolution. Everything else that used to be pink is back in ink.
- The colour that is not pink is sampled from the work: four category tags and a six-step healing rail built on pigment values taken from the studio's own healed photographs.
- Motion is one gesture: the scroll-entry reveal. Nothing else animates beyond 200ms color and arrow-nudge transitions.

## Colors

A warm monochrome with one near-black and one hairline, plus four pastels reserved for tags.

### Primary
- **Ink** (`#111111`): headings and focus outlines. Ink no longer fills buttons; it holds the type hierarchy and nothing else.
- **Pink Ink** (`#C42A66`): the accent that ships, and it is spent on exactly two things -- **the Call controls** (hero button, header number, mobile call bar, form submit, the phone links in the form aside and footer) and **the Week 6 resolution** (its tag and its timeline dot). Plus the input focus border and the caret. 5.4:1 on white, so it carries body-size text and white-on-pink buttons at AA. An accent that appears everywhere signals nothing; this one means "act" or "this is where it resolves."
- **Pink Ink Hover** (`#A82255`): the primary button hover; the only tonal shift a button makes.
- **Pigment** (`#3D2A23` brow, `#3E2B24` eye, `#6A2524` lip, `#281712` hair): sampled from the studio's own healed photographs -- the mean of the darkest 5% of pixels across three images per category, which is the deposited pigment rather than the skin around it. Brow and eye come back almost identical because the pigment genuinely is the same brown. These are the source of the category tags and the healing rail; they are never used as type or fill directly.
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
- **Border** (`#EAEAEA`): the single hairline. Section rules, card and photo edges, input strokes, dividers, the FAQ item rule, the timeline axis, the link underline at rest.

### Named Rules
**The One Hairline Rule.** Every border, rule, divider, and frame is `1px solid #EAEAEA`. There is no second border color and no second weight; the timeline dot's outline (`#787774`) is the sole exception because it must read at 9px.

**The Tag-Only Color Rule.** Pastel fills appear only in tags (24px tall pills), the form status line, and the quiet button's hover. Never as a section field, card fill, icon background, or heading color.

**The Accent-Means-Action Rule.** Pink appears in two places only: a Call control, and the Week 6 resolution. Not links, not arrows, not the numeral, not nav hover. It never colors a heading, a paragraph, a caption, a section field, a hairline, or the logo. Every word of running copy stays in ink.

**The Pigment Rule.** Colour that is not the accent comes from the work itself. The four category tags and the six-step healing rail are built on values sampled from the studio's own healed photographs, never on abstract semantic hues. If a new colour is needed, it is sampled, not chosen. Category is always carried by the tag's label text as well as its colour, so colour is never the only code.

**The White Field Rule.** Sections have no background color. Adjacent sections are separated by one hairline and six to eight rem of white, nothing else.

## Typography

**Display Font:** Newsreader Variable (with Lyon Text, Georgia, serif), self-hosted via Fontsource with the optical-size axis loaded
**Body Font:** Geist Variable (with Geist Sans, SF Pro Display, Helvetica Neue, system-ui, sans-serif), self-hosted via Fontsource
**Label/Mono Font:** Geist Mono stack (SF Mono, ui-monospace, Menlo). Not self-hosted; the `.meta` price and phone style resolves to the system monospace.

**Character:** A high-contrast editorial pairing. Newsreader at opsz 72 is tight (-0.025em) and low (1.1) and appears only where a sentence carries the argument. Geist does everything functional at a generous 1.6 line-height. The contrast between the two, not size alone, builds hierarchy. Headings sit directly on the canvas with no label above them.

### Hierarchy
- **Display** (400, `clamp(2.5rem, 1.9rem + 2.6vw, 4.125rem)`, 1.1, -0.025em, opsz 72): the hero h1 only, max-width 14ch, balanced wrapping; the cap was lowered from 4.5rem so the line holds two lines at 1440.
- **Numeral** (400, `clamp(4rem, 3rem + 5vw, 7rem)`, 1, -0.03em, opsz 72): the Yelp review count as one object beside a sans title.
- **Headline** (400, `clamp(1.75rem, 1.4rem + 1.4vw, 2.75rem)`, 1.1, -0.025em, opsz 72): every section h2, inside a `.section-head` capped at 44rem.
- **Quote** (400, `clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem)`, 1.35, -0.01em, opsz 24): short review quotes. Quotes over 220 characters fall back to Body in Geist.
- **Title** (500, 1.25rem, 1.3, -0.01em, Geist): h3s (service names, timeline step titles, the review-count sentence).
- **Lede** (400, `clamp(1.125rem, 1.05rem + 0.35vw, 1.3125rem)`, 1.5, Ink Muted): the one deck under each h2, max 40ch.
- **Body** (400, 1.0625rem, 1.6, Ink Body): paragraphs, FAQ answers, inputs. Measure 62ch; secondary paragraphs drop to Ink Muted.
- **Small** (500, 0.9375rem): buttons, nav links, text links, price rows, footer. Numbers tabular.
- **Caption** (400, 0.8125rem, 1.4, Ink Muted): photo captions, form labels, hero meta line, price footnote. Sentence case, with the service name in Ink at 500.
- **Label** (500, 0.6875rem, 0.06em, uppercase): tag text only.
- **Meta** (mono, 0.8125rem, Ink Muted): the optional price in a caption.

### Named Rules
**The Two-Voice Rule.** Newsreader is used for h1, h2, the numeral, and short quotes; everything else is Geist. No third face except the client's wordmark SVG.

**The No-Kicker Rule.** Nothing sits above a heading. Section heads are h2 then lede, full stop. Tags label cards and timeline steps, never headings.

**The Sentence-Case Rule.** Uppercase exists only inside tags. Captions, labels, nav, and buttons are sentence case.

## Layout

A single centered column: `min(100% - 2 * gutter, 64rem)` with a fluid gutter of `clamp(1.25rem, 0.75rem + 2vw, 2.5rem)`. Section padding is `clamp(6rem, 4rem + 5vw, 8rem)` on both sides, and each section after the first opens with a 1px hairline across the full viewport width. Section heads (h2 + lede) are capped at 44rem with a 4rem gap before content. The hero is the only section without a top rule; it pads 4rem top on phones and 6rem on desktop, filling `100svh` minus the 4.25rem header.

Two-column sections split unevenly and always favor the text: hero and About at 1.1fr / 1fr, method at 5fr / 6fr (photo left), FAQ at 2fr / 3fr, contact at 3fr / 2fr. Column gaps are 6rem on desktop. The method photo and the FAQ intro are sticky at `header + 2rem` on desktop.

The bento price grid is the one asymmetrical grid: three columns at 60rem with the first service spanning two, two columns at 40rem with the first and the extras card spanning both, one column below. Grid gaps are 1rem. The Instagram sample is two-up on phones and four-up on desktop with a 1.5rem row gap.

Breakpoints, all `min-width`: **60rem** is the primary switch (nav appears, header Call button appears, the mobile call bar disappears, multi-column sections engage). **40rem** steps the bento and the form's name/phone row to two columns. **48rem** steps the footer to 1.6fr / 1fr / 1fr and puts the review numeral beside its text. There is no dark mode and no container query; `color-scheme` is fixed to light.

On phones, the body reserves 4rem plus the safe-area inset for the fixed call bar, and scroll-padding respects it.

## Elevation & Depth

The system is flat. Depth comes from the hairline and from whitespace, not from shadow or tone. Cards and photographs are white on white, distinguished only by their 1px `#EAEAEA` edge. The sole atmospheric device is one fixed, non-scrolling radial light spot behind the top of the page (`radial-gradient(60% 45% at 70% 0%, rgba(214,178,140,0.12), transparent 70%)`), visible as a faint warmth behind the hero and gone by the second section. The header and mobile call bar float over content with a 12px backdrop blur on near-white, never with a shadow.

### Shadow Vocabulary
- **Hover lift** (`box-shadow: 0 2px 8px rgba(0,0,0,0.04)`): the only shadow. Appears on `.card` and Instagram tiles on hover over 200ms; absent at rest.
- **Input focus ring** (`box-shadow: 0 0 0 3px rgba(196,42,102,0.12)`): a spread ring with the border turned to Pink Ink; not a shadow in intent.

### Named Rules
**The Flat-At-Rest Rule.** Nothing carries a shadow at rest. Buttons never carry one at all. The only shadow is the 4% hover lift on cards and tiles.

**The No-Atmosphere Rule.** No gradients, light spots, or textures on or behind sections; the only tone is inside photographs.

## Shapes

Two radii and one pill. Small controls (buttons, inputs, the menu toggle, the skip link, the map, the form status) use 6px. Containers (cards, every photo frame) use 12px. Tags alone use 9999px. There is no radius larger than 12px on anything with area; the protocol's ban on pill containers and pill buttons holds throughout.

Borders are always 1px `#EAEAEA`, never doubled or darkened for emphasis. Photographs are clipped to their 12px frame with `object-fit: cover` at a declared ratio: 4:5 for method and About; 1:1 for Instagram tiles. Icons are a hand-drawn 24-unit set at a uniform 2px round-capped stroke in `currentColor`, sized 1rem to 1.15rem inline; the set is phone, arrow, instagram, yelp, pin, menu, close, external, plus, minus. The timeline is the one place a rule is not a hairline: a 3px rail at 2px radius carrying a pigment gradient, with 11px dots each filled at that moment's value. The hero photograph is the one exception to a fixed ratio: 4:5 on phones, 6:5 at 60rem+ with `object-position: 50% 40%`, so both brows stay in the crop.

## Components

Restrained and functional: everything is a white rectangle with one line around it, a black button, or a small pastel pill.

### Buttons
- **Shape:** slightly rounded (6px), 2.875rem tall, 1.25rem horizontal padding, inline-flex with a 0.55em gap for an optional 2px-stroke icon. Text is Small (0.9375rem, 500), tabular numerals when it carries the phone number.
- **Primary:** Pink Ink fill (`#C42A66`), white text at 5.4:1, no border, no shadow. The hero Call, form submit, mobile call bar, and the skip link.
- **Hover / Focus / Active:** hover to `#A82255` over 200ms; active `scale(0.98)` with the `cubic-bezier(0.16, 1, 0.3, 1)` ease; focus-visible is the global 2px **Ink** outline at 3px offset. The focus ring stays ink deliberately: an indicator needs 3:1 against its surroundings and the brand pink clears that by 0.04, which is the wrong place to spend the margin for a 30-60 audience on phones.
- **Quiet:** transparent with the hairline border and Ink text; hover fills Bone. Used for outbound proof links (the Instagram handle, "All 200+ reviews on Yelp"). It is not a Call control, so it carries no pink.
- **Text link (`.link`):** Small 500 in Ink with a 1px `#EAEAEA` underline at 0.25em offset that goes to `currentColor` on hover, plus the arrow icon that nudges 3px right. Links read as links from the underline, not from the accent -- the accent is reserved for Call.

### Chips (tags)
- **Style:** pill, 1.5rem tall, 0.6rem horizontal padding, Label type (0.6875rem, 500, 0.06em, uppercase). Neutral: Bone fill, Ink Muted text.
- **State:** four pigment variants for the service categories (brow `#F3E9DF`/`#5A3D2B`, eye `#EBE7E6`/`#3B3230`, lip `#F9E8E6`/`#7E2F2C`, hair `#E6E7E9`/`#33383D`), each sampled from that category's healed photographs, plus pink for Week 6. Pale red and pale green survive only as form status. No selected, hover, or interactive state -- tags are labels, not controls.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** Canvas.
- **Shadow Strategy:** none at rest; 4% hover lift (see Elevation).
- **Border:** 1px `#EAEAEA`.
- **Internal Padding:** `clamp(1.5rem, 1.2rem + 1.2vw, 2.5rem)`, a 0.75rem internal grid gap. Service cards stack h3, muted summary, then a hairline-topped price row (1.125rem 500 amount, muted touch-up note, then a footer row with the category tag left and the arrow right, pinned to the card bottom so every card shares one rhythm). Tags never sit above a heading. Review cards stack a quote and a name / source-tag footer. The studio card stacks address, hours, a 4:3 map at 6px, and a directions link.

### Inputs / Fields
- **Style:** Canvas fill, hairline stroke, 6px radius, `0.7rem 0.85rem` padding, Body type in Ink. Labels are Caption size at 500 above the field, with "optional" in Ink Muted. Selects hide the native chevron and draw a 1.5px Ink Muted corner.
- **Focus:** border to Ink plus a 3px `rgba(17,17,17,0.06)` ring; native outline removed.
- **Error / Status:** invalid fields take the Pale Red ink border. The status line is a 6px hairline box in Pale Green (success) or Pale Red (error). Submitting dims the button to 60%.

### Navigation
- **Header:** sticky, 4.25rem tall, Canvas at 85% with 12px blur, hairline bottom. Mark-only wordmark SVG (script only, subline removed for legibility) at 2.25rem tall on the left; on desktop, Small 500 links in Ink Muted (Ink on hover, no underline), then the phone number as a Small 500 text link with a 1rem phone icon while booking is by phone (a Book button appears only when a booking URL exists), so the hero holds the page's only black button in the first viewport. On phones the links collapse behind a 2.5rem square hairline-bordered menu toggle (menu / close icons cross-fade) that opens an inline panel of 1.125rem links separated by hairlines, with address and handle beneath.
- **Mobile call bar:** fixed bottom, hairline top, Canvas at 92% with blur, one full-width primary Call button (2.75rem) while booking is by phone; two columns (quiet Call + primary Book) only once a booking link exists. Slides away while the contact form has focus. Hidden at 60rem.
- **Footer:** hairline top, 6rem top padding, Small in Ink Muted; mark-only wordmark at 2.5rem, address in Ink Body, social links with 1rem icons, two link columns under 500 Ink heads, then a hairline-topped Caption-size bottom row.

### Photograph and caption (signature)
Every image on the site is the same object: a 12px-rounded, hairline-bordered frame over a Surface placeholder, `filter: saturate(0.88) contrast(1.02)` on the image, and a 4% multiply-blended warm fractal-noise grain on top. The grade is deliberately mild because the pigment color is the evidence and must not be misrepresented. Beneath sits a Caption row at 0.75rem top padding: service name in Ink 500, detail in Ink Muted, optional mono price pushed right. Nothing is ever drawn over the photograph.

### Healing timeline (signature)
An ordered list along a **3px pigment rail** (2rem inset, 2.5rem on desktop), each step a neutral tag for the moment, a Title h3, and a muted 46ch body, with 3rem between steps.

The rail is the signature. It runs a vertical gradient through the real thing the page is describing: `#D8CFC9` before pigment, `#33221B` dense on day one, `#4A342A` flaking, `#B7A399` washed out around day ten, `#6B4E3F` returning at week four, `#5A4133` settled -- then the Week 6 dot resolves to Pink Ink. Each 11px dot is filled at its own moment's value and carries a 1px ring plus a 3px canvas halo, because the day-ten dot is deliberately the palest object on the page (2.4:1) and the ring is what keeps it perceivable. The page argues in prose that "the color looks like it disappeared -- it has not"; the rail makes that argument in colour, and no other business could use it.

### FAQ
Native `<details>` items separated only by a hairline bottom rule, no container. Summary is Body-size 500 in Ink at 1.1rem vertical padding with a plus / minus icon that swaps on open. Answers are Ink Muted at 58ch with a "Full answer" text link. First item open by default.

### Scroll-entry reveal
Any block with `.reveal` starts at `opacity: 0; translateY(12px)` and resolves over 600ms with `cubic-bezier(0.16, 1, 0.3, 1)` when an IntersectionObserver (threshold 0.05, bottom margin -8%) sees it. Siblings in grids and lists stagger by `--i * 80ms`. Under `prefers-reduced-motion` the class is inert and blocks render in place.

## Do's and Don'ts

### Do:
- **Do** keep the canvas white and separate sections with one full-width `1px solid #EAEAEA` rule and `clamp(6rem, 4rem + 5vw, 8rem)` of padding.
- **Do** use `1px solid #EAEAEA` for every border, frame, divider, and axis at exactly one weight.
- **Do** set h1 and h2 in Newsreader at opsz 72, weight 400, -0.025em, line-height 1.1, and everything else in Geist at line-height 1.6.
- **Do** make every button `#C42A66` with white text, 6px radius, 2.875rem tall, hover `#A82255`, active `scale(0.98)`, and no shadow.
- **Do** reserve the pastels for tags and form status, each with a fixed meaning (yellow Eyebrows, blue Eyes, red Lips, green Hair, pink Week 6; green success, red error).
- **Do** spend Pink Ink only on a Call control or the Week 6 resolution, and keep every heading, paragraph, caption, link, and arrow in ink.
- **Do** sample any new colour from the healed photographs rather than choosing one.
- **Do** frame every photograph at 12px with a hairline, apply `saturate(0.88) contrast(1.02)` and the 4% warm grain, and caption it in sentence case.
- **Do** hold content to the 64rem column and section heads to 44rem; ledes to 40ch, body to 62ch.
- **Do** enter content with the scroll-entry reveal (12px, 600ms, 80ms stagger) and nothing else.
- **Do** draw icons from the hand-drawn 2px-stroke set in `currentColor`, sized 1rem to 1.15rem.
- **Do** show one pink Call button in the first viewport (the hero on desktop, the pinned bar on phones); the header carries the number as a Pink Ink text link while booking is by phone.

### Don't:
- **Don't** give any section, hero, or card a colored or tinted background; Bone and Surface are for tag fills and image placeholders only.
- **Don't** put a kicker, eyebrow, or tag above a heading; h2 then lede is the whole section head.
- **Don't** use a pill radius on anything except a tag; buttons and cards top out at 6px and 12px.
- **Don't** add a shadow at rest anywhere, or exceed `0 2px 8px rgba(0,0,0,0.04)` on hover.
- **Don't** draw lines, maps, or overlays on a photograph, or push the grade past the mild uniform grade.
- **Don't** introduce a third typeface, uppercase anything outside a tag, or use pure `#000000` for text.
- **Don't** put pink on a heading, a paragraph, a caption, a link, an arrow, a section background, a hairline, the logo, or the focus ring; and don't apply `#F26193` directly to anything, since it cannot hold contrast.
- **Don't** tint a section ground. This was tried on 2026-09-08 -- a warm shell with blush and sand bands -- and reverted the same day: it read as the med-spa template the brief exists to refuse, and `#ECDCC7` was a skin-tone section field, which the client had already rejected. Colour belongs on the work, not behind it.
- **Don't** give a service category an abstract semantic colour. The tags are pigment or they are nothing.
- **Don't** use a second border color, a thicker rule, or any gradient.
- **Don't** animate on scroll position, use `top`/`left`/`width` transitions, or add ambient motion; the reveal is the only entrance.
- **Don't** add a dark mode or a Book control until a booking target exists; neither is built.
