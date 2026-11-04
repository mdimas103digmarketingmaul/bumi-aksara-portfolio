import { usePetaBencana } from './hooks/usePetaBencana';
import { PETABENCANA_CONFIG, reportTypeLabel } from './services/petabencana';
import { petaBencanaDemoReports } from './data/petabencana-demo';
import { PetaBencanaList } from './components/PetaBencanaInformation';
import './styles/bmkg.css';
import './styles/showcase.css';
import { useWeather } from './hooks/useWeather';
import { WEATHER_CONFIG } from './services/weather';
import { WeatherList } from './components/WeatherInformation';
import { hasPosition } from './types/bmkg';
import { showcaseEvents } from './data/showcase';
import { useBMKG } from './hooks/useBMKG';
import { BMKG_CONFIG, formatWIB } from './services/bmkg';
import { BMKGList, BMKGDisclaimer } from './components/BMKGInformation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MapStatus, StatusFilter } from './types/disaster';
import { disasters } from './data/disasters';
import { STATUS_META, STATUS_ORDER, isMapStatus } from './lib/status';
import { formatUpdated } from './lib/format';
import { MOBILE_QUERY, REDUCED_MOTION_QUERY, useMediaQuery } from './hooks/useMediaQuery';
import { SiteHeader } from './components/SiteHeader';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { SituationList } from './components/SituationList';
import type { MapInsets } from './components/map/DisasterMap';
import { MapViewport } from './components/map/MapViewport';
import { DetailDrawer } from './components/drawer/DetailDrawer';
import { SiteFooter } from './components/SiteFooter';
import { ProgramsTeaser, StoriesTeaser, SupportBand } from './components/HomeContext';
import { CampaignsSection } from './components/CampaignsSection';
import { Toast, type ToastMessage } from './components/Toast';

/** Mirrors widths in styles/layout.css. */
const PANEL_WIDTH = { wide: 340, narrow: 300 };
const DRAWER_WIDTH = 432;
const GUTTER = 20;

// Resolved cases stay in the data as history but are left off the map and list.
// Active responses first, then newest first within each status.
const events = disasters
  .filter((e) => isMapStatus(e.incidentStatus))
  .sort(
    (a, b) =>
      STATUS_ORDER.indexOf(a.incidentStatus as MapStatus) - STATUS_ORDER.indexOf(b.incidentStatus as MapStatus) ||
      b.eventDate.localeCompare(a.eventDate),
  );

const counts = STATUS_ORDER.reduce(
  (acc, status) => ({ ...acc, [status]: events.filter((e) => e.incidentStatus === status).length }),
  {} as Record<MapStatus, number>,
);

const latestUpdate = Math.max(...events.map((e) => new Date(e.lastUpdated).getTime()));
const updatedLabel = formatUpdated(new Date(latestUpdate).toISOString(), 'WIB');

const FILTER_HINT: Record<StatusFilter, string> = {
  all: 'Select a marker or a row to see what is happening and how to help.',
  'active-response': STATUS_META['active-response'].description,
  alert: STATUS_META.alert.description,
  recovery: STATUS_META.recovery.description,
  resolved: STATUS_META.resolved.description,
};

