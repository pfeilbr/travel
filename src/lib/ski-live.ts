// Browser-only: live snowfall from Open-Meteo, cached for the session so page hops don't refetch.
import { batchSnowUrl, snowTotals } from './ski';

export interface SnowTotal { past: number; next: number }
type Point = { id: string; lat: number; lng: number; elevationFt: number };
type Daily = { time: string[]; snowfall_sum: (number | null)[] };

const KEY = 'ski-snow-v1';
const TTL = 30 * 60 * 1000;
const CHUNK = 50;

function readCache(): Record<string, SnowTotal> {
  try {
    const c = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    return c && Date.now() - c.t < TTL ? c.v : {};
  } catch { return {}; }
}

function writeCache(v: Record<string, SnowTotal>) {
  try { sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), v })); } catch {}
}

/** Past-7-day and next-7-day snowfall (inches) per point. Resolves with whatever loaded; never throws. */
export async function loadSnow(points: Point[]): Promise<Map<string, SnowTotal>> {
  const cache = readCache();
  const missing = points.filter((p) => !cache[p.id]);
  for (let i = 0; i < missing.length; i += CHUNK) {
    const chunk = missing.slice(i, i + CHUNK);
    try {
      const res = await fetch(batchSnowUrl(chunk));
      if (!res.ok) break;
      const body = await res.json();
      const list: { daily: Daily }[] = Array.isArray(body) ? body : [body];
      list.forEach((item, j) => {
        // past_days=7: index 7 is "today" in the resort's own time zone.
        if (item?.daily?.time?.length > 7) cache[chunk[j].id] = snowTotals(item.daily, item.daily.time[7]);
      });
    } catch { break; }
  }
  writeCache(cache);
  return new Map(points.filter((p) => cache[p.id]).map((p) => [p.id, cache[p.id]]));
}
