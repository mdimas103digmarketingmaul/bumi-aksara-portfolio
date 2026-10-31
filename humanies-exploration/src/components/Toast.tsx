import { Info } from 'lucide-react';

export interface ToastMessage {
  id: number;
  message: string;
}

/** Lightweight status message for prototype-only actions. */
export function Toast({ toast }: { toast: ToastMessage | null }) {
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <Info size={16} strokeWidth={1.75} aria-hidden="true" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
