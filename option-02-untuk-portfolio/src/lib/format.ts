import type { IndonesianTimeZone } from '../types/disaster';

const IANA_ZONE: Record<IndonesianTimeZone, string> = {
  WIB: 'Asia/Jakarta',
  WITA: 'Asia/Makassar',
  WIT: 'Asia/Jayapura',
};

const countFormat = new Intl.NumberFormat('en-US');

/** 2140 → "2,140" */
export const formatCount = (value: number) => countFormat.format(value);

/** "2026-10-30" → "30 October 2026" */
export function formatEventDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** "2026-10-30" → "30 Oct"; dates outside the current year keep it: "26 Nov 2025". */
export function formatShortDate(isoDate: string) {
  const date = new Date(`${isoDate}T12:00:00Z`);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: date.getUTCFullYear() === new Date().getUTCFullYear() ? undefined : 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * ISO timestamp → "31 Oct · 00:42 WIB", rendered in the event's local zone.
 * A plain date ("2026-10-31") has no time to show → "31 Oct 2026".
 */
export function formatUpdated(isoTimestamp: string, zone: IndonesianTimeZone = 'WIB') {
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoTimestamp)) {
    return new Date(`${isoTimestamp}T12:00:00Z`).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }
  const date = new Date(isoTimestamp);
  const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: IANA_ZONE[zone] });
  const time = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: IANA_ZONE[zone],
  });
  return `${day} · ${time} ${zone}`;
}
