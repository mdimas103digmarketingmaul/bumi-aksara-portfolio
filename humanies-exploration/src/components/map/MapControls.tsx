import { Minus, Plus, Scan } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function MapControls({ onZoomIn, onZoomOut, onReset }: MapControlsProps) {
  return (
    <div className="map-controls" role="group" aria-label="Map controls">
      <div className="map-controls__stack">
        <button type="button" className="map-controls__btn" onClick={onZoomIn} aria-label="Zoom in">
          <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <button type="button" className="map-controls__btn" onClick={onZoomOut} aria-label="Zoom out">
          <Minus size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        className="map-controls__btn map-controls__btn--solo"
        onClick={onReset}
        aria-label="Show all of Indonesia"
        title="Show all of Indonesia"
      >
        <Scan size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
}
