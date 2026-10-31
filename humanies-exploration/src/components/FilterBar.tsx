import type { MapStatus, StatusFilter } from '../types/disaster';
import { STATUS_META, STATUS_ORDER } from '../lib/status';
import { StatusGlyph } from './ui/icons';

interface FilterBarProps {
  value: StatusFilter;
  counts: Record<MapStatus, number>;
  total: number;
  onChange: (value: StatusFilter) => void;
}

const SHORT_LABEL: Record<MapStatus, string> = {
  'active-response': 'Active',
  alert: 'Alerts',
  recovery: 'Recovery',
};

export function FilterBar({ value, counts, total, onChange }: FilterBarProps) {
  const options: { id: StatusFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: total },
    ...STATUS_ORDER.map((status) => ({ id: status, label: SHORT_LABEL[status], count: counts[status] })),
  ];

  return (
    <div className="filter" role="group" aria-label="Filter situations by status">
      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            className={`filter__option${isActive ? ' is-active' : ''}`}
            aria-pressed={isActive}
            aria-label={
              option.id === 'all'
                ? `All situations, ${option.count}`
                : `${STATUS_META[option.id].plural}, ${option.count}`
            }
            onClick={() => onChange(option.id)}
          >
            {option.id !== 'all' && <StatusGlyph status={option.id} size={12} />}
            <span>{option.label}</span>
            <span className="filter__count" aria-hidden="true">
              {option.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
