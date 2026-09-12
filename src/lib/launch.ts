/**
 * The home-only launch gate.
 *
 * While the inner pages are still being built, the deployed site is the home page alone:
 * every other route redirects to "/", and every link on the home page that would leave it
 * is switched off (the anchor stays in the markup, without its href). Nothing about the
 * pages themselves changes, so lifting the gate is a one-line change here.
 *
 * Off unless HOME_ONLY=true (or 1) is set in the build environment. It was on for the first
 * launch and is kept so the home-only state is one variable away; see docs/home-only-launch.md.
 * Applied by src/middleware.ts.
 */

export function homeOnlyFromEnv(env: Record<string, string | undefined> = process.env): boolean {
  const flag = env.HOME_ONLY?.trim().toLowerCase();
  return flag === "true" || flag === "1";
}

export const HOME_ONLY = homeOnlyFromEnv();

/** A link that leads off the home page: site-relative, not the home page or one of its anchors. */
export function leavesHome(href: string): boolean {
  if (!href.startsWith("/")) return false;
  if (href === "/" || href.startsWith("/#") || href.startsWith("/?")) return false;
  return true;
}

/**
 * Strips the href from every anchor in `html` that leaves the home page, marking it
 * aria-disabled so the label stays readable but nothing to follow remains.
 */
export function disableInternalLinks(html: string): string {
  return html.replace(/<a\b([^>]*)>/gi, (tag, attrs: string) => {
    const m = attrs.match(/\shref=(?:"([^"]*)"|'([^']*)')/i);
    const href = m?.[1] ?? m?.[2];
    if (href === undefined || !leavesHome(href)) return tag;
    const rest = attrs.replace(m![0], "");
    return `<a${rest} aria-disabled="true">`;
  });
}
