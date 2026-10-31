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
import { DisasterMap, type MapInsets } from './components/map/DisasterMap';
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
};

export default function App() {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isWide = useMediaQuery('(min-width: 1200px)');
  const isTablet = useMediaQuery('(max-width: 1023px)');
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  const visibleEvents = useMemo(
    () => (filter === 'all' ? events : events.filter((e) => e.incidentStatus === filter)),
    [filter],
  );
  const visibleIds = useMemo(() => new Set(visibleEvents.map((e) => e.id)), [visibleEvents]);
  const selectedEvent = events.find((e) => e.id === selectedId) ?? null;

  const handleFilter = useCallback((next: StatusFilter) => {
    setFilter(next);
    setSelectedId((current) => {
      const event = events.find((e) => e.id === current);
      return event && (next === 'all' || event.incidentStatus === next) ? current : null;
    });
  }, []);

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

        <section className="watch" id="watch" aria-label="Disaster Watch map">
          <div className={`stage${selectedId ? ' has-selection' : ''}`}>
            <div className="stage__panel" id="situations">
              <div className="stage__panel-head">
                <h2 className="stage__panel-title">Situations</h2>
                <p className="stage__panel-hint" key={filter}>
                  {FILTER_HINT[filter]}
                </p>
              </div>
              <div className="stage__filter">
                <FilterBar value={filter} counts={counts} total={events.length} onChange={handleFilter} />
              </div>
              <div className="stage__list" key={filter}>
                <SituationList
                  events={visibleEvents}
                  selectedId={selectedId}
                  hoveredId={hoveredId}
                  onSelect={setSelectedId}
                  onHover={setHoveredId}
                />
              </div>
            </div>

            <div className="stage__map">
              <DisasterMap
                events={events}
                visibleIds={visibleIds}
                selectedId={selectedId}
                hoveredId={hoveredId}
                insets={insets}
                reducedMotion={reducedMotion}
                isMobile={isMobile}
                onSelect={setSelectedId}
                onHover={setHoveredId}
              />
            </div>

            <DetailDrawer event={selectedEvent} onClose={handleClose} onAction={notify} />
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
