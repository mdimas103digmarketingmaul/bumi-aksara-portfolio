import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import type { DisasterEvent } from '../../types/disaster';
import { INDONESIA_BOUNDS, MAX_BOUNDS, mapStyle } from './mapStyle';
import { useEventMarkers } from './useEventMarkers';
import { EventMarker } from './EventMarker';
import { MapControls } from './MapControls';
import './map.css';

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

interface DisasterMapProps {
  events: DisasterEvent[];
  visibleIds: Set<string>;
  selectedId: string | null;
  hoveredId: string | null;
  insets: MapInsets;
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

function boundsOf(events: DisasterEvent[]) {
  const bounds = new maplibregl.LngLatBounds();
  events.forEach((e) => bounds.extend([e.longitude, e.latitude]));
  return bounds;
}

export function DisasterMap({
  events,
  visibleIds,
  selectedId,
  hoveredId,
  insets,
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

  /* ── Initialise once ─────────────────────────────────────────── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const instance = new maplibregl.Map({
      container,
      style: mapStyle,
      bounds: INDONESIA_BOUNDS,
      fitBoundsOptions: { padding: insetsRef.current },
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

  /* ── Camera: fly to the selected event ───────────────────────── */
  useEffect(() => {
    if (!map || !selectedId) return;
    const event = events.find((e) => e.id === selectedId);
    if (!event) return;
    // `offset` (not `padding`) so nothing persists on the map transform and
    // later fitBounds calls are not double-padded.
    const { top, right, bottom, left } = insetsRef.current;
    map.flyTo({
      center: [event.longitude, event.latitude],
      zoom: Math.max(map.getZoom(), 6.2),
      offset: [(left - right) / 2, (top - bottom) / 2],
      duration: reducedMotion ? 0 : 1300,
      curve: 1.25,
      essential: true,
    });
  }, [map, selectedId, events, reducedMotion]);

  /* ── Camera: frame the filtered set ──────────────────────────── */
  const isFirstFilter = useRef(true);
  useEffect(() => {
    if (!map) return;
    if (isFirstFilter.current) {
      isFirstFilter.current = false;
      return;
    }
    if (selectedId) return;
    const visible = events.filter((e) => visibleIds.has(e.id));
    if (visible.length === 0) return;
    const showAll = visible.length === events.length;
    const extra = showAll ? 0 : 60;
    map.fitBounds(showAll ? INDONESIA_BOUNDS : boundsOf(visible), {
      padding: {
        top: insetsRef.current.top + extra,
        right: insetsRef.current.right + extra,
        bottom: insetsRef.current.bottom + extra,
        left: insetsRef.current.left + extra,
      },
      maxZoom: 5.6,
      duration: reducedMotion ? 0 : 1100,
      essential: true,
    });
    // Only re-frame when the filter itself changes.
  }, [map, visibleIds]);

  const resetView = useCallback(() => {
    map?.fitBounds(INDONESIA_BOUNDS, {
      padding: insetsRef.current,
      duration: reducedMotion ? 0 : 1100,
      essential: true,
    });
  }, [map, reducedMotion]);

  const activeOrder = useMemo(() => {
    const order = new Map<string, number>();
    events.filter((e) => e.incidentStatus === 'active-response').forEach((e, i) => order.set(e.id, i));
    return order;
  }, [events]);

  // Keep the hovered / selected marker above its neighbours.
  useEffect(() => {
    containers.forEach((el, id) => {
      el.style.zIndex = id === selectedId ? '3' : id === hoveredId ? '4' : '';
    });
  }, [containers, selectedId, hoveredId]);

  return (
    <div className={`map-shell${isLoaded ? ' is-loaded' : ''}`}>
      <div
        ref={containerRef}
        className="map-canvas"
        role="region"
        aria-label="Map of Indonesia showing disaster alerts and Rangkul responses. Use the list of situations for a text alternative."
      />
      {[...containers].map(([id, element]) => {
        const event = events.find((e) => e.id === id);
        if (!event) return null;
        return createPortal(
          <EventMarker
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
}
