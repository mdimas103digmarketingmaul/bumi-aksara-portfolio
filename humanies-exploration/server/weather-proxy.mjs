import { readLimitedBody } from './http-body.mjs';
/** Same handler for Pages Functions and local Vite. No user-supplied upstream URLs. */
export const WEATHER_ROUTE = '/humanies-exploration/api/weather';
const UPSTREAM = 'https://www.bmkg.go.id/alerts/nowcast/id';
const MAX_BYTES = 2_000_000;
const RSS_TTL = 60;
const CAP_TTL = 300;
const ERROR_TTL = 20;

class ProxyError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
const headers = {
  'Content-Type': 'application/xml; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; sandbox",
};
function failure(status, message) {
  return new Response(JSON.stringify({ error: message }), {
    status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...(status === 503 ? { 'Retry-After': '60' } : {}) },
  });
}

/** Injectable dependencies support deterministic security/cache tests without BMKG traffic. */
export function createWeatherProxy({ fetcher = fetch, getCache = () => globalThis.caches?.default, now = Date.now, timeoutMs = 12_000 } = {}) {
  const pending = new Map();
  const memory = new Map();
  let requestTimes = [];

  async function load(suffix, origin) {
    const key = origin + WEATHER_ROUTE + suffix;
    const known = memory.get(key);
    if (known && known.until > now()) return { ...known.value, hit: true };
    const cache = getCache();
    const stored = await cache?.match(new Request(key)).catch(() => null);
    if (stored) {
      const fetchedAt = stored.headers.get('X-BMKG-Fetched-At');
      const ttl = suffix ? CAP_TTL : RSS_TTL;
      if (fetchedAt && now() - Date.parse(fetchedAt) < ttl * 1000) {
        const value = { text: await stored.text(), fetchedAt, status: 200 };
        memory.set(key, { until: Date.parse(fetchedAt) + ttl * 1000, value });
        return { ...value, hit: true };
      }
    }
    if (pending.has(key)) return pending.get(key);
    const work = (async () => {
      requestTimes = requestTimes.filter(t => now() - t < 60_000);
      if (requestTimes.length >= 45) throw new ProxyError(503, 'BMKG request budget reached; retry later');
      requestTimes.push(now());
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetcher(UPSTREAM + suffix, {
          signal: controller.signal, redirect: 'manual',
          headers: { Accept: 'application/xml, text/xml' },
        });
        if (!response.ok) throw new ProxyError(response.status === 429 ? 503 : 502, 'BMKG upstream temporarily unavailable');
        const contentType = response.headers.get('Content-Type') ?? '';
        if (!/\b(?:application|text)\/(?:[^;]+\+)?xml\b/i.test(contentType)) throw new ProxyError(502, 'BMKG did not return XML');
        const text = await readLimitedBody(response, MAX_BYTES);
        if (/<!DOCTYPE|<!ENTITY/i.test(text) || !(suffix ? /<alert\b/.test(text) && text.includes('urn:oasis:names:tc:emergency:cap:1.2') : /<rss\b/.test(text))) throw new ProxyError(502, 'Unexpected BMKG document');
        const fetchedAt = new Date(now()).toISOString();
        const ttl = suffix ? CAP_TTL : RSS_TTL;
        const value = { text, fetchedAt, status: 200 };
        if (memory.size >= 64) memory.delete(memory.keys().next().value);
        memory.set(key, { until: now() + ttl * 1000, value });
        // Cache failures must not turn a valid upstream response into an outage.
        await cache?.put(new Request(key), new Response(text, { headers: { ...headers, 'Cache-Control': `public, max-age=${ttl}`, 'X-BMKG-Fetched-At': fetchedAt } })).catch(() => {});
        return { ...value, hit: false };
      } catch (error) {
        const value = { status: error instanceof ProxyError ? error.status : controller.signal.aborted ? 504 : 502, message: error instanceof ProxyError ? error.message : 'BMKG upstream unavailable or timed out' };
        memory.set(key, { until: now() + ERROR_TTL * 1000, value });
        return value;
      } finally { clearTimeout(timer); }
    })();
    pending.set(key, work);
    try { return await work; } finally { pending.delete(key); }
  }

  return async function handle(request) {
    const url = new URL(request.url);
    if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET', 'Cache-Control': 'no-store' } });
    if (url.search) return failure(400, 'Query parameters are not supported');
    if (request.headers.get('Origin') && request.headers.get('Origin') !== url.origin) return failure(403, 'Same-origin access only');
    const suffix = url.pathname.slice(WEATHER_ROUTE.length);
    if (!url.pathname.startsWith(WEATHER_ROUTE) || !/^(?:\/[A-Za-z0-9_-]{1,80}_alert\.xml)?$/.test(suffix)) return failure(404, 'Unknown weather endpoint');
    try {
      const rss = await load('', url.origin);
      if (rss.status !== 200) return failure(rss.status, rss.message);
      if (suffix) {
        // CAP requests must also be present in the current RSS, not merely match a filename.
        const links = [...rss.text.matchAll(/<link>\s*(?:<!\[CDATA\[)?(https:\/\/www\.bmkg\.go\.id\/alerts\/nowcast\/id\/[A-Za-z0-9_-]{1,80}_alert\.xml)(?:\]\]>)?\s*<\/link>/g)].map(m => m[1]);
        if (!links.includes(UPSTREAM + suffix)) return failure(404, 'CAP is not listed in the current BMKG feed');
      }
      const result = suffix ? await load(suffix, url.origin) : rss;
      if (result.status !== 200) return failure(result.status, result.message);
      return new Response(result.text, { headers: {
        ...headers, 'Cache-Control': 'no-store',
        'X-BMKG-Fetched-At': result.fetchedAt,
        'X-Humanies-Cache': result.hit ? 'HIT' : 'MISS',
      } });
    } catch (error) { return failure(error instanceof ProxyError ? error.status : 502, error instanceof ProxyError ? error.message : 'Weather service temporarily unavailable'); }
  };
}

const handle = createWeatherProxy();
export const onRequest = ({ request }) => handle(request);
