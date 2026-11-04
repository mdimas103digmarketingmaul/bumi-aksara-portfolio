import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWeatherProxy, WEATHER_ROUTE } from '../server/weather-proxy.mjs';
const base = 'https://portfolio.test' + WEATHER_ROUTE;
const file = '/CJI20261103006_alert.xml';
const rss = `<rss><channel><item><link>https://www.bmkg.go.id/alerts/nowcast/id${file}</link></item></channel></rss>`;
const cap = '<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2"><identifier>test</identifier></alert>';
const request = (suffix = '', options) => new Request(base + suffix, options);
const xml = body => new Response(body, { headers: { 'Content-Type': 'application/xml' } });
test('fixed upstream, shared caching, concurrent coalescing, original fetch timestamp', async () => {
  let calls = 0, time = Date.now();
  const cacheValues = new Map();
  const cache = { match: async r => cacheValues.get(r.url)?.clone(), put: async (r, v) => cacheValues.set(r.url, v.clone()) };
  const fetcher = async (url, options) => { calls++; assert(url.startsWith('https://www.bmkg.go.id/alerts/nowcast/id')); assert.equal(options.redirect, 'manual'); return xml(url.endsWith('.xml') ? cap : rss); };
  const handle = createWeatherProxy({ fetcher, getCache: () => cache, now: () => time });
  const responses = await Promise.all([handle(request()), handle(request()), handle(request())]);
  assert.equal(calls, 1); assert(responses.every(r => r.status === 200));
  const firstTime = responses[0].headers.get('X-BMKG-Fetched-At'); time += 1000;
  const cached = await handle(request()); assert.equal(cached.headers.get('X-Humanies-Cache'), 'HIT'); assert.equal(cached.headers.get('X-BMKG-Fetched-At'), firstTime);
  assert.equal((await handle(request(file))).status, 200); assert.equal(calls, 2);
  const anotherIsolate = createWeatherProxy({ fetcher, getCache: () => cache, now: () => time });
  assert.equal((await anotherIsolate(request(file))).headers.get('X-Humanies-Cache'), 'HIT'); assert.equal(calls, 2);
});
test('reject method, query, cross-origin, unknown paths and unlisted CAP; no open proxy', async () => {
  let calls = 0; const handle = createWeatherProxy({ fetcher: async () => { calls++; return xml(rss); }, getCache: () => null });
  for (const [suffix, options, status] of [['?url=https://evil.test', undefined, 400], ['', {method:'POST'}, 405], ['', {headers:{Origin:'https://evil.test'}}, 403], ['/evil', undefined, 404], ['/NOTLISTED_alert.xml',undefined,404], ['/x/y_alert.xml',undefined,404]]) assert.equal((await handle(request(suffix,options))).status,status);
  assert.equal(calls,1);
});
test('upstream failure/redirect/HTML/oversize rejected and errors briefly cached', async () => {
  for(const upstream of [new Response('',{status:302,headers:{Location:'https://evil.test'}}),new Response('HTML',{headers:{'Content-Type':'text/html'}}),new Response('<rss/>',{headers:{'Content-Type':'application/xml','Content-Length':'2000001'}}),xml('<!DOCTYPE rss><rss/>'),xml('x'.repeat(2000001))]) {
    let calls=0; const handle=createWeatherProxy({fetcher:async()=>{calls++;return upstream},getCache:()=>null});
    assert.equal((await handle(request())).status,502); assert.equal((await handle(request())).status,502);assert.equal(calls,1);
  }
});
test('timeout returns 504 without stale success',async()=>{
  const handle=createWeatherProxy({timeoutMs:5,getCache:()=>null,fetcher:(_,o)=>new Promise((_,reject)=>o.signal.addEventListener('abort',()=>reject(Error('aborted'))))});
  assert.equal((await handle(request())).status,504);
});
test('isolate budget limits outbound requests',async()=>{
  const links=Array.from({length:46},(_,i)=>`<item><link>https://www.bmkg.go.id/alerts/nowcast/id/C${i}_alert.xml</link></item>`).join('');
  let calls=0;const handle=createWeatherProxy({getCache:()=>null,fetcher:async url=>{calls++;return xml(url.endsWith('.xml')?cap:`<rss><channel>${links}</channel></rss>`)}});
  for(let i=0;i<44;i++)assert.equal((await handle(request(`/C${i}_alert.xml`))).status,200);
  assert.equal((await handle(request('/C44_alert.xml'))).status,503);assert.equal(calls,45);
});
