// schema.org JSON-LD for detail pages, so search engines read a place's type, location and events.
// Only confirmed event dates are published as Events: "usual date" guesses would be wrong data.
// Google ratings are deliberately left out (they're Google's, not first-party reviews).
import type { Place } from '../data/types';
import type { Resort, SkiEvent, SkiRegion } from '../data/ski/types';
import type { Spot } from '../data/outdoors/types';
import type { Pursuit } from '../data/outdoors/pursuits';

type Ld = Record<string, unknown>;

const geo = ([latitude, longitude]: [number, number]) => ({ '@type': 'GeoCoordinates', latitude, longitude });
const address = (town: string, region?: SkiRegion) => ({
  '@type': 'PostalAddress',
  addressLocality: town,
  ...(region && { addressRegion: region.short, addressCountry: region.country }),
});

export function eventsLd(events: SkiEvent[], where: { name: string; town: string; coords: [number, number]; region?: SkiRegion }): Ld[] {
  return events.filter((e) => e.confirmed).map((e) => ({
    '@type': 'Event',
    name: e.name,
    startDate: e.date,
    ...(e.end && { endDate: e.end }),
    description: e.what,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(e.url && { url: e.url }),
    location: { '@type': 'Place', name: where.name, address: address(where.town, where.region), geo: geo(where.coords) },
  }));
}

export function placeLd(p: Place, page: URL, image?: URL): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'Campground',
    name: p.name,
    description: p.summary,
    url: page.href,
    ...(image && { image: image.href }),
    address: { ...address(p.town), addressRegion: 'NY', addressCountry: 'US' },
    geo: geo(p.coords),
    sameAs: [p.booking.url],
  };
}

export function resortLd(r: Resort, region: SkiRegion, page: URL, image?: URL): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'SkiResort',
    name: r.name,
    description: r.summary,
    url: page.href,
    ...(image && { image: image.href }),
    address: address(r.town, region),
    geo: geo(r.coords),
    sameAs: [r.url],
    event: eventsLd(r.events, { name: r.name, town: r.town, coords: r.coords, region }),
  };
}

const SPOT_TYPE: Record<Spot['pursuit'], string> = {
  camp: 'Campground',
  bike: 'SportsActivityLocation',
  paddle: 'TouristAttraction',
  pickleball: 'SportsActivityLocation',
};

export function spotLd(s: Spot, p: Pursuit, region: SkiRegion, page: URL, image?: URL): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': SPOT_TYPE[s.pursuit],
    name: s.name,
    description: s.summary,
    url: page.href,
    ...(image && { image: image.href }),
    address: address(s.town, region),
    geo: geo(s.coords),
    sameAs: [s.url],
    keywords: [p.name, s.kind].join(', '),
    event: eventsLd(s.events, { name: s.name, town: s.town, coords: s.coords, region }),
  };
}

/** BreadcrumbList from [name, absolute URL] pairs, outermost first. */
export function breadcrumbLd(items: [name: string, url: URL][]): Ld {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, u], i) => ({ '@type': 'ListItem', position: i + 1, name, item: u.href })),
  };
}
