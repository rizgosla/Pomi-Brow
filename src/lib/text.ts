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

/**
 * A title's words in three kinds: hyphenated words to keep whole ("touch-up"), words so long
 * they can overflow a phone column ("micropigmentation": 13 letters or more), which may
 * hyphenate, and the plain text between. Only the long words hyphenate, so no other word in
 * the title ever breaks.
 */
export function titleParts(text: string): { text: string; kind: "plain" | "keep" | "long" }[] {
  const parts: { text: string; kind: "plain" | "keep" | "long" }[] = [];
  for (const p of keepHyphenated(text)) {
    if (p.keep) {
      parts.push({ text: p.text, kind: "keep" });
      continue;
    }
    let last = 0;
    for (const m of p.text.matchAll(/[A-Za-z]{13,}/g)) {
      if (m.index! > last) parts.push({ text: p.text.slice(last, m.index), kind: "plain" });
      parts.push({ text: m[0], kind: "long" });
      last = m.index! + m[0].length;
    }
    if (last < p.text.length) parts.push({ text: p.text.slice(last), kind: "plain" });
  }
  return parts;
}

