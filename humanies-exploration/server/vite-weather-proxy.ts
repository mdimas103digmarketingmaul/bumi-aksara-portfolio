import type { Plugin, Connect } from 'vite';
// @ts-expect-error Shared runtime JS is exercised by proxy tests and Wrangler, not browser TS.
import { createWeatherProxy, WEATHER_ROUTE } from './weather-proxy.mjs';

// @ts-expect-error Shared Pages runtime JavaScript.
import { createPetaBencanaProxy, PETABENCANA_ROUTE } from './petabencana-proxy.mjs';

export function weatherProxyPlugin(): Plugin {
  const weather = createWeatherProxy();
  const reports = createPetaBencanaProxy();
  const middleware: Connect.NextHandleFunction = async (req, res, next) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    const handle = url.pathname === PETABENCANA_ROUTE ? reports : url.pathname.startsWith(WEATHER_ROUTE) ? weather : null;
    if (!handle) return next();
    const response = await handle(new Request(url, { method: req.method, headers: req.headers.origin ? { Origin: req.headers.origin } : {} }));
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  };
  return {
    name: 'humanies-local-weather-function',
    configureServer(server) { server.middlewares.use(middleware); },
    configurePreviewServer(server) { server.middlewares.use(middleware); },
  };
}
