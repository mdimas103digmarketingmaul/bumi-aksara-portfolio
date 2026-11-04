import type { BMKGEarthquake } from '../types/bmkg';
export const BMKG_CONFIG = { enabled: true, days: 7, refreshMs: 10 * 60_000, cacheMaxAgeMs: 24 * 60 * 60_000, timeoutMs: 15_000 };
export const BMKG_SOURCE = 'https://data.bmkg.go.id/gempabumi/';
export const BMKG_ENDPOINTS = ['gempaterkini', 'gempadirasakan'].map(name => `https://data.bmkg.go.id/DataMKG/TEWS/${name}.json`);
const CACHE_KEY = 'humanies-bmkg-v1';
const optionalText = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : undefined;
export function normalizeFeed(payload: unknown): BMKGEarthquake[] {
  const rows = (payload as { Infogempa?: { gempa?: unknown } })?.Infogempa?.gempa;
  if (!Array.isArray(rows)) throw new Error('Invalid BMKG feed');
  const events: BMKGEarthquake[] = [];
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    const coordinates = typeof r.Coordinates === 'string' ? r.Coordinates.split(',').map(s => s.trim()) : [];
    if (coordinates.length !== 2 || coordinates.some(s => !/^-?\d+(\.\d+)?$/.test(s))) continue;
    const [latitude, longitude] = coordinates.map(Number);
    const magnitude = typeof r.Magnitude === 'string' && /^\d+(\.\d+)?$/.test(r.Magnitude.trim()) ? Number(r.Magnitude) : NaN;
    const region = optionalText(r.Wilayah);
    const date = optionalText(r.DateTime);
    if (!date || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(date) || !Number.isFinite(Date.parse(date)) || !region || !Number.isFinite(magnitude) || magnitude > 10 || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) continue;
    const eventDateTime = new Date(date).toISOString();
    const depth = typeof r.Kedalaman === 'string' ? r.Kedalaman.match(/^(\d+(?:\.\d+)?)\s*km$/i) : null;
    events.push({ id: `bmkg-${eventDateTime}-${latitude}-${longitude}`, source: 'BMKG', sourceType: 'earthquake', eventDateTime, latitude, longitude, magnitude, region, depthKm: depth ? Number(depth[1]) : undefined, tsunamiPotential: optionalText(r.Potensi), feltInformation: optionalText(r.Dirasakan) });
  }
  if (rows.length && !events.length) throw new Error('No valid BMKG records');
  return events;
}
export function deduplicate(events: BMKGEarthquake[]): BMKGEarthquake[] {
  const result = new Map<string, BMKGEarthquake>();
  for (const event of events) {
    const previous = result.get(event.id);
    result.set(event.id, previous ? { ...previous, tsunamiPotential: previous.tsunamiPotential ?? event.tsunamiPotential, feltInformation: previous.feltInformation ?? event.feltInformation } : event);
  }
  return [...result.values()].sort((a, b) => b.eventDateTime.localeCompare(a.eventDateTime));
}
export function inPeriod(events: BMKGEarthquake[], now = Date.now()) {
  return events.filter(e => { const time = Date.parse(e.eventDateTime); return time <= now && time >= now - BMKG_CONFIG.days * 86400_000; });
}
export const formatWIB = (date: string) => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'long', timeStyle: 'medium' }).format(new Date(date)) + ' WIB';
export interface Snapshot { events: BMKGEarthquake[]; fetchedAt: string }
// Store raw feeds so cached data passes the same validation as network data.
export function readCache(): Snapshot | null {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null');
    const age = Date.now() - Date.parse(cache?.fetchedAt);
    if (!Number.isFinite(age) || age < 0 || age > BMKG_CONFIG.cacheMaxAgeMs || !Array.isArray(cache.feeds) || cache.feeds.length !== 2) return null;
    return { events: deduplicate(cache.feeds.flatMap(normalizeFeed)), fetchedAt: cache.fetchedAt };
  } catch { return null; }
}
export async function fetchBMKG(signal: AbortSignal): Promise<Snapshot> {
  const feeds = await Promise.all(BMKG_ENDPOINTS.map(async url => {
    const response = await fetch(url, { signal, credentials: 'omit' });
    if (!response.ok) throw new Error(`BMKG HTTP ${response.status}`);
    return response.json() as Promise<unknown>;
  }));
  const events = deduplicate(feeds.flatMap(normalizeFeed));
  const fetchedAt = new Date().toISOString();
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ feeds, fetchedAt })); } catch { /* Storage is optional. */ }
  return { events, fetchedAt };
}
