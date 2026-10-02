import type { Resort, SkiRegionId } from './types';
import { skiRegions } from './regions';

export { skiRegions, skiRegionById, skiGroups } from './regions';

// One file per research batch in ./resorts; the glob tolerates files being added or removed.
const modules = import.meta.glob<{ default: Resort[] }>('./resorts/*.ts', { eager: true });

const regionOrder = new Map(skiRegions.map((r, i) => [r.id, i]));
const sizeOrder = { major: 0, mid: 1, local: 2 } as const;

/** All resorts, by region (regions.ts order), then size, then vertical. */
export const resorts: Resort[] = Object.values(modules)
  .flatMap((m) => m.default)
  .sort((a, b) =>
    regionOrder.get(a.region)! - regionOrder.get(b.region)!
    || sizeOrder[a.size] - sizeOrder[b.size]
    || b.stats.verticalFt - a.stats.verticalFt);

export const resortById = Object.fromEntries(resorts.map((r) => [r.id, r])) as Record<string, Resort>;

export const resortsIn = (region: SkiRegionId) => resorts.filter((r) => r.region === region);
