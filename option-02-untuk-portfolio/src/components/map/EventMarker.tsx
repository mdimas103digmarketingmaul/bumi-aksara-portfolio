import { memo } from 'react';
import type { DisasterEvent } from '../../types/disaster';
import { STATUS_META } from '../../lib/status';
import { BrandMark } from '../ui/icons';

interface EventMarkerProps {
  event: DisasterEvent;
  /** Order among active markers — staggers the pulse so they never beat in sync. */
  pulseIndex: number;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  isHidden: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

function MarkerMark({ status }: { status: DisasterEvent['incidentStatus'] }) {
  if (status === 'active-response') return <BrandMark size={15} />;
  if (status === 'alert') {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <path d="M6 2.2v4.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="6" cy="9.6" r="1.15" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path
        d="M2 8.6 4.8 5.8l1.8 1.8L10 4.2M7.6 4.2H10v2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * A single map marker. Rendered through a React portal into the DOM element
 * that MapLibre positions, so it can be a real, focusable <button>.
 */
export const EventMarker = memo(function EventMarker({
  event,
  pulseIndex,
  isSelected,
  isHovered,
  isDimmed,
  isHidden,
  onSelect,
  onHover,
}: EventMarkerProps) {
  const meta = STATUS_META[event.incidentStatus];
  const classes = [
    'marker',
    `marker--${event.incidentStatus}`,
    isSelected && 'is-selected',
    isHovered && 'is-hovered',
    isDimmed && 'is-dimmed',
    isHidden && 'is-hidden',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      style={{ '--pulse-delay': `${pulseIndex * -0.8}s` } as React.CSSProperties}
      aria-label={`${meta.label}${event.simulated ? ' (simulasi)' : ''}: ${event.title}, ${event.province}`}
      aria-pressed={isSelected}
      tabIndex={isHidden ? -1 : 0}
      aria-hidden={isHidden || undefined}
      onClick={() => onSelect(event.id)}
      onMouseEnter={() => onHover(event.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(event.id)}
      onBlur={() => onHover(null)}
    >
      {event.incidentStatus === 'active-response' && (
        <>
          <span className="marker__pulse" aria-hidden="true" />
          <span className="marker__pulse marker__pulse--late" aria-hidden="true" />
        </>
      )}
      <span className="marker__body" aria-hidden="true">
        <MarkerMark status={event.incidentStatus} />
      </span>
      <span className="marker__label" aria-hidden="true">
        <span className="marker__label-title">{event.title}</span>
        <span className="marker__label-place">{event.province}</span>
      </span>
    </button>
  );
});
