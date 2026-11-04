import { useEffect, useMemo, useState } from 'react';
import { activeWarnings, fetchWeather, readWeatherCache, WEATHER_CONFIG } from '../services/weather';
export function useWeather() {
  const [snapshot, setSnapshot] = useState(readWeatherCache);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!WEATHER_CONFIG.enabled) return;
    let disposed = false, pending = false, lastAttempt = 0;
    let controller: AbortController | undefined;
    const refresh = async () => {
      setNow(Date.now());
      if (disposed || document.hidden || pending || Date.now() - lastAttempt < WEATHER_CONFIG.refreshMs) return;
      pending = true; lastAttempt = Date.now(); controller = new AbortController();
      const timeout = window.setTimeout(() => controller?.abort(), WEATHER_CONFIG.timeoutMs);
      try { const result = await fetchWeather(controller.signal); if (!disposed) { setSnapshot(result); setStatus('ready'); } }
      catch { controller.abort(); if (!disposed) setStatus('error'); }
      finally { clearTimeout(timeout); pending = false; }
    };
    const start = window.setTimeout(() => void refresh(), 0);
    const poll = window.setInterval(() => void refresh(), 30_000);
    // Local expiry clock does not fetch; also re-evaluate immediately on tab visibility.
    const clock = window.setInterval(() => { if (!document.hidden) setNow(Date.now()); }, 1000);
    document.addEventListener('visibilitychange', refresh);
    return () => { disposed = true; clearTimeout(start); clearInterval(poll); clearInterval(clock); controller?.abort(); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  const freshEnough = WEATHER_CONFIG.enabled && snapshot && now - Date.parse(snapshot.fetchedAt) <= WEATHER_CONFIG.cacheMaxAgeMs;
  // Keep array identity stable between expiry/effective boundaries to avoid marker churn.
  const ids = freshEnough ? activeWarnings(snapshot.events, now).map(e => e.id).join('|') : '';
  const events = useMemo(() => freshEnough ? snapshot.events.filter(e => ids.split('|').includes(e.id)) : [], [snapshot, ids, !!freshEnough]);
  return { events, status, fetchedAt: snapshot?.fetchedAt, stale: status !== 'ready' || !!snapshot && now - Date.parse(snapshot.fetchedAt) >= WEATHER_CONFIG.refreshMs };
}
