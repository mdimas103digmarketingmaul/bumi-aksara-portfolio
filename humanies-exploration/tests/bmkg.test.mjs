import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeFeed, deduplicate, inPeriod, formatWIB, readCache, fetchBMKG, BMKG_CONFIG } from '../src/services/bmkg.ts';
import { getDonateAction } from '../src/lib/actions.ts';
const row = { DateTime:'2026-11-02T08:13:10+00:00', Coordinates:'1.31,124.83', Magnitude:'5.3', Kedalaman:'148 km', Wilayah:'Tomohon', Potensi:'Tidak berpotensi tsunami' };
const feed = (...rows) => ({Infogempa:{gempa:rows}});
test('normalization, coordinates, WIB, optional fields and deduplication',()=>{
 const [e] = normalizeFeed(feed(row));
 assert.equal(e.latitude,1.31); assert.equal(e.longitude,124.83); assert.equal(e.magnitude,5.3); assert.equal(e.depthKm,148);
 assert.match(formatWIB(e.eventDateTime),/15[.:]13[.:]10 WIB/);
 const duplicate = normalizeFeed(feed({...row, Wilayah:'Different description',Potensi:undefined,Dirasakan:'II Minahasa'}));
 const merged = deduplicate([e,...duplicate]); assert.equal(merged.length,1); assert.equal(merged[0].feltInformation,'II Minahasa'); assert.equal(merged[0].tsunamiPotential,row.Potensi);
 assert.equal(inPeriod([e],Date.parse('2026-11-04')).length,1); assert.equal(inPeriod([e],Date.parse('2026-11-20')).length,0);
});
test('invalid records skipped, malformed and entirely invalid feeds rejected',()=>{
 assert.equal(normalizeFeed(feed(row,{...row, Coordinates:'124.83,1.31'},{...row,Coordinates:',120'},{...row,Magnitude:'abc'},{...row,DateTime:'yesterday'},null)).length,1);
 assert.throws(()=>normalizeFeed({})); assert.throws(()=>normalizeFeed(feed({...row,Coordinates:'NaN,120'})));
 assert.equal(normalizeFeed(feed({...row, Kedalaman:'unknown'}))[0].depthKm,undefined);
});
test('cache expiry, corruption, fetch and failure',async()=>{
 let value=null; globalThis.localStorage={getItem:()=>value,setItem:(_,v)=>value=v};
 const nativeFetch=globalThis.fetch;
 globalThis.fetch=async()=>({ok:true,json:async()=>feed(row)});
 const result=await fetchBMKG(new AbortController().signal); assert.equal(result.events.length,1); assert.equal(readCache().events.length,1);
 value=JSON.stringify({...JSON.parse(value),fetchedAt:new Date(Date.now()-BMKG_CONFIG.cacheMaxAgeMs-1).toISOString()}); assert.equal(readCache(),null);
 value='broken'; assert.equal(readCache(),null);
 globalThis.fetch=async()=>({ok:false,status:503}); await assert.rejects(fetchBMKG(new AbortController().signal)); globalThis.fetch=nativeFetch;
});
test('manual donation platform links preserved, closed blocked',()=>{
 for(const actionUrl of ['https://mayar.id/example','https://kitabisa.com/example']) {
 const event={incidentStatus:'active-response',fundraisingStatus:'open',actionUrl}; assert.equal(getDonateAction(event).url,actionUrl); assert.equal(getDonateAction({...event,fundraisingStatus:'closed'}),null);
 }
});
