---
target: home page
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Users\\rizgo\\Documents\\GITHUB_REPOS\\PomiBrow\\src\\pages\\index.astro"
target_fingerprint: "sha256:256be7bc0bb85ee05592e59bbff3aa815329ef061c526cb81d58310f8733feef"
target_path: "C:\\Users\\rizgo\\Documents\\GITHUB_REPOS\\PomiBrow\\src\\pages\\index.astro"
timestamp: 2026-09-08T00-09-32Z
slug: src-pages-index-astro
closed: true
---
Method: dual-agent (A: design review · B: detector and browser evidence). Browser evidence ran in headless Chrome; no overlay visible in the user's tab.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Form states exist; "Sent" pill gives no further cue, no active-section marker in nav |
| 2 | Match System / Real World | 3 | HEAD / ARCH / TAIL unexplained in the hero until the method section; "Book by phone" is not a phrase people use |
| 3 | User Control and Freedom | 3 | No modals, Escape closes nav; "See the work" jumps past five sections with no way back |
| 4 | Consistency and Standards | 2 | Two controls for one tel: action in header and call bar; caption spec full in hero, empty on Instagram tiles |
| 5 | Error Prevention | 3 | Good inputs and honeypot; submit pill sits under the fixed call bar at the natural scroll stop |
| 6 | Recognition Rather Than Recall | 3 | "$600 + $100 TOUCH-UP" must be decoded before the table explains the two-visit model |
| 7 | Flexibility and Efficiency | n/a | Persuade surface with one path (call) |
| 8 | Aesthetic and Minimalist Design | 3 | Restraint diluted by a 10-row price table before reassurance and 22 footer links |
| 9 | Error Recovery | 3 | Human error copy, focus to first bad field; status line can render under the call bar |
| 10 | Help and Documentation | n/a | FAQ and Learn are product content, not page help |
| **Total** | | **23/32** | **Good (72%)** |

## Design Specificity Verdict

LLM assessment: authored for this product. Hero geometry hand-fitted to a real healed brow; healing axis is the real PMU heal curve; 200 numeral on a ruler; copy names Tustin/Irvine and "Pomi answers herself." Slides toward scaffolding in the Instagram grid (six tiles, one URL, every tile HEALED), the four-column footer, and the Book/Call duplication. On mobile the HEAD mark is cropped and a 12px price caption precedes the headline.

Deterministic scan: CLI 3 advisory font-size findings (AboutPomi.astro:66 genuine minor; BrowMapHero.astro:236 and :244 are SVG viewBox units, false positives). Browser detector: 6 desktop / 5 mobile. Genuine: price-table footnote ~227 chars/line at 1440 (PricingTable.astro, no max-width). False positives: tight-leading on review quotes (documented quote token 1.2), cramped-padding on the Yelp pill (min-height centring), dark-glow (detector's own overlay). Deliberate: repeating-gradient ruler under the review count.

## Priority Issues

1. [P1] Mobile hero crops the head mark and puts the price caption before the headline. Fix in src/components/BrowMapHero.astro: align the phone crop toward the brow head (matching preserveAspectRatio and object-position), move .hero__caption after h1 and lede on phones, drop the price from the phone caption. Command: layout.
2. [P1] IA sells before it reassures: prices second, method third, safety collapsed near the bottom. Fix in src/pages/index.astro: reorder to hero, HealingAxis, InstagramGrid, ReviewCount, Reviews, PricingTable, Faq, ContactForm; retarget #work; reorder Header.astro nav; make "Is permanent makeup safe?" the open FAQ item. Command: layout.
3. [P1] Two controls, one action: header phone link + "Book by phone" pill and call bar Call + Book all resolve to the same tel:. Fix in CallBar.astro and Header.astro: one full-width Call control when bookingHref is tel:; restore two buttons only with a real booking URL. Command: distill.
4. [P2] Fixed call bar covers the form submit pill and status line on mobile. Fix in ContactForm.astro (status above actions, scroll-margin-bottom on the pill) and CallBar.astro (scroll-padding-bottom on html; slide bar out while a field has focus). Command: harden.
5. [P2] Content-bearing text at label size; ink-faint 4.12:1 on white; price footnote unbounded width. Fix in tokens.css (phone caption size ~0.8125rem, --ink-faint ~#7a6a60), apply in Caption.astro, BrowMapHero.astro .hero__caption, ContactForm.astro .form__label; max-width on .prices__foot. Command: typeset.

## Persona Red Flags

Jordan: HEAD/ARCH/TAIL unexplained; "Services" nav lands on prices; Call vs Book by phone indistinguishable; select names "Removal or correction" first.
Riley: error line can sit under the bar; "See the work" 7,500px down; all IG tiles one URL; HEALED caption on a ruler photo and a before/after composite; Yelp link is a search URL; mobile nav renders the Instagram handle in the display face and wraps the address into five lines.
Casey: submit lands under the call bar; lede below the fold on the first screen; row links unsignalled.
Dana (45, 11pm, afraid of looking tattooed): price before method; safety answer defers to consultation; no artist in "One artist"; all photos on skin in its 20s; "Book by phone" at 11pm not actionable; "usually the same day" only after submit.

## Minor Observations

- ~190px unruled gap between the review ruler and the prices heading.
- Method figure and IG tiles carry captions without time or price.
- Real 60–120 word reviews will run 12+ lines of hairline serif on brown; plan a cap.
- Footer links to /faq, /safety, /aftercare while the header links to anchors.
- Hero head tick could move inward; top line runs off the frame corner on desktop.
- Skip link, section labelling, hidden numeral text, reduced-motion handling all correct.

## Questions to Consider

- Why ship a Book control while booking is undecided? Would one honest Call button convert better than two identical ones?
- What would it cost to put method and safety above the price table?
- Who is the photography for? Could a mature-skin powder-brow case be the hero?
