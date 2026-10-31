import type { DisasterEvent, IncidentStatus } from '../types/disaster';

/** An external link the user can follow from the detail panel. */
export interface ExternalAction {
  label: string;
  url: string;
  /** Shown as "via …" under the button. */
  platform?: string;
}

const DEFAULT_DONATE_LABEL: Partial<Record<IncidentStatus, string>> = {
  'active-response': 'Support This Response',
  recovery: 'Support Recovery',
};

/** Accept only http(s) links — guards hand-edited data against typos or `javascript:` URLs. */
export function safeExternalUrl(url: string | undefined) {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Donate / support CTA. Only while fundraising is open, and never for alerts or
 * resolved cases — a closed campaign hides the button even if `actionUrl` is still set.
 */
export function getDonateAction(event: DisasterEvent): ExternalAction | null {
  const label = DEFAULT_DONATE_LABEL[event.incidentStatus];
  const url = safeExternalUrl(event.actionUrl);
  if (event.fundraisingStatus !== 'open' || !label || !url) return null;
  return { label: event.actionLabel ?? label, url, platform: event.platform };
}

/** Public response report, if one has been published. */
export function getReportAction(event: DisasterEvent): ExternalAction | null {
  const url = safeExternalUrl(event.reportUrl);
  return url ? { label: 'View Response Report', url } : null;
}
