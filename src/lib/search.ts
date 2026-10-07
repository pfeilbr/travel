// Site search matching, shared by the build (tests) and the browser. The index itself is built in search-index.ts.

export interface Doc {
  /** Type label shown on the result: "Campground", "Ski resort", "Mountain biking"… */
  t: string;
  /** Name. */
  n: string;
  /** Subtitle: town, area and state/province. */
  s: string;
  /** Path under the site base, e.g. "ski/resorts/okemo/". */
  u: string;
  /** Extra searchable words (kind, tagline, region). */
  k: string;
}

/** Lowercase, strip accents and punctuation, so "Mont-Tremblant" matches "mont tremblant". */
export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Every query word must appear; name matches rank above subtitle and keyword matches. */
export function search(index: Doc[], q: string, limit = 60): Doc[] {
  const words = norm(q).split(' ').filter(Boolean);
  if (!words.length) return [];
  const scored: { d: Doc; score: number }[] = [];
  for (const d of index) {
    const name = norm(d.n), sub = norm(`${d.s} ${d.t}`), all = `${name} ${sub} ${norm(d.k)}`;
    if (!words.every((w) => all.includes(w))) continue;
    let score = 0;
    for (const w of words) score += name.startsWith(w) ? 6 : (` ${name}`).includes(` ${w}`) ? 4 : name.includes(w) ? 3 : sub.includes(w) ? 2 : 1;
    scored.push({ d, score });
  }
  return scored.sort((a, b) => b.score - a.score || a.d.n.localeCompare(b.d.n)).slice(0, limit).map((x) => x.d);
}
