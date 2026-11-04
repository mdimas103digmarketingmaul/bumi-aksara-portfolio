import { ReportIcon } from '../PetaBencanaInformation';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { isBMKG, isWeather, isHumanies, isPetaBencana, type PositionedEvent } from '../../types/bmkg';
import { Activity, CloudLightning } from 'lucide-react';
import { INDONESIA_BOUNDS, MAX_BOUNDS, mapStyle } from './mapStyle';
import { useEventMarkers } from './useEventMarkers';
import { EventMarker } from './EventMarker';
import { MapControls } from './MapControls';
import './map.css';
import { useWeatherOverlay } from './useWeatherOverlay';

// Vite pre-bundles maplibre-gl, which breaks its default worker lookup
// (resolved next to the module). Point it at the self-contained worker file.
maplibregl.setWorkerUrl(maplibreWorkerUrl);

/** Space (px) the camera should keep clear for UI floating over the map. */
export interface MapInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface DisasterMapProps {
  events: PositionedEvent[];
  visibleIds: Set<string>;
  selectedId: string | null;
  hoveredId: string | null;
  insets: MapInsets;
  overviewInsets: MapInsets;
  onReset: () => void;
  reducedMotion: boolean;
  isMobile: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

/** Copy for MapLibre's cooperative-gesture hint (styled as a quiet pill in map.css). */
const GESTURE_HINTS = {
  'CooperativeGesturesHandler.WindowsHelpText': 'Use Ctrl + scroll to zoom',
  'CooperativeGesturesHandler.MacHelpText': 'Use ⌘ + scroll to zoom',
  'CooperativeGesturesHandler.MobileHelpText': 'Use two fingers to move the map',
};

export const DisasterMap = memo(function DisasterMap({
  events,
  visibleIds,
  selectedId,
  hoveredId,
  insets,
  overviewInsets,
  onReset,
  reducedMotion,
  isMobile,
  onSelect,
  onHover,
}: DisasterMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Latest values for use inside map callbacks without re-running effects.
  const insetsRef = useRef(insets);
  insetsRef.current = insets;
  const overviewRef = useRef(overviewInsets);
  overviewRef.current = overviewInsets;
  const eventsRef = useRef(events);
  eventsRef.current = events;
  const motionRef = useRef(reducedMotion);
  motionRef.current = reducedMotion;

  /* ── Initialise once ─────────────────────────────────────────── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const instance = new maplibregl.Map({
      container,
      style: mapStyle,
      bounds: INDONESIA_BOUNDS,
      fitBoundsOptions: { padding: overviewRef.current },
      maxBounds: MAX_BOUNDS,
      minZoom: 2,
      maxZoom: 11,
      renderWorldCopies: false,
      dragRotate: false,
      pitchWithRotate: false,
      // Plain wheel / one-finger swipe scrolls the page; ⌘/Ctrl + scroll, trackpad
      // pinch or two fingers move the map. Drag-to-pan with a mouse is unaffected.
      cooperativeGestures: true,
      locale: GESTURE_HINTS,
      attributionControl: { compact: true },
      fadeDuration: 200,
    });
    instance.touchZoomRotate.disableRotation();
    instance.keyboard.disableRotation();
    instance.once('load', () => {
      setIsLoaded(true);
      // On phones, start with attribution collapsed to its (i) button.
      if (isMobile) {
        container.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show');
      }
    });
    // Reveal anyway if the tile service is slow, so the stage is never blank.
    const revealFallback = window.setTimeout(() => setIsLoaded(true), 2500);
    setMap(instance);

    return () => {
      window.clearTimeout(revealFallback);
      instance.remove();
      setMap(null);
      setIsLoaded(false);
    };
    // Map is created once; isMobile is read at creation time only.
  }, []);

  const containers = useEventMarkers(map, events);
  useWeatherOverlay(map, events, visibleIds);

  /* ── Camera: fly to the selected event ───────────────────────── */
  useEffect(() => {
    if (!map || !selectedId) return;
    const event = eventsRef.current.find((e) => e.id === selectedId);
    if (!event) return;
    if (isWeather(event) && event.polygons.length) {
      const bounds = new maplibregl.LngLatBounds();
      event.polygons.flat().forEach(p => bounds.extend(p));
      map.fitBounds(bounds, { padding: insetsRef.current, maxZoom: 5.8, duration: motionRef.current ? 0 : 1000 });
      return;
    }
    // `offset` (not `padding`) so nothing persists on the map transform and
    // later fitBounds calls are not double-padded.
    const { top, right, bottom, left } = insetsRef.current;
    map.flyTo({
      center: [event.longitude, event.latitude],
      zoom: 5.8,
      offset: [(left - right) / 2, (top - bottom) / 2],
      duration: motionRef.current ? 0 : 1000,
      curve: 1.25,
      essential: true,
    });
  }, [map, selectedId]);

  // Filters, search and background data refresh deliberately preserve the camera.
  // Only selecting an event or Reset View moves it programmatically.

  const resetView = useCallback(() => {
    onReset();
    map?.fitBounds(INDONESIA_BOUNDS, {
      padding: overviewRef.current,
      duration: reducedMotion ? 0 : 1100,
      essential: true,
    });
  }, [map, reducedMotion, onReset]);

  const byId = useMemo(() => new Map(events.map(e => [e.id, e])), [events]);

  const activeOrder = useMemo(() => {
    const order = new Map<string, number>();
    events.filter((e) => isHumanies(e) && e.incidentStatus === 'active-response').forEach((e, i) => order.set(e.id, i));
    return order;
  }, [events]);

  // Keep the hovered / selected marker above its neighbours.
  useEffect(() => {
    containers.forEach((el, id) => {
      const event = eventsRef.current.find(e => e.id === id);
      el.style.zIndex = id === selectedId ? '5' : id === hoveredId ? '6' : event && isHumanies(event) ? '2' : '1';
    });
  }, [containers, selectedId, hoveredId]);

  return (
    <div className={`map-shell${isLoaded ? ' is-loaded' : ''}`}>
      <div
        ref={containerRef}
        className="map-canvas"
        role="region"
        aria-label="Map of Indonesia showing disaster alerts and Humanies responses. Use the list of situations for a text alternative."
      />
      {[...containers].map(([id, element]) => {
        const event = byId.get(id);
        if (!event) return null;
        return createPortal(
          isPetaBencana(event) ? <button type="button" className={`bmkg-marker peta-marker${id === selectedId ? ' is-selected' : ''}${event.simulated ? ' is-demo' : ''}`} hidden={!visibleIds.has(id)} aria-label={`${event.simulated ? 'DEMO ' : ''}PetaBencana: ${event.title}, ${event.city ?? event.regionCode ?? 'lokasi laporan'}`} aria-pressed={id === selectedId} onClick={() => onSelect(id)} onMouseEnter={() => onHover(id)} onMouseLeave={() => onHover(null)} onFocus={() => onHover(id)} onBlur={() => onHover(null)}><ReportIcon type={event.disasterType} size={14} /></button> : isWeather(event) ? <button type="button" className="bmkg-marker weather-marker" hidden={!visibleIds.has(id)} aria-label={`Weather warning BMKG: ${event.region}`} aria-pressed={id === selectedId} onClick={() => onSelect(id)}><CloudLightning size={16} aria-hidden="true" /></button> : isBMKG(event) ? <button type="button" className={`bmkg-marker${id === selectedId ? ' is-selected' : ''}`} hidden={!visibleIds.has(id)} aria-label={`BMKG: M ${event.magnitude}, ${event.region}`} aria-pressed={id === selectedId} onClick={() => onSelect(id)} onMouseEnter={() => onHover(id)} onMouseLeave={() => onHover(null)}><Activity size={16} aria-hidden="true" /></button> : <EventMarker
            event={event}
            pulseIndex={activeOrder.get(id) ?? 0}
            isSelected={id === selectedId}
            isHovered={id === hoveredId}
            isDimmed={selectedId !== null && id !== selectedId}
            isHidden={!visibleIds.has(id)}
            onSelect={onSelect}
            onHover={onHover}
          />,
          element,
          id,
        );
      })}
      <MapControls
        onZoomIn={() => map?.zoomIn({ duration: reducedMotion ? 0 : 350 })}
        onZoomOut={() => map?.zoomOut({ duration: reducedMotion ? 0 : 350 })}
        onReset={resetView}
      />
    </div>
  );
});
