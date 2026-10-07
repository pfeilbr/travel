// Builds the subscribable .ics feeds (ski and each outdoor activity) from venues and their events.
// Only confirmed dates go in: a calendar should never show a "usual date" guess.
import type { SkiEvent, SkiRegionId } from '../data/ski/types';
import { skiRegionById } from '../data/ski/regions';
import { calendar, type CalEvent } from './ics';
import { url } from './paths';

export interface Venue { id: string; name: string; town: string; region: SkiRegionId; path: string; events: SkiEvent[] }

export function feedEvents(venues: Venue[], site: URL): CalEvent[] {
  return venues.flatMap((v) => v.events.filter((e) => e.confirmed).map((e) => ({
    uid: `${v.id}-${e.date}-${e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}@waypoint`,
    start: e.date,
    end: e.end,
    summary: `${e.name} · ${v.name}`,
    description: `${e.when}. ${e.what}\n\n${new URL(url(v.path), site)}`,
    location: `${v.name}, ${v.town}, ${skiRegionById[v.region].short}`,
    url: e.url,
  }))).sort((a, b) => a.start.localeCompare(b.start));
}

export function feedResponse(name: string, venues: Venue[], site: URL): Response {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  return new Response(calendar(name, feedEvents(venues, site), stamp), { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
}
