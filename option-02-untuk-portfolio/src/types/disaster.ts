/**
 * Shared data model for Rangkul Disaster Watch.
 *
 * The shape is intentionally flat (one record per event) so it is easy to edit
 * by hand in `src/data/disasters.ts` and can later map 1:1 onto a database row
 * or an API payload.
 */

/**
 * Where the incident sits in the Rangkul lifecycle. Drives marker style and detail layout.
 *
 * - `alert`           — being monitored; Rangkul is not (yet) responding.
 * - `active-response` — Rangkul is actively responding on the ground.
 * - `recovery`        — emergency phase has passed; recovery work continues.
 * - `resolved`        — response finished. Kept as a historical record, hidden from the map.
 */
export type IncidentStatus = 'alert' | 'active-response' | 'recovery' | 'resolved';

/** Statuses shown on the map, in the list and in the filters. */
export type MapStatus = Exclude<IncidentStatus, 'resolved'>;

/**
 * Independent of the incident status (e.g. `recovery` + `open` is valid).
 *
 * - `none`   — no fundraising campaign.
 * - `open`   — campaign is accepting support; the donate CTA is shown.
 * - `closed` — campaign has ended; no donate CTA, even if `actionUrl` is still set.
 */
export type FundraisingStatus = 'none' | 'open' | 'closed';

export type DisasterType =
  | 'flash-flood'
  | 'flood'
  | 'tidal-flood'
  | 'earthquake'
  | 'volcanic-eruption'
  | 'landslide'
  | 'forest-fire'
  | 'extreme-weather'
  | 'drought';

export type Severity = 'low' | 'moderate' | 'high' | 'severe';

/** Indonesian time zones, used to show "last updated" in local time. */
export type IndonesianTimeZone = 'WIB' | 'WITA' | 'WIT';

/** Situation status shown for alerts (no Rangkul response yet). */
export type MonitoringStatus = 'monitoring' | 'assessing' | 'escalating';

export interface RelatedProgram {
  name: string;
  description: string;
  url: string;
}

export interface DisasterEvent {
  /** Unique, URL-safe, e.g. "banjir-sumbar-2026". */
  id: string;
  /** Short event name, e.g. "Banjir Bandang". */
  title: string;
  disasterType: DisasterType;
  province: string;
  /** City or regency (kabupaten/kota). */
  city: string;
  latitude: number;
  longitude: number;

  incidentStatus: IncidentStatus;
  fundraisingStatus: FundraisingStatus;

  /** Date of the event, "YYYY-MM-DD". */
  eventDate: string;
  /** "YYYY-MM-DD", or a full timestamp with offset ("2026-10-31T00:42:00+07:00") to show the time. */
  lastUpdated: string;
  /** Zone used to display a `lastUpdated` timestamp. Defaults to WIB. */
  timeZone?: IndonesianTimeZone;

  /** What happened, in plain language. */
  description: string;
  severity?: Severity;
  affectedPeople?: number;
  displacedPeople?: number;

  /* Rangkul response — only for events Rangkul is (or was) responding to. */
  /** One or two sentences on what Rangkul is doing. */
  responseSummary?: string;
  /** Short, scannable list of what is being delivered. */
  responseItems?: string[];
  /** e.g. "Tim Rangkul Padang" — optional field-team label. */
  responseTeam?: string;

  /* External action — any platform (Mayar, Kitabisa, own page …). */
  /** Opens in a new tab. Only shown while `fundraisingStatus` is "open". */
  actionUrl?: string;
  /** Button text, e.g. "Donate Now". Defaults per status. */
  actionLabel?: string;
  /** Shown under the button as "via …", e.g. "Kitabisa". */
  platform?: string;
  /** Optional campaign name shown in the detail body while fundraising is open. */
  campaignTitle?: string;
  /** Public report; shown as "View Response Report" once fundraising is closed or the case is resolved. */
  reportUrl?: string;

  /* Alert-only */
  monitoringStatus?: MonitoringStatus;

  /* Recovery-only */
  recoveryPhase?: string;
  /** 0–100. Optional; the progress bar is only shown when set. */
  recoveryProgress?: number;
  relatedProgram?: RelatedProgram;

  /** Where the information comes from, e.g. "BNPB via ANTARA". Defaults to "Prototype / Mock data". */
  source?: string;
  /** Link to the source report. Opens in a new tab. */
  sourceUrl?: string;

  /**
   * The disaster is real, but the Rangkul response and campaign on this record
   * are simulated for the prototype. Shown as a "Simulasi" label in the UI.
   */
  simulated?: boolean;
}

export type StatusFilter = 'all' | MapStatus;
