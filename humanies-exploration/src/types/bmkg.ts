import type { PetaBencanaReport } from './petabencana';
import type { WeatherWarning } from './weather';
import type { DisasterEvent } from './disaster';
export interface BMKGEarthquake {
  id: string;
  source: 'BMKG';
  sourceType: 'earthquake';
  eventDateTime: string;
  latitude: number;
  longitude: number;
  magnitude: number;
  depthKm?: number;
  region: string;
  tsunamiPotential?: string;
  feltInformation?: string;
}
export type MapEvent = DisasterEvent | BMKGEarthquake | WeatherWarning | PetaBencanaReport;
export const isBMKG = (event: MapEvent): event is BMKGEarthquake => 'sourceType' in event && event.sourceType === 'earthquake';

export const isWeather = (event: MapEvent): event is WeatherWarning => 'sourceType' in event && event.sourceType === 'weather';
export const isHumanies = (event: MapEvent): event is DisasterEvent => !('sourceType' in event);
export type PositionedEvent = MapEvent & { latitude: number; longitude: number };
export const hasPosition = (event: MapEvent): event is PositionedEvent => Number.isFinite(event.latitude) && Number.isFinite(event.longitude);

export const isPetaBencana = (event: MapEvent): event is PetaBencanaReport => 'sourceType' in event && event.sourceType === 'community-report';
