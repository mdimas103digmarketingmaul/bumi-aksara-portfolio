import type { PetaBencanaReport } from '../types/petabencana';
export const PETABENCANA_CONFIG = { enabled: true, days: 7, refreshMs: 10 * 60_000, timeoutMs: 15_000, cacheMaxAgeMs: 30 * 60_000 };
export const PETABENCANA_ENDPOINT = '/humanies-exploration/api/petabencana';
export const PETABENCANA_SOURCE = 'https://petabencana.id/';
export const PETABENCANA_CACHE_KEY = 'humanies-petabencana-v1';
export const REPORT_TYPES: Record<string, string> = { flood: 'Banjir', fire: 'Kebakaran', wind: 'Angin kencang', earthquake: 'Gempa bumi', volcano: 'Gunung api', haze: 'Kabut asap' };
export const reportTypeLabel = (type: string) => REPORT_TYPES[type] ?? type;
const object = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const text = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : undefined;
export function validReportTime(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) || !Number.isFinite(Date.parse(value))) return false;
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return month >= 1 && month <= 12 && day >= 1 && day <= new Date(Date.UTC(year, month, 0)).getUTCDate();
}
export function recentReports(events: PetaBencanaReport[], now = Date.now()) {
  const start = now - Math.min(7, Math.max(1, PETABENCANA_CONFIG.days)) * 86400_000;
  return events.filter(e => Date.parse(e.reportedAt) >= start && Date.parse(e.reportedAt) <= now);
}
export function normalizeReports(payload: unknown, now = Date.now()): PetaBencanaReport[] {
  const root = object(payload), result = object(root.result);
  if (root.statusCode !== 200 || result.type !== 'FeatureCollection' || !Array.isArray(result.features)) throw new Error('Invalid PetaBencana GeoJSON');
  const unique = new Map<string, PetaBencanaReport>();
  let invalid = 0;
  for (const feature of result.features) {
    const f = object(feature), p = object(f.properties), g = object(f.geometry), tags = object(p.tags);
    // Current feed explicitly flags training. Missing/ambiguous flags are not asserted live.
    if (p.is_training === true) continue;
    const id = typeof p.pkey === 'number' && Number.isSafeInteger(p.pkey) ? String(p.pkey) : text(p.pkey);
    const type = text(p.disaster_type);
    const coords = g.coordinates;
    if (p.is_training !== false || f.type !== 'Feature' || !id || !type || !validReportTime(p.created_at) || g.type !== 'Point' || !Array.isArray(coords) || coords.length < 2 || typeof coords[0] !== 'number' || typeof coords[1] !== 'number' || !Number.isFinite(coords[0]) || !Number.isFinite(coords[1]) || Math.abs(coords[0]) > 180 || Math.abs(coords[1]) > 90) { invalid++; continue; }
    const event: PetaBencanaReport = { id: `petabencana:${id}`, reportId: id, source: 'PetaBencana', sourceType: 'community-report', disasterType: type, title: text(p.title) ?? `Laporan ${reportTypeLabel(type)}`, description: text(p.text), longitude: coords[0], latitude: coords[1], reportedAt: new Date(p.created_at).toISOString(), city: text(tags.city), regionCode: text(tags.instance_region_code), verificationStatus: text(p.status) };
    const existing = unique.get(event.id);
    if (!existing || existing.reportedAt < event.reportedAt) unique.set(event.id, event);
  }
  if (invalid && !unique.size) throw new Error('No valid report records');
  return recentReports([...unique.values()], now).sort((a, b) => b.reportedAt.localeCompare(a.reportedAt) || a.id.localeCompare(b.id));
}
export interface PetaBencanaSnapshot { events: PetaBencanaReport[]; fetchedAt: string }
export function readPetaBencanaCache(now = Date.now()): PetaBencanaSnapshot | null {
  try {
    const value = JSON.parse(localStorage.getItem(PETABENCANA_CACHE_KEY) ?? 'null');
    if (!value || !validReportTime(value.fetchedAt) || now - Date.parse(value.fetchedAt) < 0 || now - Date.parse(value.fetchedAt) > PETABENCANA_CONFIG.cacheMaxAgeMs) return null;
    return { events: normalizeReports(value.payload, now), fetchedAt: value.fetchedAt };
  } catch { return null; }
}
export async function fetchPetaBencana(signal: AbortSignal): Promise<PetaBencanaSnapshot> {
  const response = await fetch(PETABENCANA_ENDPOINT, { signal, cache: 'no-store' });
  if (!response.ok) throw new Error('PetaBencana unavailable');
  const payload: unknown = await response.json();
  const fetchedAt = response.headers.get('X-PetaBencana-Fetched-At');
  const now = Date.now();
  if (!validReportTime(fetchedAt) || Date.parse(fetchedAt) > now + 5000 || now - Date.parse(fetchedAt) > PETABENCANA_CONFIG.cacheMaxAgeMs) throw new Error('Invalid fetch timestamp');
  const events = normalizeReports(payload, now);
  try { localStorage.setItem(PETABENCANA_CACHE_KEY, JSON.stringify({ payload, fetchedAt })); } catch { /* Storage unavailable: source still works. */ }
  return { events, fetchedAt };
}
