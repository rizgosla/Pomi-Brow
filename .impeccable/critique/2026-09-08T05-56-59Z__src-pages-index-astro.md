---
target: the home page after the pink + tinted-ground colour work
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 1
target_identity: "file:C:\\Users\\rizgo\\Documents\\GITHUB_REPOS\\PomiBrow\\src\\pages\\index.astro"
target_fingerprint: "sha256:dfd90e3ffb7e90c24c421610ed8c642a3a4109ba203b8f38e96f730539e251de"
target_path: "C:\\Users\\rizgo\\Documents\\GITHUB_REPOS\\PomiBrow\\src\\pages\\index.astro"
timestamp: 2026-09-08T05-56-59Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review, isolated · B: detector + browser evidence, isolated · run in parallel, neither saw the other)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Service cards are fully clickable (`.service__title a::after{inset:0}`) but carry no rest-state affordance — nothing reads as a link until the arrow nudges under an already-arrived pointer |
| 2 | Match System / Real World | 4 | The client's actual vocabulary throughout: "Bolder than the final," "Too light," "part of the service, not an extra" |
| 3 | User Control and Freedom | 3 | All four Instagram tiles leave the site to the same URL, no external indicator, no in-page way to browse the work |
| 4 | Consistency and Standards | 2 | The code contradicts its own published system — DESIGN.md's White Field Rule and two Don'ts are violated; cold pastels sit on warm grounds; DESIGN.md is now factually false in six places |
| 5 | Error Prevention | 2 | 39 of 48 tap targets under 44x44 at 390px (footer links 19px); focus indicator on the hero Call button measures 2.89:1, below the 3:1 minimum |
| 6 | Recognition Rather Than Recall | 2 | Nine price cards, six reading identical "$600 + $100 touch-up"; the touch-up convention is stated once, ~2,000px above the last card on mobile |
| 7 | Flexibility and Efficiency | 3 | Scored, not n/a — PRODUCT.md names a real secondary expert user (the returning yearly-touch-up client) who must scroll 2,677px past eight first-timer cards to reach her $300 |
| 8 | Aesthetic and Minimalist Design | 2 | The bands add chroma without structure; `.count` spends a near-full desktop viewport on three lines; `.contact` ends in ~400px of empty blush |
| 9 | Error Recovery | 2 | `novalidate` suppresses native per-field messages; one `role="status"` line above submit is the entire error surface — a bad phone number is announced but never pointed at |
| 10 | Help and Documentation | 4 | The page's best heuristic: timeline + FAQ + "Full answer" + Learn is real documentation for an anxiety-driven purchase |
| **Total** | | **27/40** | **Solid bones, system fighting itself** |

Heuristics 7 and 10 were scored rather than marked n/a: this Persuade surface has a genuine secondary expert user, and its entire persuasion strategy *is* documentation.

## Design Specificity Verdict

**Authored in language and structure; interchangeable in surface — and the tint moved it toward interchangeable, not away.**

**LLM assessment.** The copy layer is unmistakably this business. "Natural enough that no one asks." answers the exact fear in seven words. "Too light — the color looks like it disappeared. It has not." pre-empts the worst day of the real customer experience. The healing axis is genuinely category-specific; no dentist or SaaS page has a six-week pigment-resolution story.

The visual layer is not. Strip the words and you have white 12px-radius cards floating on warm beige and blush bands, a serif headline, a hamburger, a pink button — the default American med-spa / lash-studio convention. Before the tint the page refused that convention, and the refusal *was* the thesis ("a document, not a brochure"). Now it performs it. The criticism is correct, and the diagnosis is sharper than "just changing background colors": the tint did not fail to add meaning, it actively changed the category signal in the wrong direction, toward the template the brief exists to refuse.

Worse: `--field-cream: #ECDCC7` is a skin-tone section field, which DESIGN.md line 174 records as a **confirmed client rejection** carried from the Brow Map decision. That rejection was re-litigated by an hour of CSS rather than by a conversation.

