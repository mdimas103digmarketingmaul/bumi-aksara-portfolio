import { useEffect, useMemo, useState } from 'react';
import { BMKG_CONFIG, fetchBMKG, inPeriod, readCache, type Snapshot } from '../services/bmkg';
export function useBMKG() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(() => BMKG_CONFIG.enabled ? readCache() : null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!BMKG_CONFIG.enabled) return;
    let disposed = false;
    let pending = false;
    let lastAttempt = 0;
    let controller: AbortController | undefined;
    let timer: number;
    const refresh = async () => {
      setNow(Date.now());
      if (disposed || document.hidden || pending || Date.now() - lastAttempt < BMKG_CONFIG.refreshMs) return;
      pending = true;
      lastAttempt = Date.now();
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller?.abort(), BMKG_CONFIG.timeoutMs);
      try {
        const result = await fetchBMKG(controller.signal);
        if (!disposed) { setSnapshot(result); setStatus('ready'); }
      } catch {
        controller.abort();
        if (!disposed) setStatus('error');
      } finally {
        clearTimeout(timeout);
        pending = false;
      }
    };
    // Deferred startup avoids duplicate fetches during React StrictMode's effect rehearsal.
    const start = window.setTimeout(() => { void refresh(); timer = window.setInterval(() => void refresh(), BMKG_CONFIG.refreshMs); }, 0);
    document.addEventListener('visibilitychange', refresh);
    return () => { disposed = true; clearTimeout(start); clearInterval(timer); controller?.abort(); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  const expired = snapshot && now - Date.parse(snapshot.fetchedAt) > BMKG_CONFIG.cacheMaxAgeMs;
  const events = useMemo(() => snapshot && !expired ? inPeriod(snapshot.events, now) : [], [snapshot, expired, now]);
  return { events, fetchedAt: snapshot?.fetchedAt, status, stale: status !== 'ready' || !!snapshot && now - Date.parse(snapshot.fetchedAt) >= BMKG_CONFIG.refreshMs };
}
