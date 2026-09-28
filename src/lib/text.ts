/**
 * Small text helpers for rendering authored copy.
 *
 * keepHyphenated splits a line so hyphenated words ("touch-ups", "two-step", "single-use") can
 * be wrapped in a no-break span. Headings use `text-wrap: balance`, and in a narrow column a
 * balanced heading otherwise breaks at the hyphen ("Why touch- / ups matter.").
 */
export function keepHyphenated(text: string): { text: string; keep: boolean }[] {
  const parts: { text: string; keep: boolean }[] = [];
  const re = /\S*\w-\w\S*/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) parts.push({ text: text.slice(last, m.index), keep: false });
    parts.push({ text: m[0], keep: true });
    last = m.index! + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), keep: false });
  return parts;
}
