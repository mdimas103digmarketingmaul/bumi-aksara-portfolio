// @ts-check
import { defineConfig } from 'astro/config';
import { site } from './src/config/site.ts';

export default defineConfig({
  // Set `siteUrl` in src/config/site.ts once the domain is known.
  site: site.siteUrl || undefined,
  output: 'static',
  server: { port: 4322 },
});
