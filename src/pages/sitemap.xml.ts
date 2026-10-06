import type { APIRoute } from 'astro';
import { places } from '../data/places';
import { trips } from '../data/trips';
import { resorts, skiRegions } from '../data/ski';
import { pursuits, pursuitById, spots } from '../data/outdoors';
import { url } from '../lib/paths';

// Every public page; account, wishlist and sign-in pages are left out (they're noindex).
export const GET: APIRoute = ({ site }) => {
  const paths = [
    '', 'explore/', 'trips/', 'credits/', 'ski/', 'ski/explore/', 'ski/holidays/',
    ...trips.map((t) => `trips/${t.slug}/`),
    ...places.map((p) => `places/${p.id}/`),
    ...skiRegions.map((r) => `ski/${r.id}/`),
    ...resorts.map((r) => `ski/resorts/${r.id}/`),
    ...pursuits.map((p) => `${p.slug}/`),
    ...spots.map((s) => `${pursuitById[s.pursuit].slug}/${s.id}/`),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${new URL(url(p), site)}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
