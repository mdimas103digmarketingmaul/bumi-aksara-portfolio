import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Production is served from https://bumi-aksara-portfolio.pages.dev/humanies-exploration/
  // (see ../_redirects). Dev keeps "/" so localhost:5180 works as before.
  base: command === 'build' ? '/humanies-exploration/' : '/',
  server: { port: 5180 },
  // MapLibre alone is ~1 MB; fine for a local prototype.
  build: { chunkSizeWarningLimit: 1600 },
}));
