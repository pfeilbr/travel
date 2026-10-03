import type { PursuitId, Spot } from './types';
import { skiRegions } from '../ski/regions';
import type { SkiRegionId } from '../ski/types';

export { pursuits, pursuitById, pursuitBySlug } from './pursuits';

// One file per research batch in ./spots; the glob tolerates files being added or removed.
const modules = import.meta.glob<{ default: Spot[] }>('./spots/*.ts', { eager: true });

const regionOrder = new Map(skiRegions.map((r, i) => [r.id, i]));
const sizeOrder = { major: 0, mid: 1, local: 2 } as const;

/** All spots, by region (regions.ts order), then size, then rating. */
export const spots: Spot[] = Object.values(modules)
  .flatMap((m) => m.default)
  .sort((a, b) =>
    regionOrder.get(a.region)! - regionOrder.get(b.region)!
    || sizeOrder[a.size] - sizeOrder[b.size]
    || (b.google?.rating ?? 0) - (a.google?.rating ?? 0)
    || a.name.localeCompare(b.name));

export const spotById = Object.fromEntries(spots.map((s) => [s.id, s])) as Record<string, Spot>;

export const spotsFor = (p: PursuitId) => spots.filter((s) => s.pursuit === p);
export const spotsIn = (p: PursuitId, region: SkiRegionId) => spots.filter((s) => s.pursuit === p && s.region === region);
