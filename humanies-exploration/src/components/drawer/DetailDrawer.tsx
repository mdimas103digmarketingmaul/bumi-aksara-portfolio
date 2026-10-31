import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { DisasterEvent } from '../../types/disaster';
import { StatusTag } from './parts';
import { ActiveResponseDetail, AlertDetail, RecoveryDetail, ResolvedDetail, type PrototypeAction } from './variants';
import './drawer.css';

interface DetailDrawerProps {
  event: DisasterEvent | null;
  onClose: () => void;
  onAction: PrototypeAction;
}

/**
 * Side panel on desktop, bottom sheet on mobile (pure CSS switch).
 * Keeps the last event rendered while closing so the exit animation has content.
 */
export function DetailDrawer({ event, onClose, onAction }: DetailDrawerProps) {
  const [shown, setShown] = useState<DisasterEvent | null>(event);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const isOpen = event !== null;

  if (event && event !== shown) setShown(event);

  // Move focus into the drawer on open; hand it back on close.
  useEffect(() => {
    if (event) {
      if (!panelRef.current?.contains(document.activeElement)) {
        returnFocusRef.current = document.activeElement as HTMLElement | null;
      }
      panelRef.current?.querySelector('.drawer__scroll')?.scrollTo({ top: 0 });
      panelRef.current?.querySelector<HTMLElement>('#drawer-title')?.focus({ preventScroll: true });
    } else if (panelRef.current?.contains(document.activeElement)) {
      returnFocusRef.current?.focus({ preventScroll: true });
    }
  }, [event]);

  const current = event ?? shown;

  const top = (e: DisasterEvent) => (
    <div className="drawer__top">
      <StatusTag status={e.incidentStatus} />
      <button type="button" className="drawer__close" onClick={onClose} aria-label="Close details">
        <X size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <>
      <div className={`drawer-scrim${isOpen ? ' is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside
        className={`drawer${isOpen ? ' is-open' : ''}${current ? ` drawer--${current.incidentStatus}` : ''}`}
        aria-labelledby={current ? 'drawer-title' : undefined}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="drawer__panel" ref={panelRef}>
          <span className="drawer__grip" aria-hidden="true" />
          {current && (
            <div className="drawer__content" key={current.id}>
              {current.incidentStatus === 'active-response' && (
                <ActiveResponseDetail event={current} top={top(current)} onAction={onAction} />
              )}
              {current.incidentStatus === 'alert' && (
                <AlertDetail event={current} top={top(current)} onAction={onAction} />
              )}
              {current.incidentStatus === 'recovery' && (
                <RecoveryDetail event={current} top={top(current)} onAction={onAction} />
              )}
              {current.incidentStatus === 'resolved' && (
                <ResolvedDetail event={current} top={top(current)} onAction={onAction} />
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
