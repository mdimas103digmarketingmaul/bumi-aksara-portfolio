import type { DisasterType, IncidentStatus, MapStatus, MonitoringStatus, Severity } from '../types/disaster';

interface StatusMeta {
  /** Upper-case eyebrow used on tags and in the drawer. */
  label: string;
  /** Plural label for summaries and filters. */
  plural: string;
  /** Short status shown in the situation list. */
  short: string;
  /** Plain-language meaning for the public. */
  description: string;
}

export const STATUS_META: Record<IncidentStatus, StatusMeta> = {
  'active-response': {
    label: 'Active Response',
    plural: 'Active Responses',
    short: 'Active Response',
    description: 'Humanies teams are responding on the ground.',
  },
  alert: {
    label: 'Disaster Alert',
    plural: 'Alerts',
    short: 'Monitoring',
    description: 'A disaster has been reported. Humanies is monitoring, not yet responding.',
  },
  recovery: {
    label: 'Recovery Phase',
    plural: 'Recovery',
    short: 'Recovery',
    description: 'The emergency phase has passed, but recovery efforts are still ongoing.',
  },
  resolved: {
    label: 'Resolved',
    plural: 'Resolved',
    short: 'Resolved',
    description: 'The Humanies response has finished. Kept as a historical record.',
  },
};

/**
 * Order used anywhere statuses are listed. Active first — it is the most important.
 * Resolved cases stay in the data but are not part of the map, list or filters.
 */
export const STATUS_ORDER: MapStatus[] = ['active-response', 'alert', 'recovery'];

export const isMapStatus = (status: IncidentStatus): status is MapStatus => status !== 'resolved';

export const DISASTER_LABEL: Record<DisasterType, string> = {
  'flash-flood': 'Flash flood',
  flood: 'Flood',
  'tidal-flood': 'Tidal flood',
  earthquake: 'Earthquake',
  'volcanic-eruption': 'Volcanic eruption',
  landslide: 'Landslide',
  'forest-fire': 'Forest & land fire',
  'extreme-weather': 'Extreme weather',
  drought: 'Drought',
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
  severe: 'Severe',
};

export const MONITORING_LABEL: Record<MonitoringStatus, string> = {
  monitoring: 'Monitoring',
  assessing: 'Assessing needs',
  escalating: 'Situation escalating',
};
