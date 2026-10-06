import type { APIRoute } from 'astro';
import { url } from '../lib/paths';

// Served at /travel/robots.txt. Crawlers only read robots.txt at the host root, which this
// project site doesn't own, so this mainly advertises the sitemap to tools that look here.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL(url('sitemap.xml'), site)}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });
