import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { weatherProxyPlugin } from './server/vite-weather-proxy.ts';

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react(), weatherProxyPlugin()],
  // Production is served from https://bumi-aksara-portfolio.pages.dev/humanies-exploration/
  // (see ../_redirects). Dev keeps "/" so localhost:5180 works as before.
  base: command === 'build' || isPreview ? '/humanies-exploration/' : '/',
  server: { port: 5180 },
  // MapLibre alone is ~1 MB; fine for a local prototype.
  build: { chunkSizeWarningLimit: 1600 },
}));
