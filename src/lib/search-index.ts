// Build-time index of places, ski resorts and outdoor spots for the search page (kept out of the client bundle).
import { places } from '../data/places';
import { resorts, skiRegionById } from '../data/ski';
import { pursuitById, spots } from '../data/outdoors';
import { trips } from '../data/trips';
import { dateRange } from './format';
import type { Doc } from './search';

export function buildIndex(): Doc[] {
  return [
    ...trips.map((t) => ({ t: 'Live check', n: t.title, s: `${dateRange(t.start, t.end)} · from ${t.origin.name}`, u: `trips/${t.slug}/`, k: `${t.blurb} trip availability` })),
    ...places.map((p) => ({ t: p.kind, n: p.name, s: `${p.town} · ${p.region}`, u: `places/${p.id}/`, k: `${p.tagline} ${p.lodging.join(' ')} ${p.activities.join(' ')} new york camping` })),
    ...resorts.map((r) => {
      const g = skiRegionById[r.region];
      return { t: 'Ski resort', n: r.name, s: `${r.town} · ${r.area} · ${g.short}`, u: `ski/resorts/${r.id}/`, k: `${r.tagline} ${g.name} ${r.passes.join(' ')} ski` };
    }),
    ...spots.map((x) => {
      const p = pursuitById[x.pursuit];
      const g = skiRegionById[x.region];
      return { t: p.name, n: x.name, s: `${x.town} · ${x.area} · ${g.short}`, u: `${p.slug}/${x.id}/`, k: `${x.kind} ${x.tagline} ${g.name} ${p.short}` };
    }),
  ];
}
