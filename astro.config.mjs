import { defineConfig } from 'astro/config';

// Served from GitHub Pages at https://pfeilbr.github.io/travel/
export default defineConfig({
  site: 'https://pfeilbr.github.io',
  base: '/travel',
  trailingSlash: 'always',
});
