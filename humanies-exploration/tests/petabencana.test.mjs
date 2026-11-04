import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeReports, recentReports, readPetaBencanaCache, fetchPetaBencana, PETABENCANA_CONFIG } from '../src/services/petabencana.ts';
import { createPetaBencanaProxy, PETABENCANA_ROUTE, PETABENCANA_UPSTREAM } from '../server/petabencana-proxy.mjs';
const now = Date.parse('2026-11-04T03:00:00Z');
const feature = (p = {}, geometry = { type: 'Point', coordinates: [106.82, -6.2] }) => ({ type: 'Feature', geometry, properties: { pkey: '123', created_at: '2026-11-03T03:00:00Z', disaster_type: 'flood', is_training: false, status: 'confirmed', tags: { city: 'JAKARTA', instance_region_code: 'ID-JK' }, text: '<script>unsafe()</script>', url: 'uuid-not-a-url', ...p } });
const feed = (...features) => ({ statusCode: 200, result: { type: 'FeatureCollection', features } });
const request = (suffix = '', init) => new Request(`https://example.test${PETABENCANA_ROUTE}${suffix}`, init);
const response = (payload = feed(feature())) => new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } });
test('GeoJSON lon/lat, real fields, raw status, safe optional text and no invented source URL', () => {
  const [e] = normalizeReports(feed(feature()), now);
  assert.equal(e.longitude, 106.82); assert.equal(e.latitude, -6.2);
  assert.equal(e.reportedAt, '2026-11-03T03:00:00.000Z'); assert.equal(e.verificationStatus, 'confirmed');
  assert.equal(e.sourceUrl, undefined); assert.equal(e.description, '<script>unsafe()</script>');
  const [optional] = normalizeReports(feed(feature({ status: null, text: null, tags: null })), now);
  assert.equal(optional.verificationStatus, undefined); assert.equal(optional.city, undefined);
  assert.equal(normalizeReports(feed(feature({ status: 'unverified' })), now)[0].verificationStatus, 'unverified');
});
test('deduplication, training exclusion, unsupported/invalid geometry, timestamps and period', () => {
  const valid = feature();
  assert.equal(normalizeReports(feed(valid, valid, feature({ pkey: 'training', is_training: true }), feature({}, { type: 'Polygon', coordinates: [] }), feature({}, { type: 'Point', coordinates: [100, 106] }), feature({ created_at: '2026-02-31T00:00:00Z' })), now).length, 1);
  for (const stamp of ['not-a-date', '2026-11-01', '2026-11-01T12:00:00', '2026-02-30T00:00:00Z']) assert.throws(() => normalizeReports(feed(feature({ created_at: stamp })), now));
  assert.throws(() => normalizeReports(feed(feature({}, { type: 'Point', coordinates: ['106', -6] })), now));
  assert.throws(() => normalizeReports(feed(feature({ is_training: undefined })), now));
  assert.deepEqual(normalizeReports(feed(), now), []);
  assert.deepEqual(normalizeReports(feed(feature({ is_training: true })), now), []);
  assert.deepEqual(normalizeReports(feed(feature({ created_at: '2026-10-01T00:00:00Z' })), now), []);
  assert.deepEqual(normalizeReports(feed(feature({ created_at: '2026-12-01T00:00:00Z' })), now), []);
  const [e] = normalizeReports(feed(valid), now);
  assert.equal(recentReports([e], Date.parse(e.reportedAt) + 7 * 86400_000).length, 1);
  assert.equal(recentReports([e], Date.parse(e.reportedAt) + 7 * 86400_000 + 1).length, 0);
  assert.throws(() => normalizeReports({ result: { type: 'Topology' } }));
});
test('cache validation/expiry, successful empty fetch, failure preserves last good snapshot', async () => {
  let stored; globalThis.localStorage = { getItem: () => stored, setItem: (_, v) => stored = v };
  stored = JSON.stringify({ payload: feed(feature()), fetchedAt: new Date(now).toISOString() });
  assert.equal(readPetaBencanaCache(now).events.length, 1);
  assert.equal(readPetaBencanaCache(now + PETABENCANA_CONFIG.cacheMaxAgeMs + 1), null);
  assert.equal(readPetaBencanaCache(now - 1), null);
  stored = 'broken'; assert.equal(readPetaBencanaCache(now), null);
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(JSON.stringify(feed()), { headers: { 'X-PetaBencana-Fetched-At': new Date().toISOString() } });
    const result = await fetchPetaBencana(new AbortController().signal); assert.deepEqual(result.events, []);
    const good = stored;
    globalThis.fetch = async () => new Response('error', { status: 503 });
    await assert.rejects(fetchPetaBencana(new AbortController().signal)); assert.equal(stored, good);
    globalThis.fetch = async () => response(); await assert.rejects(fetchPetaBencana(new AbortController().signal));
  } finally { globalThis.fetch = original; delete globalThis.localStorage; }
});
test('proxy fixed endpoint/User-Agent, cache timestamp and concurrent single-flight', async () => {
  let calls = 0, time = now;
  const handler = createPetaBencanaProxy({ getCache: () => undefined, now: () => time, fetcher: async (url, opts) => { calls++; assert.equal(url, PETABENCANA_UPSTREAM); assert.match(opts.headers['User-Agent'], /HumaniesDisasterWatch/); assert.equal(opts.redirect, 'manual'); await new Promise(r => setTimeout(r, 5)); return response(); } });
  const results = await Promise.all([handler(request()), handler(request())]); assert.equal(calls, 1); assert.equal(results[0].status, 200);
  time += 1000; const cached = await handler(request()); assert.equal(calls, 1); assert.equal(cached.headers.get('X-Humanies-Cache'), 'HIT'); assert.equal(cached.headers.get('X-PetaBencana-Fetched-At'), new Date(now).toISOString());
  time += 300_000; await handler(request()); assert.equal(calls, 2);
});
test('proxy method/query/origin/path rejection makes no upstream requests', async () => {
  const handler = createPetaBencanaProxy({ fetcher: () => { throw Error('must not fetch'); } });
  assert.equal((await handler(request('?url=https://evil.test'))).status, 400);
  assert.equal((await handler(request('', { method: 'POST' }))).status, 405);
  assert.equal((await handler(request('', { headers: { Origin: 'https://evil.test' } }))).status, 403);
  assert.equal((await handler(request('/reports'))).status, 404);
});
test('proxy failure, redirects, size limits, malformed feed, rate limit backoff and timeout', async () => {
  for (const result of [() => new Response(null, { status: 302 }), () => new Response('html', { headers: { 'Content-Type': 'text/html' } }), () => response({ statusCode: 200, result: { type: 'Topology' } }), () => new Response('{', { headers: { 'Content-Type': 'application/json' } }), () => new Response('x'.repeat(2_000_001), { headers: { 'Content-Type': 'application/json' } }), () => new Response('x', { headers: { 'Content-Type': 'application/json', 'Content-Length': '2000001' } })]) {
    const handler = createPetaBencanaProxy({ getCache: () => undefined, fetcher: async () => result() });
    assert.equal((await handler(request())).status, 502);
  }
  let calls = 0;
  const handler = createPetaBencanaProxy({ getCache: () => undefined, fetcher: async () => { calls++; return new Response(null, { status: 429 }); } });
  assert.equal((await handler(request())).status, 503); const backoff = await handler(request()); assert.equal(calls, 1); assert.equal(backoff.headers.get('Retry-After'), '60');
  const timeout = createPetaBencanaProxy({ getCache: () => undefined, timeoutMs: 5, fetcher: (_, opts) => new Promise((_, reject) => opts.signal.addEventListener('abort', () => reject(Error('aborted')))) });
  assert.equal((await timeout(request())).status, 504);
});
test('Cloudflare cache HIT across new handler instances retains original fetch time', async () => {
  let stored;
  const cache = { match: async () => stored?.clone(), put: async (_, r) => { stored = r.clone(); } };
  const first = createPetaBencanaProxy({ now: () => now, getCache: () => cache, fetcher: async () => response() });
  await first(request());
  const second = createPetaBencanaProxy({ now: () => now + 1000, getCache: () => cache, fetcher: () => { throw Error('no fetch expected'); } });
  const hit = await second(request()); assert.equal(hit.status, 200); assert.equal(hit.headers.get('X-Humanies-Cache'), 'HIT'); assert.equal(hit.headers.get('X-PetaBencana-Fetched-At'), new Date(now).toISOString());
});
