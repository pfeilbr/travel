import type { APIRoute } from 'astro';
import { pursuits, spotsFor } from '../../data/outdoors';
import type { Pursuit } from '../../data/outdoors/pursuits';
import { feedResponse } from '../../lib/calendar-feed';

// One calendar per activity (/bike/events.ics, /kayak/events.ics…) with its spots' confirmed event dates.
export function getStaticPaths() {
  return pursuits.map((pursuit) => ({ params: { pursuit: pursuit.slug }, props: { pursuit } }));
}

export const GET: APIRoute = ({ props, site }) => {
  const p = (props as { pursuit: Pursuit }).pursuit;
  return feedResponse(`Waypoint ${p.name.toLowerCase()} events`, spotsFor(p.id).map((s) => ({ ...s, path: `${p.slug}/${s.id}/` })), site!);
};
