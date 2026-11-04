import { readLimitedBody } from './http-body.mjs';
export const PETABENCANA_ROUTE = '/humanies-exploration/api/petabencana';
export const PETABENCANA_UPSTREAM = 'https://api.petabencana.id/reports?geoformat=geojson&timeperiod=604800';
const TTL = 300;
const USER_AGENT = 'HumaniesDisasterWatch/0.1 (+https://bumi-aksara-portfolio.pages.dev/humanies-exploration/; prototype)';
const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const failure = (status) => new Response(JSON.stringify({ error: 'Informasi PetaBencana sementara tidak dapat diperbarui.' }), { status, headers: { ...headers, ...(status === 503 ? { 'Retry-After': '60' } : {}) } });

/** One fixed upstream and cache key. No arbitrary URL, query or credentials. */
export function createPetaBencanaProxy({ fetcher = fetch, getCache = () => globalThis.caches?.default, now = Date.now, timeoutMs = 12_000 } = {}) {
  let memory, pending;
  async function load() {
    if (memory && memory.until > now()) return { ...memory, hit: true };
    if (pending) return pending;
    pending = (async () => {
      const cache = getCache();
      const key = new Request('https://bumi-aksara-portfolio.pages.dev/humanies-exploration/api/petabencana');
      const stored = await cache?.match(key).catch(() => null);
      if (stored) {
        const fetchedAt = stored.headers.get('X-PetaBencana-Fetched-At');
        const age = now() - Date.parse(fetchedAt);
        if (age >= 0 && age < TTL * 1000) {
          memory = { text: await stored.text(), fetchedAt, status: 200, until: Date.parse(fetchedAt) + TTL * 1000 };
          return { ...memory, hit: true };
        }
      }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetcher(PETABENCANA_UPSTREAM, { signal: controller.signal, redirect: 'manual', headers: { Accept: 'application/json', 'User-Agent': USER_AGENT } });
        if (!response.ok) { const e = new Error('Upstream failure'); e.status = response.status === 429 ? 503 : 502; throw e; }
        if (!/^application\/json\b/i.test(response.headers.get('Content-Type') ?? '')) throw new Error('Expected JSON');
        const text = await readLimitedBody(response);
        const data = JSON.parse(text);
        if (data.statusCode !== 200 || data.result?.type !== 'FeatureCollection' || !Array.isArray(data.result.features)) throw new Error('Expected GeoJSON');
        const fetchedAt = new Date(now()).toISOString();
        memory = { text, fetchedAt, status: 200, until: now() + TTL * 1000 };
        await cache?.put(key, new Response(text, { headers: { ...headers, 'Cache-Control': `public, max-age=${TTL}`, 'X-PetaBencana-Fetched-At': fetchedAt } })).catch(() => {});
        return { ...memory, hit: false };
      } catch (e) {
        memory = { status: controller.signal.aborted ? 504 : e.status ?? 502, until: now() + 60_000 };
        return memory;
      } finally { clearTimeout(timer); }
    })();
    try { return await pending; } finally { pending = undefined; }
  }
  return async (request) => {
    const url = new URL(request.url);
    if (url.pathname !== PETABENCANA_ROUTE) return new Response(null, { status: 404, headers });
    if (request.method !== 'GET') return new Response(null, { status: 405, headers: { ...headers, Allow: 'GET' } });
    if (url.search) return new Response(JSON.stringify({ error: 'Query parameters are not supported' }), { status: 400, headers });
    if (request.headers.get('Origin') && request.headers.get('Origin') !== url.origin) return new Response(null, { status: 403, headers });
    try {
      const result = await load();
      if (result.status !== 200) return failure(result.status);
      return new Response(result.text, { headers: { ...headers, 'X-PetaBencana-Fetched-At': result.fetchedAt, 'X-Humanies-Cache': result.hit ? 'HIT' : 'MISS' } });
    } catch { return failure(502); }
  };
}
const handle = createPetaBencanaProxy();
export const onRequest = ({ request }) => handle(request);