The unused resource: this business's subject is pigment placed in skin that changes color over six weeks. That is a color narrative sitting completely idle while abstract tints get painted behind it.

**Deterministic scan.** `impeccable detect --json` over `src/pages/index.astro`, `src/layouts/Base.astro`, `src/components/` — exit 0, **1 advisory finding**: `design-system-color` at `src/components/ContactForm.astro:162`, `rgba(176, 34, 89, 0.14)` outside the DESIGN.md palette. Not a false positive so much as a symptom: the design review independently found DESIGN.md is now false in six places, and this is the one instance the mechanical scan can see.

Measured contrast sweep across 177 desktop / 172 mobile text-bearing elements: **zero WCAG failures**, but the margins collapsed. Everything on the blush ground sits at 4.70:1 against a 4.5 requirement — 0.20 of headroom. The detector also caught two things the design review missed: the **focus indicator on the hero Call button measures 2.89:1** (near-black outline on the pink fill, below the 3:1 minimum for focus indicators), and the **mobile call bar is 69px tall while the body reserves only 64px**, so the last 5px of content sits under it.

Where both agree independently: the hairline. `--border #D8BFB9` measures **1.25:1 on blush and 1.29:1 on cream**. The 1px line that does *all* the structural work in this system is effectively invisible on two of the three grounds.

**Visual overlays.** Not available for this run. Browser inspection was done with headless Chrome via puppeteer-core for screenshots and computed-style measurement; the `live-server` + `detect.js` injection overlay flow was not run, so there is no user-visible overlay tab. The fallback signal is the measured data above.

## Overall Impression

The writing and the information architecture on this page are genuinely good — better than the visual system currently serving them. The healing timeline is a real product insight rendered as a component, and the copy repeatedly does the hardest thing in this category: it names the fear before selling against it.

The color work is the problem, and not in the way it looks. It is a repaint. The entire change is two CSS rules; nothing else in the system moved with it. The header and call bar are still tuned for a white canvas and now composite as milky foreign strips over the tinted bands. The Eyes and Hair tags are still cold pastels on a warm page. The hairline that carries the whole structure went invisible. Color was added to the page without being given a job.

**The single biggest opportunity:** the pigment itself. Every color decision on this page is abstract — a brand pink, four semantic pastels, two tint bands — while the business's actual subject is a specific brown going into specific skin and resolving over six weeks. Put the real pigment values into the healing rail and the category tags and the page becomes unreusable by anyone else.

## What's Working

1. **The healing timeline.** It could not appear on any other business's website, and it targets the exact objection that kills the sale. It works because it converts a scary unknown into a *schedule* — six named moments, one idea each, each pre-labeled "this is normal." It is also the best-chunked block on the page: six sequential facts that do not feel like six.
2. **Copy discipline.** "Copied word for word from Yelp. Nothing here was written for this page." earns trust by naming what the skeptic already suspects. "So the result looks like you on a good day" is a better definition of *natural* than the word natural, which is the entire job of this page.
3. **The photograph-as-one-object system.** `saturate(0.88) contrast(1.02)` plus 4% multiply grain unifies phone snapshots from different lighting into one body of work — and the restraint is principled: the source comment says the grade stays mild because the pigment color is the proof and must not be misrepresented. For a business selling color accuracy, the technical choice and the trust argument are the same choice.

## Priority Issues

**[P0] Seven "PLACEHOLDER" strings render on the live home page, in the two blocks that carry personal trust.**
- **Why it matters:** Three review cards print "PLACEHOLDER. Replace with a real Yelp review…" in 1.6rem Newsreader quote type, directly under a lede promising "Copied word for word from Yelp." The About bio opens "PLACEHOLDER: Pomi's bio goes here." These are the only two places on the page asking the visitor to trust a *person* rather than a photograph. Showing scaffolding there converts the site's central claim into evidence nobody finished it.
- **Fix:** `Reviews.astro` already guards `shown.length > 0`; extend it to also hide when every review is a placeholder, same for `settings.bio` in `AboutPomi.astro` so the section degrades to photo + "More about Pomi." Then fail the production build if `/PLACEHOLDER/i` appears in rendered HTML.
- **Suggested command:** `/impeccable harden`

