// The previous site's pages: [our slug, live path]. Shared by every live-site script so the
// output files under .impeccable/live-content/ line up by name.
//
// The two `%3F` paths are real: GoDaddy kept a literal "?" in those slugs.
export const BASE = "https://pomibrow.com";

export const PAGES = [
  ["home", "/home"],
  ["about-pomi", "/about-pomi"],
  ["faqs", "/faqs"],
  ["safety", "/safety"],
  ["aftercare", "/aftercare"],
  ["contact-form", "/contact-form"],
  ["microblading", "/microblading"],
  ["microblading-shading", "/microblading-shading"],
  ["ombre-powder-brows", "/ombre-powder-brows"],
  ["eyeliner", "/eyeliner"],
  ["lash-enhancement", "/lash-enhancement"],
  ["lip-tint", "/lip-tint"],
  ["scalp-micropigmentation", "/scalp-micropigmentation"],
  ["good-pmu-candidates", "/good-pmu-candidates"],
  ["how-long-it-lasts", "/how-long-it-lasts"],
  ["pmu-healing-timeline", "/pmu-healing-timeline"],
  ["prepare-for-appointment", "/prepare-for-appointment"],
  ["lip-tint-vs-lip-blush", "/lip-tint-vs-lip-blush"],
  ["importance-of-touch-up", "/importance-of-touch-up"],
  ["are-powder-brows-for-me", "/are-powder-brows-for-me%3F-1"],
  ["is-permanent-makeup-safe", "/is-permanent-makeup-safe%3F"],
  ["eyeliner-vs-lash-enhancement", "/eyeliner-lash-enhancement"],
  ["learn-scalp-micropigmentation", "/scalp-micropigmentation-1"],
];

/** Chrome or Edge on this machine, for the puppeteer-core scripts. */
export const BROWSER_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];
