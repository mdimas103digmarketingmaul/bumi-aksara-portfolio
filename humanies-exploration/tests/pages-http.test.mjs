import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const origin = process.env.PAGES_ORIGIN || 'http://127.0.0.1:8788';
const get = path => fetch(origin + path, { signal: AbortSignal.timeout(20000), redirect: 'manual' });
for (const [url, file] of [['/','../index.html'],['/rjs-cottage/option-02/','../rjs-cottage/option-02/index.html'],['/hanasari-website/','../hanasari-website/index.html'],['/option-02-untuk-portfolio/','../option-02-untuk-portfolio/deploy/index.html'],['/humanies-exploration/','deploy/index.html']]) {
  const response = await get(url); assert.equal(response.status,200,url);assert.equal(await response.text(),await readFile(new URL('../'+file,import.meta.url),'utf8'),url+' content unchanged');
}
assert.equal((await get('/humanies-exploration')).status,301);
const html=await readFile(new URL('../deploy/index.html',import.meta.url),'utf8');
for(const match of html.matchAll(/(?:src|href)="(\/humanies-exploration\/[^\"]+)"/g)) assert.equal((await get(match[1])).status,200,match[1]);
for(const asset of ['/humanies-exploration/brand/humanies-logo.png','/humanies-exploration/images/campaigns/darurat-bencana-sumatra.jpg']) assert.equal((await get(asset)).status,200,asset);
const endpoint='/humanies-exploration/api/weather';
const rss=await get(endpoint);assert.equal(rss.status,200,await rss.clone().text());assert.match(rss.headers.get('Content-Type'),/xml/);assert(rss.headers.get('X-BMKG-Fetched-At'));
const text=await rss.text();const cap=text.match(/<link>\s*https:\/\/www\.bmkg\.go\.id\/alerts\/nowcast\/id\/([^<]+_alert\.xml)\s*<\/link>/)?.[1];
if(cap){const response=await get(endpoint+'/'+cap);assert.equal(response.status,200,await response.clone().text());assert.match(await response.text(),/<alert/);console.log('CAP via Pages Function:',cap)}
const again=await get(endpoint);assert.equal(again.headers.get('X-Humanies-Cache'),'HIT');assert.equal(again.headers.get('X-BMKG-Fetched-At'),rss.headers.get('X-BMKG-Fetched-At'));
assert.equal((await get(endpoint+'?url=https://example.com')).status,400);
assert.equal((await get(endpoint+'/NOTLISTED_alert.xml')).status,404);
assert.equal((await fetch(origin+endpoint,{method:'POST'})).status,405);
console.log('PASS: real Pages Functions RSS/CAP/cache, method/path validation, subpath redirect, frontend assets, portfolio/RJS/Hanasari/Option02 static content preserved');
const petaEndpoint = '/humanies-exploration/api/petabencana';
const reports = await get(petaEndpoint); assert.equal(reports.status, 200, await reports.clone().text());
const reportData = await reports.json(); assert.equal(reportData.result.type, 'FeatureCollection'); assert(Array.isArray(reportData.result.features));
const cachedReports = await get(petaEndpoint); assert.equal(cachedReports.headers.get('X-Humanies-Cache'), 'HIT'); assert.equal(cachedReports.headers.get('X-PetaBencana-Fetched-At'), reports.headers.get('X-PetaBencana-Fetched-At'));
assert.equal((await get(petaEndpoint+'?timeperiod=999999')).status, 400);
assert.equal((await fetch(origin+petaEndpoint,{method:'POST'})).status,405);
assert.equal((await fetch(origin+petaEndpoint,{headers:{Origin:'https://external.test'}})).status,403);
console.log('PASS: PetaBencana actual Pages Function GeoJSON, shared cache/fetch timestamp, fixed-query/method/origin enforcement; raw reports:',reportData.result.features.length);
