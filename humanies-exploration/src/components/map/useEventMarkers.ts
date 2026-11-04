import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { PositionedEvent } from '../../types/bmkg';

/** Reconcile by ID: background updates keep the existing DOM markers and focus. */
export function useEventMarkers(map: maplibregl.Map | null, events: PositionedEvent[]) {
  const markers = useRef(new Map<string, maplibregl.Marker>());
  const [containers, setContainers] = useState<Map<string, HTMLElement>>(() => new Map());
  useEffect(() => () => {
    markers.current.forEach(marker => marker.remove());
    markers.current.clear();
  }, [map]);
  useEffect(() => {
    if (!map) return;
    let changed = false;
    const ids = new Set(events.map(event => event.id));
    markers.current.forEach((marker, id) => {
      if (!ids.has(id)) { marker.remove(); markers.current.delete(id); changed = true; }
    });
    for (const event of events) {
      const existing = markers.current.get(event.id);
      if (existing) {
        const position = existing.getLngLat();
        if (position.lng !== event.longitude || position.lat !== event.latitude) existing.setLngLat([event.longitude, event.latitude]);
      } else {
        const element = document.createElement('div');
        element.className = 'marker-anchor';
        markers.current.set(event.id, new maplibregl.Marker({ element, anchor: 'center' }).setLngLat([event.longitude, event.latitude]).addTo(map));
        changed = true;
      }
    }
    if (changed) setContainers(new Map([...markers.current].map(([id, marker]) => [id, marker.getElement()])));
  }, [map, events]);
  return containers;
}
