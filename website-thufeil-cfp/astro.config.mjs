// @ts-check
import { defineConfig } from 'astro/config';
import { site } from './src/config/site.ts';

export default defineConfig({
  // Used for canonical URLs and absolute Open Graph image URLs.
  // Set `siteUrl` in src/config/site.ts once the domain is known.
  site: site.siteUrl || undefined,
  output: 'static',
});
