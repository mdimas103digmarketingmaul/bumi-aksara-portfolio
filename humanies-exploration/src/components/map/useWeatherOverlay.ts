import { useEffect, useMemo, useRef } from 'react';
import type { Map, GeoJSONSource } from 'maplibre-gl';
import type { FeatureCollection, Polygon } from 'geojson';
import { isWeather, type PositionedEvent } from '../../types/bmkg';
export function useWeatherOverlay(map: Map | null, events: PositionedEvent[], visibleIds: Set<string>) {
  const data = useMemo<FeatureCollection<Polygon>>(() => ({ type: 'FeatureCollection', features: events.filter(e => visibleIds.has(e.id)).flatMap(e => isWeather(e) ? e.polygons.map(ring => ({ type: 'Feature' as const, properties: { id: e.id }, geometry: { type: 'Polygon' as const, coordinates: [ring] } })) : []) }), [events, visibleIds]);
  const signature = JSON.stringify(data);
  const last = useRef('');
  useEffect(() => {
    if (!map) return;
    const update = () => {
      if (!map.isStyleLoaded()) return;
      const source = map.getSource('bmkg-weather') as GeoJSONSource | undefined;
      if (source) {
        if (last.current !== signature) source.setData(data);
      } else {
        const before = map.getStyle().layers.find(layer => layer.type === 'symbol')?.id;
        map.addSource('bmkg-weather', { type: 'geojson', data });
        map.addLayer({ id: 'bmkg-weather-fill', type: 'fill', source: 'bmkg-weather', paint: { 'fill-color': '#C78B25', 'fill-opacity': 0.13 } }, before);
        map.addLayer({ id: 'bmkg-weather-line', type: 'line', source: 'bmkg-weather', paint: { 'line-color': '#9C7026', 'line-width': 1, 'line-opacity': 0.5 } }, before);
      }
      last.current = signature;
    };
    update(); map.once('load', update); map.once('idle', update);
    return () => { map.off('load', update); map.off('idle', update); };
  }, [map, signature]);
}
