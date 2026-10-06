import type { APIRoute } from 'astro';
import { resorts, skiRegionById } from '../../data/ski';
import { calendar } from '../../lib/ics';
import { url } from '../../lib/paths';

// Subscribable calendar of 2026-27 ski events whose dates the resorts have confirmed.
// "Usual date" events are left out until they're confirmed, so a calendar never shows a guess.
export const GET: APIRoute = ({ site }) => {
  const events = resorts.flatMap((r) => r.events.filter((e) => e.confirmed).map((e) => ({
    uid: `${r.id}-${e.date}-${e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}@waypoint`,
    start: e.date,
    end: e.end,
    summary: `${e.name} · ${r.name}`,
    description: `${e.when}. ${e.what}\n\n${new URL(url(`ski/resorts/${r.id}/`), site)}`,
    location: `${r.name}, ${r.town}, ${skiRegionById[r.region].short}`,
    url: e.url,
  }))).sort((a, b) => a.start.localeCompare(b.start));
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  return new Response(calendar('Waypoint ski events 2026–27', events, stamp), { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
