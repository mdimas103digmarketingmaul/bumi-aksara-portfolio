import type { StyleSpecification, ExpressionSpecification } from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import indonesiaLand from '../../data/indonesia-land.json';

/**
 * Custom editorial basemap.
 *
 * Vector tiles: OpenFreeMap (OpenMapTiles schema, no API key needed).
 * Only a handful of layers are drawn — land, water, borders, a few labels —
 * so the map reads like a printed atlas rather than a navigation map.
 *
 * Indonesia is tinted slightly darker than its neighbours using a
 * Natural Earth outline placed *below* the water layer, so OSM coastlines
 * stay crisp while the country still stands out.
 */

export const MAP_COLORS = {
  // Cool lavender-greys tuned to the brand palette (#F5F5FE page, #1A2BC3 blue),
  // quiet enough that status markers stay the loudest thing on the map.
  ocean: '#ECEEFB',
  land: '#E3E4EC',
  indonesia: '#D4D7EB',
  countryBorder: '#9CA2C6',
  provinceBorder: '#F4F5FD',
  river: '#E0E4F6',
  road: '#F1F2F9',
  labelCountry: '#646B92',
  labelPlace: '#4E5577',
  labelWater: '#97A0C6',
  halo: '#F0F1FA',
} as const;

const FONT_REGULAR = ['Noto Sans Regular'];
const FONT_ITALIC = ['Noto Sans Italic'];
const FONT_BOLD = ['Noto Sans Bold'];

/** Prefer Indonesian names, fall back to Latin / default. */
const localName: ExpressionSpecification = [
  'coalesce',
  ['get', 'name:id'],
  ['get', 'name:latin'],
  ['get', 'name'],
];

export const mapStyle: StyleSpecification = {
  version: 8,
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: {
    openmaptiles: {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet',
      attribution:
        '<a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    },
    indonesia: {
      type: 'geojson',
      data: indonesiaLand as FeatureCollection,
      attribution: 'Natural Earth',
    },
  },
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': MAP_COLORS.land } },
    {
      id: 'indonesia-tint',
      type: 'fill',
      source: 'indonesia',
      paint: {
        'fill-color': MAP_COLORS.indonesia,
        'fill-antialias': false,
      },
    },
    {
      id: 'water',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'water',
      filter: ['!=', ['get', 'brunnel'], 'tunnel'],
      paint: { 'fill-color': MAP_COLORS.ocean },
    },
    {
      id: 'rivers',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'waterway',
      minzoom: 7,
      filter: ['==', ['get', 'class'], 'river'],
      paint: {
        'line-color': MAP_COLORS.ocean,
        'line-width': ['interpolate', ['linear'], ['zoom'], 7, 0.6, 12, 2],
      },
    },
    {
      id: 'roads-major',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      minzoom: 7,
      filter: ['match', ['get', 'class'], ['motorway', 'trunk', 'primary'], true, false],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': MAP_COLORS.road,
        'line-width': ['interpolate', ['linear'], ['zoom'], 7, 0.5, 12, 2.4],
        'line-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0, 8, 1],
      },
    },
    {
      id: 'province-borders',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      minzoom: 3.5,
      filter: [
        'all',
        ['==', ['get', 'admin_level'], 4],
        ['!=', ['get', 'maritime'], 1],
      ],
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': MAP_COLORS.provinceBorder,
        'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.6, 8, 1.4],
      },
    },
    {
      id: 'country-borders',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      filter: [
        'all',
        ['==', ['get', 'admin_level'], 2],
        ['!=', ['get', 'maritime'], 1],
        ['!=', ['get', 'disputed'], 1],
      ],
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': MAP_COLORS.countryBorder,
        'line-width': ['interpolate', ['linear'], ['zoom'], 3, 0.6, 8, 1.2],
        'line-dasharray': [3, 2],
      },
    },
    {
      id: 'water-names',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'water_name',
      filter: ['match', ['get', 'class'], ['ocean', 'sea'], true, false],
      layout: {
        'text-field': localName,
        'text-font': FONT_ITALIC,
        'text-size': ['interpolate', ['linear'], ['zoom'], 3, 10, 7, 13],
        'text-letter-spacing': 0.18,
        'text-max-width': 6,
        'symbol-placement': 'point',
      },
      paint: {
        'text-color': MAP_COLORS.labelWater,
        'text-halo-color': MAP_COLORS.ocean,
        'text-halo-width': 1,
      },
    },
    {
      id: 'place-towns',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      minzoom: 7,
      filter: ['match', ['get', 'class'], ['town'], true, false],
      layout: {
        'text-field': localName,
        'text-font': FONT_REGULAR,
        'text-size': 11,
        'text-max-width': 8,
      },
      paint: {
        'text-color': MAP_COLORS.labelPlace,
        'text-halo-color': MAP_COLORS.halo,
        'text-halo-width': 1.4,
      },
    },
    {
      id: 'place-cities',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      minzoom: 5,
      filter: [
        'all',
        ['==', ['get', 'class'], 'city'],
        ['<=', ['coalesce', ['get', 'rank'], 99], ['step', ['zoom'], 3, 6, 6, 7, 99]],
      ],
      layout: {
        'text-field': localName,
        'text-font': FONT_REGULAR,
        'text-size': ['interpolate', ['linear'], ['zoom'], 5, 11, 9, 14],
        'text-max-width': 8,
        'text-anchor': 'top',
        'text-offset': [0, 0.4],
        'icon-optional': true,
      },
      paint: {
        'text-color': MAP_COLORS.labelPlace,
        'text-halo-color': MAP_COLORS.halo,
        'text-halo-width': 1.4,
      },
    },
    {
      id: 'place-countries',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      maxzoom: 7,
      filter: ['==', ['get', 'class'], 'country'],
      layout: {
        'text-field': ['upcase', localName],
        'text-font': FONT_BOLD,
        'text-size': ['interpolate', ['linear'], ['zoom'], 3, 9.5, 6, 12],
        'text-letter-spacing': 0.24,
        'text-max-width': 8,
      },
      paint: {
        'text-color': MAP_COLORS.labelCountry,
        'text-halo-color': MAP_COLORS.halo,
        'text-halo-width': 1.2,
        'text-opacity': 0.85,
      },
    },
  ],
};

/** Indonesia, comfortably framed. [west, south], [east, north] */
export const INDONESIA_BOUNDS: [[number, number], [number, number]] = [
  [94.6, -11.2],
  [141.2, 6.2],
];

/**
 * Panning limit — keeps the camera anchored to the region. Generous in latitude
 * so tall, narrow (mobile) viewports can still fit Indonesia's full width.
 */
export const MAX_BOUNDS: [[number, number], [number, number]] = [
  [70, -48],
  [166, 40],
];
