import { useEffect, useMemo, useState } from 'react';
import { fetchPetaBencana, readPetaBencanaCache, recentReports, PETABENCANA_CONFIG } from '../services/petabencana';
export function usePetaBencana() {
  const [snapshot, setSnapshot] = useState(() => PETABENCANA_CONFIG.enabled ? readPetaBencanaCache() : null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!PETABENCANA_CONFIG.enabled) return;
    let disposed = false, pending = false, lastAttempt = 0;
    let controller: AbortController | undefined;
    const refresh = async () => {
      setNow(Date.now());
      if (disposed || document.hidden || pending || Date.now() - lastAttempt < PETABENCANA_CONFIG.refreshMs) return;
      pending = true; lastAttempt = Date.now(); controller = new AbortController();
      const timeout = window.setTimeout(() => controller?.abort(), PETABENCANA_CONFIG.timeoutMs);
      try { const data = await fetchPetaBencana(controller.signal); if (!disposed) { setSnapshot(data); setStatus('ready'); } }
      catch { if (!disposed) setStatus('error'); }
      finally { clearTimeout(timeout); pending = false; }
    };
    const start = window.setTimeout(() => void refresh(), 0);
    // Period and cache expiry are checked even between network refreshes.
    const timer = window.setInterval(() => { if (!document.hidden) void refresh(); }, 30_000);
    document.addEventListener('visibilitychange', refresh);
    return () => { disposed = true; clearTimeout(start); clearInterval(timer); controller?.abort(); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  const usable = PETABENCANA_CONFIG.enabled && snapshot && now - Date.parse(snapshot.fetchedAt) <= PETABENCANA_CONFIG.cacheMaxAgeMs;
  const ids = usable ? recentReports(snapshot.events, now).map(e => e.id).join('|') : '';
  const events = useMemo(() => usable ? snapshot.events.filter(e => ids.split('|').includes(e.id)) : [], [snapshot, ids, !!usable]);
  return { events, status, fetchedAt: snapshot?.fetchedAt, stale: status !== 'ready' || !!snapshot && now - Date.parse(snapshot.fetchedAt) >= PETABENCANA_CONFIG.refreshMs };
}
