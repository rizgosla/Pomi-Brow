// The home-only launch gate. Runs under `node --test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { homeOnlyFromEnv, leavesHome, disableInternalLinks } from "../src/lib/launch.ts";

test("homeOnlyFromEnv is on in Cloudflare Pages builds and off elsewhere, with HOME_ONLY overriding both", () => {
  assert.equal(homeOnlyFromEnv({}), false);
  assert.equal(homeOnlyFromEnv({ CF_PAGES: "1" }), true);
  assert.equal(homeOnlyFromEnv({ CF_PAGES: "1", HOME_ONLY: "false" }), false);
  assert.equal(homeOnlyFromEnv({ HOME_ONLY: "true" }), true);
  assert.equal(homeOnlyFromEnv({ HOME_ONLY: "1" }), true);
});

test("leavesHome keeps the home page, its anchors, external, tel and fragment links", () => {
  for (const keep of ["/", "/#services", "/#contact", "#work", "#main", "tel:+19494277664", "https://www.instagram.com/x/", "mailto:a@b.c"]) {
    assert.equal(leavesHome(keep), false, keep);
  }
  for (const off of ["/about", "/learn", "/learn/how-long-it-lasts", "/services/microblading", "/aftercare", "/safety#brows"]) {
    assert.equal(leavesHome(off), true, off);
  }
});

test("disableInternalLinks strips only the hrefs that leave the home page and keeps every other attribute", () => {
  const html = [
    '<a class="link" href="/about" data-nav-link>About Pomi</a>',
    '<a href="/#contact" class="btn">Contact</a>',
    "<a href='/learn/pmu-healing-timeline'>Guide</a>",
    '<a href="tel:+19494277664">Call</a>',
    '<a href="https://www.yelp.com/x" rel="noopener">Yelp</a>',
    '<a class="skip" href="#main">Skip</a>',
    '<a href="/">Home</a>',
  ].join("\n");
  const out = disableInternalLinks(html);
  assert.equal(
    out,
    [
      '<a class="link" data-nav-link aria-disabled="true">About Pomi</a>',
      '<a href="/#contact" class="btn">Contact</a>',
      '<a aria-disabled="true">Guide</a>',
      '<a href="tel:+19494277664">Call</a>',
      '<a href="https://www.yelp.com/x" rel="noopener">Yelp</a>',
      '<a class="skip" href="#main">Skip</a>',
      '<a href="/">Home</a>',
    ].join("\n"),
  );
  assert.doesNotMatch(out, /href="\/(about|learn)/);
});
