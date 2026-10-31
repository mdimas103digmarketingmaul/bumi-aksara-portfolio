import { useEffect, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { DisasterEvent } from '../../types/disaster';

/**
 * Creates one MapLibre marker per event and returns the DOM element MapLibre
 * positions for each. React content is portalled into those elements, so the
 * marker visuals stay declarative while MapLibre handles projection.
 */
export function useEventMarkers(map: maplibregl.Map | null, events: DisasterEvent[]) {
  const [containers, setContainers] = useState<Map<string, HTMLElement>>(() => new Map());

  useEffect(() => {
    if (!map) return;

    const markers: maplibregl.Marker[] = [];
    const next = new Map<string, HTMLElement>();

    for (const event of events) {
      const element = document.createElement('div');
      element.className = 'marker-anchor';
      const marker = new maplibregl.Marker({ element, anchor: 'center' })
        .setLngLat([event.longitude, event.latitude])
        .addTo(map);
      markers.push(marker);
      next.set(event.id, element);
    }

    setContainers(next);

    return () => {
      markers.forEach((marker) => marker.remove());
      setContainers(new Map());
    };
  }, [map, events]);

  return containers;
}