**[P1] The color change is a repaint, not a color system — and it reintroduces a recorded client rejection.**
- **Why it matters:** The whole change is `.method,.prices { background: var(--field-cream) }` and `.count,.reviews,.contact { background: var(--field-blush) }`. Nothing else moved. Header/call bar still `rgba(255,255,255,.85/.92)`, tuned for white. `--surface` still the photo placeholder. Eyes and Hair tags still cold. Hairline invisible at 1.25:1. And `#ECDCC7` is exactly the "skin-tone or brown colored section field" DESIGN.md:174 lists as confirmed-rejected.
- **Fix:** Delete both tint bands. Move color onto the product instead: (a) replace the 1px `--border` rail in `.axis::before` with a 3px vertical gradient running real pigment values — deep `#3B2A24` at Day 1, washed `#B79E92` at "Too light," resolved `#6E5449` at Week 4/6, each step dot filled at that moment's value; (b) rebuild the four category tags on pigment sampled from the healed photos (brow brown, lip rose, liner near-black, SMP charcoal) instead of abstract yellow/blue/red/green; (c) reserve `#B02259` for the Call control and the Week 6 resolution only — it is currently on five tel links, every `.link`, all eight arrows, the numeral, both button variants, *and* three section grounds. An accent that appears everywhere signals nothing.
- **Suggested command:** `/impeccable colorize`

**[P2] The strongest proof on the page was made its weakest object.**
- **Why it matters:** "200+" is 7rem Newsreader in `--pink-ink` on `--field-blush` — same hue family, 4.70:1, down from 6.52:1 on white. It reads decorative rather than emphatic, then is followed by ~250px of empty blush. PRODUCT.md marks the Yelp count as a first-class differentiator that must not be a footer item; it currently reads as a flourish in the color of its own background.
- **Fix:** Return `.count` to the plain ground, halve its vertical padding, merge it into `.reviews` as one proof block under one heading, and set the numeral's baseline flush to the cap-height of "Five-star reviews on Yelp." so they read as one object.
- **Suggested command:** `/impeccable layout`

**[P2] Nine near-identical choices at the money moment.**
- **Why it matters:** Eight service cards plus extras; six read exactly "$600 + $100 touch-up." On mobile the section is 2,677px — 3.2 viewport-heights. This is the decision point, she is anxious and one-handed and it is late, and the page hands her nine options with no recommended path and puts the only grouping signal (the category tag) at the *bottom* of each card. Answering "which is right for me?" requires holding three descriptions in working memory that all resolve to "natural."
- **Fix:** Chunk by the four categories the tags already name — promote the tag to a group heading (Brows / Eyes / Lips / Hair) so she scans 4, then 2–3, never 9. Lead the Brows group with the comparison she is actually making, made for her. State "every price includes the six-week touch-up" once per group.
- **Suggested command:** `/impeccable layout`

**[P3] Mobile tap targets below every platform minimum, plus a focus ring that fails on the primary button.**
- **Why it matters:** Measured at 390px: 39 of 48 interactive elements under 44x44. Footer service/Learn links 19px, footer phone 19px, service titles 26px, every `.link` 24px, menu toggle 40x40. 44px (iOS) / 48px (Android) exist for exactly this user — 30–60, phone, dim room, one thumb. Separately, the hero Call button's near-black focus outline against its pink fill measures 2.89:1, under the 3:1 focus-indicator minimum, and the call bar is 69px tall against 64px of reserved body padding.
- **Fix:** `min-height: 44px; display: flex; align-items: center` on `.link` and footer `li a`. Switch the focus outline to white (or add a white inner ring) on pink-filled controls. Set the call-bar reserve from the measured height.
- **Suggested command:** `/impeccable audit`

## Persona Red Flags

