import type { RoadTrip } from './types';
import routesJson from './routes.json';

export interface PlanRoute {
  /** [name, lat, lng] waypoints the route was drawn through. */
  stops: [string, number, number][];
  line: [number, number][];
  legs: { from: string; to: string; miles: number; minutes: number }[];
}

const modules = import.meta.glob<{ default: RoadTrip }>('./trips/*.ts', { eager: true });
export const roadtrips: RoadTrip[] = Object.values(modules).map((m) => m.default).sort((a, b) => b.start.localeCompare(a.start));

const routes = routesJson as unknown as Record<string, Record<string, PlanRoute>>;
export function routesFor(slug: string): Record<string, PlanRoute> {
  return routes[slug] ?? {};
}
