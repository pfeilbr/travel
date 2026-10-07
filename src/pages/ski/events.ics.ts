import type { APIRoute } from 'astro';
import { resorts } from '../../data/ski';
import { feedResponse } from '../../lib/calendar-feed';

// Subscribable calendar of 2026-27 ski events whose dates the resorts have confirmed.
export const GET: APIRoute = ({ site }) =>
  feedResponse('Waypoint ski events 2026–27', resorts.map((r) => ({ ...r, path: `ski/resorts/${r.id}/` })), site!);
