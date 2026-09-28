# The home-only launch gate

A switch that makes the deployed site the home page alone. It was used for the first launch
on 2026-09-11 and is now off; it stays in the code so it can be turned back on with one
variable.

## What it does

With the gate on:

- Every route other than `/` (and `/admin`) is built as a redirect page to `/`, marked
  `noindex`. The old GoDaddy URLs in `public/_redirects` still resolve; they now land on the
  home page too.
- Every link on the home page that would leave it loses its `href`. Header and footer labels
  and the service names in the pricing table stay as plain text. Inline "read more" prompts
  (About Pomi, the guides, the FAQ links) are hidden, since a prompt with nowhere to go is
  worse than none.
- The sitemap lists the home page only.
- Phone, Instagram, Yelp, Google Maps and the on-page anchors (`/#services`, `/#contact`) keep
  working.

## Where it lives

- `src/lib/launch.ts`: the flag and the link rewriter, unit-tested in `tests/launch.test.ts`.
- `src/middleware.ts`: applies both at build time.
- `src/styles/global.css`: the `aria-disabled` link styles.
- `astro.config.mjs`: the sitemap filter.

## When it is on

Only when `HOME_ONLY=true` is set in the build environment. To turn it on in Cloudflare, add a
build variable `HOME_ONLY` with the value `true` in the Worker's settings and redeploy; remove
the variable to turn it off. To check the gated site locally:

```
HOME_ONLY=true npm run build && npm run preview
```

The Cloudflare build log prints `[launch] home-only gate is on` when it applies.

## Deploying

The site deploys as a Cloudflare Worker with static assets, configured in `wrangler.jsonc`.
In the Worker's build settings: build command `npm run build`, deploy command
`npx wrangler deploy`, no output directory. Without `wrangler.jsonc` Wrangler would
"auto-configure" the project on deploy, install the Astro Cloudflare adapter, rebuild into
`dist/client` and fail the link check.

## Removing it for good

Delete `src/middleware.ts`, `src/lib/launch.ts`, `tests/launch.test.ts`, the two
`aria-disabled` CSS rules in `global.css` and `PricingTable.astro`, and the sitemap filter in
`astro.config.mjs`. Nothing else references them.
