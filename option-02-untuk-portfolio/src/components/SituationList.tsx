import type { DisasterEvent } from '../types/disaster';
import { STATUS_META } from '../lib/status';
import { formatShortDate } from '../lib/format';
import { StatusGlyph } from './ui/icons';

interface SituationListProps {
  events: DisasterEvent[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

/**
 * Text alternative to the map and a quick index of every situation.
 * Rows are buttons; hovering a row highlights its marker and vice versa.
 */
export function SituationList({ events, selectedId, hoveredId, onSelect, onHover }: SituationListProps) {
  if (events.length === 0) {
    return <p className="situation-empty">No situations match this filter.</p>;
  }

  return (
    <ol className="situations" aria-label="Situations">
      {events.map((event, index) => (
        <li
          key={event.id}
          className="situations__item"
          style={{ '--i': index } as React.CSSProperties}
        >
          <button
            type="button"
            className={`situation situation--${event.incidentStatus}${event.id === selectedId ? ' is-selected' : ''}${
              event.id === hoveredId ? ' is-hovered' : ''
            }`}
            aria-current={event.id === selectedId ? 'true' : undefined}
            onClick={() => onSelect(event.id)}
            onMouseEnter={() => onHover(event.id)}
            onMouseLeave={() => onHover(null)}
          >
            <StatusGlyph status={event.incidentStatus} size={14} />
            <span className="situation__main">
              <span className="situation__title">
                {event.title}
                {event.simulated && <span className="sim-tag">Simulasi</span>}
              </span>
              <span className="situation__place">{event.province}</span>
            </span>
            <span className="situation__side">
              <span className="situation__date">{formatShortDate(event.eventDate)}</span>
              <span className="situation__meta">{STATUS_META[event.incidentStatus].short}</span>
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}
