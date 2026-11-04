import { Component, Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react';
import type { DisasterMapProps } from './DisasterMap';
const LazyMap = lazy(() => import('./DisasterMap').then(module => ({ default: module.DisasterMap })));
class MapBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div className="map-placeholder" role="status">Peta belum dapat dimuat. Informasi tetap tersedia pada daftar. <button type="button" onClick={() => window.location.reload()}>Muat ulang halaman</button></div> : this.props.children;
  }
}
export function MapViewport(props: DisasterMapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  useEffect(() => {
    if (!ref.current || !('IntersectionObserver' in window)) { setNearby(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setNearby(true); observer.disconnect(); }
    }, { rootMargin: '300px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="map-viewport"><MapBoundary><Suspense fallback={<div className="map-placeholder" role="status">Memuat peta Indonesia…</div>}>{nearby ? <LazyMap {...props} /> : <div className="map-placeholder">Peta Indonesia</div>}</Suspense></MapBoundary></div>;
}