export default function App() {
  const bmkg = useBMKG();
  const weather = useWeather();
  const peta = usePetaBencana();
  const [demo, setDemo] = useState(false);
  const [query, setQuery] = useState('');
  const [layer, setLayer] = useState<'all' | 'humanies' | 'bmkg' | 'weather' | 'petabencana'>('all');
  const humanies = useMemo(() => demo ? showcaseEvents : [...events, ...disasters.filter(e => e.incidentStatus === 'resolved')], [demo]);
  const reports = useMemo(() => PETABENCANA_CONFIG.enabled ? demo ? petaBencanaDemoReports : peta.events : [], [demo, peta.events]);
  const allEvents = useMemo(() => [...humanies, ...bmkg.events, ...weather.events, ...reports], [humanies, bmkg.events, weather.events, reports]);
  const mapEvents = useMemo(() => allEvents.filter(hasPosition), [allEvents]);
  const humaniesCounts = useMemo(() => STATUS_ORDER.reduce((acc, status) => ({ ...acc, [status]: humanies.filter(e => e.incidentStatus === status).length }), {} as Record<MapStatus, number>), [humanies]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isWide = useMediaQuery('(min-width: 1200px)');
  const isTablet = useMediaQuery('(max-width: 1023px)');
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  const matches = useCallback((...values: string[]) => values.join(' ').toLocaleLowerCase('id').includes(query.trim().toLocaleLowerCase('id')), [query]);
  const visibleEvents = useMemo(() => layer !== 'all' && layer !== 'humanies' ? [] : humanies.filter(e => (filter === 'all' ? e.incidentStatus !== 'resolved' : e.incidentStatus === filter) && matches(e.title, e.province, e.city)), [humanies, filter, layer, matches]);
  const earthquakes = useMemo(() => bmkg.events.filter(e => matches(e.region, 'gempa earthquake')), [bmkg.events, matches]);
  const warnings = useMemo(() => weather.events.filter(e => matches(e.title, e.region)), [weather.events, matches]);
  const communityReports = useMemo(() => reports.filter(e => matches(e.title, e.disasterType, reportTypeLabel(e.disasterType), e.city ?? '', e.regionCode ?? '')), [reports, matches]);
  const visibleIds = useMemo(() => new Set([...visibleEvents, ...(layer === 'all' || layer === 'bmkg' ? earthquakes : []), ...(layer === 'all' || layer === 'weather' ? warnings : []), ...(layer === 'all' || layer === 'petabencana' ? communityReports : [])].map(e => e.id)), [visibleEvents, earthquakes, warnings, communityReports, layer]);
  const selectedEvent = allEvents.find(e => e.id === selectedId && visibleIds.has(e.id)) ?? null;
  useEffect(() => { if (selectedId && !selectedEvent) setSelectedId(null); }, [selectedId, selectedEvent]);
  const handleFilter = useCallback((next: StatusFilter) => { setFilter(next); setSelectedId(null); }, []);
  const exploreDemo = () => { setDemo(!demo); setLayer('humanies'); setFilter('all'); setQuery(''); setSelectedId(null); };

  const handleClose = useCallback(() => setSelectedId(null), []);

  const toastTimer = useRef<number | undefined>(undefined);
  const notify = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = window.setTimeout(() => setToast(null), 4200);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Site navigation outside Disaster Watch is not part of this preview.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[data-placeholder]');
      if (!link) return;
      e.preventDefault();
      notify('Prototype — only Disaster Watch is part of this preview.');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [notify]);

  const overviewInsets: MapInsets = useMemo(() => isMobile
    ? { top: 24, right: 16, left: 16, bottom: 24 }
    : { top: 40, bottom: 40, left: (isWide ? PANEL_WIDTH.wide : PANEL_WIDTH.narrow) + GUTTER * 2, right: 48 }, [isMobile, isWide]);

  const insets: MapInsets = useMemo(() => {
    if (isMobile) {
      return {
        top: 24,
        right: 16,
        left: 16,
        bottom: selectedId ? Math.round(window.innerHeight * 0.42) : 24,
      };
    }
    const panel = (isWide ? PANEL_WIDTH.wide : PANEL_WIDTH.narrow) + GUTTER * 2;
    return {
      top: 40,
      bottom: 40,
      left: selectedId && isTablet ? 40 : panel,
      right: selectedId ? DRAWER_WIDTH + GUTTER * 2 : 48,
    };
  }, [isMobile, isWide, isTablet, selectedId]);

  return (
    <>
      <a className="skip-link" href="#situations">
        Skip to list of situations
      </a>
      <SiteHeader />
      <main>
        <Hero counts={counts} updatedLabel={updatedLabel} />

        <section className="showcase-intro" aria-label="How Disaster Watch works">
          <div><p className="data-label">Discover → Understand → Respond → Donate → See Impact</p><p>Kenali situasi, lihat respons, dukung campaign resmi, dan ikuti laporannya.</p></div>
          <button className="btn btn--secondary" type="button" aria-pressed={demo} onClick={exploreDemo}>{demo ? 'Kembali ke data sumber' : 'Explore Demo'}</button>
          {demo && <p className="sim-notice">DEMO aktif · empat skenario Humanies fiktif. Pilih PetaBencana untuk contoh laporan simulasi. Data BMKG tetap berasal dari sumber resmi dan tidak diubah.</p>}
        </section>
        <section className="watch" id="watch" aria-label="Disaster Watch map">
          <div className={`stage${selectedId ? ' has-selection' : ''}`}>
            <div className="stage__panel" id="situations">
              <div className="stage__panel-head">
                <h2 className="stage__panel-title">Situations</h2>
                <p className="stage__panel-hint" key={filter}>
                  {layer === 'petabencana' ? 'Laporan komunitas/platform, terpisah dari respons Humanies. Status mengikuti sumber.' : layer === 'weather' ? 'Peringatan potensi cuaca dari BMKG. Pilih wilayah untuk melihat masa berlaku.' : layer === 'bmkg' ? 'Informasi gempa dari BMKG. Pilih kejadian untuk melihat sumber dan waktunya.' : FILTER_HINT[filter]}
                </p>
              </div>
              <div className="stage__filter">
                <div className="layer-filter" role="group" aria-label="Map data source">
                  {(['all', 'humanies', 'bmkg', 'weather', 'petabencana'] as const).filter(l => (l !== 'bmkg' || BMKG_CONFIG.enabled) && (l !== 'weather' || WEATHER_CONFIG.enabled) && (l !== 'petabencana' || PETABENCANA_CONFIG.enabled)).map(l => <button type="button" key={l} aria-pressed={layer === l} onClick={() => { setLayer(l); setSelectedId(null); }}>{l === 'all' ? 'All' : l === 'humanies' ? 'Humanies' : l === 'bmkg' ? 'Earthquakes' : l === 'weather' ? 'Weather Warnings' : 'PetaBencana'}</button>)}
                </div>
                <label className="location-search">Cari lokasi atau kejadian<input type="search" placeholder="Provinsi, kota, atau judul…" value={query} onChange={e => { setQuery(e.target.value); setSelectedId(null); }} /></label>
                {(layer === 'all' || layer === 'humanies') && <><p className="data-label">{demo ? 'DEMO / SIMULATED DATA' : 'HUMANIES MANAGED DATA'}</p><FilterBar value={filter} counts={humaniesCounts} total={humanies.filter(e => e.incidentStatus !== 'resolved').length} archived={humanies.filter(e => e.incidentStatus === 'resolved').length} onChange={handleFilter} /></>}
              </div>
              <div className="stage__list" key={`${layer}-${filter}`}>
                {BMKG_CONFIG.enabled && (layer === 'all' || layer === 'bmkg') && <div className="bmkg-status" role="status">
                  {bmkg.status === 'loading' && <p>Memuat informasi gempa BMKG...</p>}
                  {bmkg.status === 'error' && <p>Informasi gempa BMKG sementara tidak dapat diperbarui.</p>}
                  {bmkg.fetchedAt && <p>Terakhir berhasil diambil: {formatWIB(bmkg.fetchedAt)}{bmkg.stale ? ' · Data tersimpan, belum diperbarui.' : ''}</p>}
                </div>}
                {(layer === 'all' || layer === 'humanies') && <SituationList
                  events={visibleEvents}
                  selectedId={selectedId}
                  hoveredId={hoveredId}
                  onSelect={setSelectedId}
                  onHover={setHoveredId}
                />}
                {BMKG_CONFIG.enabled && (layer === 'all' || layer === 'bmkg') && <><BMKGList events={earthquakes} selectedId={selectedId} onSelect={setSelectedId} /><div className="bmkg-status"><BMKGDisclaimer /></div></>}
                {WEATHER_CONFIG.enabled && (layer === 'all' || layer === 'weather') && <WeatherList events={warnings} status={weather.status} fetchedAt={weather.fetchedAt} stale={weather.stale} onSelect={setSelectedId} />}
                {PETABENCANA_CONFIG.enabled && (layer === 'all' || layer === 'petabencana') && <PetaBencanaList key={`peta-${demo}-${query}`} events={communityReports} status={peta.status} fetchedAt={peta.fetchedAt} stale={peta.stale} demo={demo} selectedId={selectedId} onSelect={setSelectedId} />}
              </div>
            </div>

            <div className="stage__map">
              <MapViewport
                events={mapEvents}
                visibleIds={visibleIds}
                selectedId={selectedId}
                hoveredId={hoveredId}
                insets={insets}
                overviewInsets={overviewInsets}
                onReset={handleClose}
                reducedMotion={reducedMotion}
                isMobile={isMobile}
                onSelect={setSelectedId}
                onHover={setHoveredId}
              />
            </div>

            <DetailDrawer event={selectedEvent} onClose={handleClose} onAction={notify} fetchedAt={bmkg.fetchedAt} stale={bmkg.stale} weatherFetchedAt={weather.fetchedAt} weatherStale={weather.stale} petaFetchedAt={peta.fetchedAt} petaStale={peta.stale} />
          </div>
        </section>

        <CampaignsSection />
        <ProgramsTeaser />
        <StoriesTeaser />
        <SupportBand />
      </main>
      <SiteFooter />
      <Toast toast={toast} />
    </>
  );
}
