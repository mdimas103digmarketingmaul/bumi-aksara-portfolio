import { useEffect, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import type { DisasterEvent, IncidentStatus } from '../../types/disaster';
import { DISASTER_LABEL, STATUS_META } from '../../lib/status';
import { safeExternalUrl, type ExternalAction } from '../../lib/actions';
import { formatCount, formatEventDate, formatUpdated } from '../../lib/format';
import { DisasterIcon, StatusGlyph } from '../ui/icons';

/* Small building blocks shared by the detail variants. */

export function StatusTag({ status }: { status: IncidentStatus }) {
  return (
    <span className={`status-tag status-tag--${status}`}>
      <StatusGlyph status={status} size={12} />
      {STATUS_META[status].label}
    </span>
  );
}

export function DetailHeading({ event }: { event: DisasterEvent }) {
  return (
    <header className="detail-heading">
      <p className="detail-heading__type">
        <DisasterIcon type={event.disasterType} size={15} strokeWidth={1.75} />
        {DISASTER_LABEL[event.disasterType]}
      </p>
      <h2 id="drawer-title" className="detail-heading__title" tabIndex={-1}>
        {event.title}
      </h2>
      <p className="detail-heading__place">
        {event.province}
        <span className="detail-heading__city">{event.city}</span>
      </p>
      <dl className="detail-heading__dates">
        <div>
          <dt>Event date</dt>
          <dd>{formatEventDate(event.eventDate)}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{formatUpdated(event.lastUpdated, event.timeZone)}</dd>
        </div>
      </dl>
    </header>
  );
}

export function ImpactStats({ event }: { event: DisasterEvent }) {
  const stats = [
    { value: event.affectedPeople, label: 'People affected' },
    { value: event.displacedPeople, label: 'Displaced' },
  ].filter((s): s is { value: number; label: string } => s.value != null && s.value > 0);

  if (stats.length === 0) return null;

  return (
    <dl className="impact">
      {stats.map((stat) => (
        <div key={stat.label} className="impact__stat">
          <dt className="impact__label">{stat.label}</dt>
          <dd className="impact__value">{formatCount(stat.value)}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="section-label">{children}</h3>;
}

export function ResponseBlock({ event, title = 'Rangkul Response' }: { event: DisasterEvent; title?: string }) {
  const { responseSummary: summary, responseItems: actions = [], responseTeam: team } = event;
  if (!summary && actions.length === 0) return null;
  return (
    <section className="detail-section" aria-labelledby={`${event.id}-response`}>
      <h3 id={`${event.id}-response`} className="section-label">
        {title}
      </h3>
      {summary && <p className="detail-copy">{summary}</p>}
      {actions.length > 0 && (
        <ul className="checklist">
          {actions.map((action) => (
            <li key={action}>
              <Check size={14} strokeWidth={2.25} aria-hidden="true" />
              {action}
            </li>
          ))}
        </ul>
      )}
      {team && <p className="detail-footnote">{team}</p>}
    </section>
  );
}

/** Animates from 0 to `value` shortly after mount, so the fill reads as progress. */
export function ProgressBar({
  value,
  label,
  tone = 'brand',
}: {
  value: number;
  label: string;
  tone?: 'brand' | 'recovery';
}) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div
      className={`progress progress--${tone}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <span className="progress__fill" style={{ transform: `scaleX(${shown / 100})` }} />
    </div>
  );
}

/**
 * External CTA (donation platform, report …). Always a new tab, never passes
 * the opener or referrer. Platform is shown underneath as "via Kitabisa".
 */
export function ExternalActionLink({
  action,
  variant = 'primary',
}: {
  action: ExternalAction;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <>
      <a
        href={action.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn btn--${variant} btn--block btn--external`}
      >
        {action.label}
        <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
        <span className="visually-hidden">
          {action.platform ? ` on ${action.platform}` : ''} (opens in a new tab)
        </span>
      </a>
      {action.platform && (
        <p className="action-platform" aria-hidden="true">
          via {action.platform}
        </p>
      )}
    </>
  );
}

/** Campaign name, shown in the scrolling body while fundraising is open. */
export function CampaignNote({ event }: { event: DisasterEvent }) {
  if (event.fundraisingStatus !== 'open' || !event.campaignTitle) return null;
  return (
    <p className="campaign-note">
      <span>Campaign</span>
      {event.campaignTitle}
    </p>
  );
}

/**
 * Body scrolls; footer ("dock") stays pinned so the key action is always in reach,
 * on the desktop side panel and the mobile bottom sheet alike.
 */
export function DrawerFrame({
  top,
  footer,
  children,
}: {
  top: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="drawer__scroll">
        {top}
        <div className="drawer__body">{children}</div>
      </div>
      {footer && <div className="drawer__dock">{footer}</div>}
    </>
  );
}

export function SourceNote({ event }: { event: DisasterEvent }) {
  const url = safeExternalUrl(event.sourceUrl);
  return (
    <p className="source-note">
      <span>Source</span> {event.source ?? 'Prototype / Mock data'}
      {url && (
        <>
          {' · '}
          <a href={url} target="_blank" rel="noopener noreferrer">
            Read report
            <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </>
      )}
    </p>
  );
}

/**
 * Shown on records whose Rangkul response is simulated on top of a real disaster,
 * so the preview never implies Rangkul is on the ground when it is not.
 */
export function SimulationNotice({ event }: { event: DisasterEvent }) {
  if (!event.simulated) return null;
  return (
    <div className="sim-notice" role="note">
      <span className="sim-tag">Simulasi</span>
      <p>
        The disaster and its figures are real. The Rangkul response and campaign shown here are
        simulated for this prototype — the donate button does not lead to a real campaign.
      </p>
    </div>
  );
}