**Casey (distracted mobile user) — 11pm, one-handed, screen dimmed.**
- The page is **12,973px on a 390px viewport — 15.4 screens.** `.prices` alone is 2,677px.
- `BrowMapHero.astro` sets `.hero__call { display: none }` below 60rem, so **there is no Call button in the mobile hero.** The only in-flow action above the fold is "See the work →" at 24px tall. She must independently notice the pinned bar.
- The pinned bar is the page's best mobile decision — persistent, full-width, labeled with the real number — but at `rgba(255,255,255,.92)` over `.contact`'s blush it reads as a white panel pasted on a pink page.
- Footer stacks 24 targets at 19px with ~11px gaps.

**Jordan (anxious first-timer) — has seen a bad microblading result on someone she knows.**
- **No safety fact anywhere on this page.** The one FAQ that addresses it deflects to the phone call: "the questions to ask any artist are about needles, pigments, and hygiene. Ask Pomi at your consultation." It names the questions and defers the answers to the call it is asking her to make. At 2am that is where she closes the tab.
- **No before/after pair on the home page.** Every photograph is an after. PRODUCT.md lists before/after per service as a confirmed must-have. The one stacked pair is presented as a single framed image captioned "Mapped, then healed," neither half labeled.
- The three review cards she would read to calm herself say **PLACEHOLDER**.
- "Nothing is permanent until you agree with what you see in the mirror" is the best sentence on the page for her, and it is buried in body text ~1,400px down on mobile in muted grey.

**The returning client (yearly touch-up) — PRODUCT.md's named secondary user.**
- **No path exists for her.** Nav is The method / Work / Prices / Questions / Contact.
- Her $300 price is the *last* card in a 2,677px grid, behind eight cards written for someone who has never done this.
- The form's "Interested in" select puts "A touch-up on existing work" 9th of 10.
- DESIGN.md:208 documents a Bone-filled **"Existing clients"** tag as part of the system. It does not exist in the shipped `PricingTable.astro`.

## Minor Observations

- **Verified CSS bug:** `.section + .section { border-top: 1px }` (specificity 0,2,0) beats the `.method,.prices,… { border-top: 0 }` reset (0,1,0). Six sections still compute `border-top-width: 1px`. The comment above the rule — "the colour change is the separation" — never shipped.
- All four Instagram tiles point at the same URL, presented as four distinct items, no external-link indicator. Three of four captions read "Microblading / Healed" — a four-tile sample has exactly one job, show range.
- `--pale-blue #E1F3FE` and `--pale-green #EDF3EC` are cool-cast on an entirely warm page; on the cream band the Eyes and Hair tags look imported from another design system.
- **DESIGN.md is now false in six places**: the White Field Rule; "Don't give any section a tinted background"; "Don't put pink on a section background"; `--border` (documents `#EAEAEA`, ships `#D8BFB9`); `--ink-muted` (documents `#787774`, ships `#665B5D`); Pink Ink (documents `#C42A66`/`#A82255`, ships `#B02259`/`#8F1A49`). Anyone reading it to build the service pages will build a different site.
- `.count__heading` is an `<h2>` styled at `--fs-h3` in Geist while every other h2 is Newsreader — a hole in the h2 rhythm and a quiet break of the Two-Voice Rule.
- No `scroll-padding-top` against the 69px sticky header. It works today only because `.section` carries 6rem of top padding.
- Desktop hero leaves ~250px of empty ground above the h1 at 1440x900; the headline baseline sits at 40% of the viewport.
- `.contact` ends with ~400px of empty blush because the form column is shorter than the studio card and the grid does not rebalance.

## Questions to Consider

1. This business's entire subject is **color placed in skin that changes color over six weeks**. Why is the only color in the system a background tint and a button fill — and not the pigment itself?
2. DESIGN.md:174 records "no skin-tone or brown colored section fields" as a *confirmed client rejection*. `#ECDCC7` is a skin-tone section field. Was that reopened, or did an hour of CSS overwrite it — and if the record can be overwritten that quietly, what is the record for?
3. If you deleted every band of color right now, would anyone notice something was **missing** — or only that something had **stopped being there**? A color decision that survives deletion untraced was not a design decision. It was a coat of paint.
