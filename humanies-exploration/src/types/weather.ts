export interface WeatherWarning {
  id: string;
  source: 'BMKG';
  sourceType: 'weather';
  title: string;
  region: string;
  description: string;
  instruction?: string;
  issued: string;
  effective: string;
  expires: string;
  urgency: string;
  severity: string;
  certainty: string;
  sourceUrl: string;
  polygons: [number, number][][];
  // Verified point on the first CAP polygon, never a guessed province centroid.
  latitude?: number;
  longitude?: number;
}
