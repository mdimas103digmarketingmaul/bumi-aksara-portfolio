import type { WeatherWarning } from '../types/weather';
export const WEATHER_CONFIG = { enabled: true, refreshMs: 10 * 60_000, cacheMaxAgeMs: 30 * 60_000, timeoutMs: 90_000 };
export const WEATHER_SOURCE = 'https://www.bmkg.go.id/alerts/nowcast/id';
export const WEATHER_ENDPOINT = '/humanies-exploration/api/weather';
const KEY = 'humanies-weather-v2';
const children = (node: Element, name: string) => [...node.children].filter(e => e.localName === name);
const value = (node: Element, name: string) => children(node, name)[0]?.textContent?.trim() ?? '';
function xml(text: string, root: string) {
  if (text.length > 2_000_000 || /<!DOCTYPE|<!ENTITY/i.test(text)) throw new Error('Unsupported XML');
  const document = new DOMParser().parseFromString(text, 'application/xml');
  if (document.getElementsByTagName('parsererror').length || document.documentElement.localName !== root) throw new Error('Invalid XML');
  return document.documentElement;
}
function iso(text: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(text) || !Number.isFinite(Date.parse(text))) throw new Error('Invalid CAP time');
  return new Date(text).toISOString();
}
export function capUrl(url: string) {
  try { const u = new URL(url); return u.origin === 'https://www.bmkg.go.id' && /^\/alerts\/nowcast\/id\/[A-Za-z0-9_-]+_alert\.xml$/.test(u.pathname) && !u.search && !u.hash ? u.href : null; } catch { return null; }
}
export function parseRSS(text: string): string[] {
  const channel = children(xml(text, 'rss'), 'channel')[0];
  if (!channel) throw new Error('Invalid RSS channel');
  const items = children(channel, 'item');
  const links = items.map(item => capUrl(value(item, 'link'))).filter((url): url is string => !!url);
  if (items.length && !links.length) throw new Error('No valid CAP links');
  return [...new Set(links)];
}
export function parsePolygon(text: string): [number, number][] | null {
  const tokens = text.trim().split(/\s+/);
  if (tokens.length < 4 || tokens.length > 10000) return null;
  const ring: [number, number][] = [];
  for (const token of tokens) {
    if (!/^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/.test(token)) return null;
    const [lat, lon] = token.split(',').map(Number);
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
    ring.push([lon, lat]);
  }
  const first = ring[0], last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1] || new Set(ring.map(p => p.join(','))).size < 3) return null;
  const area = ring.slice(1).reduce((sum, p, i) => sum + ring[i][0] * p[1] - p[0] * ring[i][1], 0);
  return Math.abs(area) > 1e-10 ? ring : null;
}
export interface CAPMessage { identifier: string; sent: string; references: string[]; warnings: WeatherWarning[]; }
export function parseCAP(text: string, url: string): CAPMessage {
  if (!capUrl(url)) throw new Error('Untrusted CAP URL');
  const alert = xml(text, 'alert');
  if (alert.namespaceURI !== 'urn:oasis:names:tc:emergency:cap:1.2') throw new Error('Unsupported CAP namespace');
  const identifier = value(alert, 'identifier');
  if (!identifier) throw new Error('Missing CAP identifier');
  const sent = iso(value(alert, 'sent'));
  const msgType = value(alert, 'msgType');
  const actual = value(alert, 'status') === 'Actual' && value(alert, 'scope') === 'Public';
  const references = actual && ['Update', 'Cancel'].includes(msgType) ? value(alert, 'references').split(/\s+/).map(r => r.split(',')[1]).filter(Boolean) : [];
  const result: CAPMessage = { identifier, sent, references, warnings: [] };
  if (!actual || !['Alert', 'Update'].includes(msgType)) return result;
  const infos = children(alert, 'info');
  const local = infos.filter(i => /^id(?:-|$)/i.test(value(i, 'language')));
  for (const [index, info] of (local.length ? local : infos.slice(0, 1)).entries()) {
    const effective = iso(value(info, 'effective') || sent), expires = iso(value(info, 'expires'));
    if (Date.parse(expires) <= Date.parse(effective)) throw new Error('Invalid validity interval');
    const areas = children(info, 'area');
    const polygons = areas.flatMap(a => children(a, 'polygon').map(p => parsePolygon(p.textContent ?? '')).filter((p): p is [number, number][] => p !== null));
    const region = areas.map(a => value(a, 'areaDesc')).filter(Boolean).join('; ');
    const title = value(info, 'headline') || value(info, 'event');
    if (!title || !region) throw new Error('Missing CAP location/title');
    const point = polygons[0]?.[0];
    result.warnings.push({ id: `weather-${identifier}-${index}`, source: 'BMKG', sourceType: 'weather', title, region, description: value(info, 'description'), instruction: value(info, 'instruction') || undefined, issued: sent, effective, expires, urgency: value(info, 'urgency'), severity: value(info, 'severity'), certainty: value(info, 'certainty'), sourceUrl: url, polygons, longitude: point?.[0], latitude: point?.[1] });
  }
  return result;
}
export function mergeCAP(messages: CAPMessage[]) {
  const latest = new Map<string, CAPMessage>();
  messages.forEach(m => { if (!latest.has(m.identifier) || latest.get(m.identifier)!.sent <= m.sent) latest.set(m.identifier, m); });
  const replaced = new Set([...latest.values()].flatMap(m => m.references));
  return [...latest.values()].filter(m => !replaced.has(m.identifier)).flatMap(m => m.warnings);
}
export function activeWarnings(events: WeatherWarning[], now = Date.now()) {
  return events.filter(e => Date.parse(e.issued) <= now && Date.parse(e.effective) <= now && now < Date.parse(e.expires));
}
export interface WeatherSnapshot { events: WeatherWarning[]; fetchedAt: string }
type RawCache = { fetchedAt: string; entries: { url: string; text: string }[] };
export function readWeatherCache(): WeatherSnapshot | null {
  try {
    const raw: RawCache = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    const age = Date.now() - Date.parse(raw.fetchedAt);
    if (!Number.isFinite(age) || age < 0 || age > WEATHER_CONFIG.cacheMaxAgeMs || !Array.isArray(raw.entries)) return null;
    return { fetchedAt: raw.fetchedAt, events: mergeCAP(raw.entries.map(e => parseCAP(e.text, e.url))) };
  } catch { return null; }
}
async function fetchXML(url: string, signal: AbortSignal) {
  const endpoint = WEATHER_ENDPOINT + url.slice(WEATHER_SOURCE.length);
  const response = await fetch(endpoint, { signal, credentials: 'omit' });
  if (!response.ok) throw new Error(`Weather HTTP ${response.status}`);
  const fetchedAt = response.headers.get('X-BMKG-Fetched-At');
  if (!fetchedAt || !Number.isFinite(Date.parse(fetchedAt)) || Date.parse(fetchedAt) > Date.now() + 60_000) throw new Error('Weather proxy timestamp missing or invalid');
  return { text: await response.text(), fetchedAt };
}
export async function fetchWeather(signal: AbortSignal): Promise<WeatherSnapshot> {
  const rss = await fetchXML(WEATHER_SOURCE, signal);
  const links = parseRSS(rss.text);
  const fetchedTimes = [Date.parse(rss.fetchedAt)];
  if (links.length > 45) throw new Error('Feed exceeds prototype request budget');
  const entries: RawCache['entries'] = [];
  // Sequential CAP fetches, spaced to stay below 60 requests/minute including earthquakes.
  for (const url of links) {
    await new Promise<void>((resolve, reject) => {
      if (signal.aborted) return reject(signal.reason);
      const abort = () => { clearTimeout(timer); reject(signal.reason); };
      const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, 1200);
      signal.addEventListener('abort', abort, { once: true });
    });
    const cap = await fetchXML(url, signal);
    entries.push({ url, text: cap.text });
    fetchedTimes.push(Date.parse(cap.fetchedAt));
  }
  const events = mergeCAP(entries.map(e => parseCAP(e.text, e.url)));
  const fetchedAt = new Date(Math.min(...fetchedTimes)).toISOString();
  try { localStorage.setItem(KEY, JSON.stringify({ fetchedAt, entries })); } catch { /* Optional storage. */ }
  return { events, fetchedAt };
}
export const CAP_LABELS: Record<string, string> = {
  Immediate: 'Segera', Expected: 'Dalam satu jam', Future: 'Waktu dekat', Past: 'Telah berlalu', Unknown: 'Tidak diketahui',
  Extreme: 'Ekstrem', Severe: 'Signifikan', Moderate: 'Sedang', Minor: 'Ringan', Observed: 'Teramati', Likely: 'Kemungkinan besar', Possible: 'Mungkin', Unlikely: 'Tidak diharapkan terjadi',
};
