import {
  Activity,
  CloudRainWind,
  Flame,
  Mountain,
  SunDim,
  Tornado,
  Waves,
  type LucideProps,
} from 'lucide-react';
import type { DisasterType, IncidentStatus } from '../../types/disaster';

/*
 * Rangkul Project brand (fictional, for this portfolio concept).
 * Mark: a head held by two embracing arms — "rangkul" means to embrace.
 */

/** The embrace mark. Uses currentColor so it works on light and blue surfaces. */
export function BrandMark({ size = 24, ...rest }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" {...rest}>
      <circle cx="24" cy="15" r="7" fill="currentColor" />
      <path
        d="M8.5 21.5c0 10.6 5.6 18.2 13.2 20M39.5 21.5c0 10.6-5.6 18.2-13.2 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Mark + lowercase wordmark, set in the UI font. */
export function BrandLogo({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <span className={`brand-logo${className ? ` ${className}` : ''}`} style={{ '--logo-size': `${size}px` } as React.CSSProperties}>
      <BrandMark size={size} />
      <span className="brand-logo__word">rangkul</span>
    </span>
  );
}

/** Decorative motif (replaces a star cluster): the mark, an open ring and a dot. */
export function BrandMotif({ size = 64, ...rest }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={(size * 80) / 80} viewBox="0 0 80 80" aria-hidden="true" {...rest}>
      <g transform="translate(4 4) scale(1.05)">
        <circle cx="24" cy="15" r="7" fill="currentColor" />
        <path
          d="M8.5 21.5c0 10.6 5.6 18.2 13.2 20M39.5 21.5c0 10.6-5.6 18.2-13.2 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="6.5"
          strokeLinecap="round"
        />
      </g>
      <circle cx="64" cy="22" r="9" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="62" cy="62" r="5" fill="currentColor" />
    </svg>
  );
}

function Volcano(props: LucideProps) {
  const { size = 24, strokeWidth = 2, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...(rest as React.SVGProps<SVGSVGElement>)}
    >
      <path d="M2 21h20l-6-11h-2l-1.2 2.2L11.5 10H8L2 21Z" />
      <path d="M11 6.5c-.6-1.2-.2-2.6 1-3.5M14.5 7c.3-1.3 1.3-2.2 2.6-2.4" />
    </svg>
  );
}

const DISASTER_ICON: Record<DisasterType, React.ComponentType<LucideProps>> = {
  'flash-flood': CloudRainWind,
  flood: Waves,
  'tidal-flood': Waves,
  earthquake: Activity,
  'volcanic-eruption': Volcano,
  landslide: Mountain,
  'forest-fire': Flame,
  'extreme-weather': Tornado,
  drought: SunDim,
};

export function DisasterIcon({ type, ...props }: { type: DisasterType } & LucideProps) {
  const Icon = DISASTER_ICON[type];
  return <Icon aria-hidden="true" {...props} />;
}

/**
 * Small static version of each map marker. Shape differs per status
 * (circle / diamond / rounded square) so status never relies on colour alone.
 * Resolved (not on the map) gets a quiet check mark.
 */
export function StatusGlyph({ status, size = 14 }: { status: IncidentStatus; size?: number }) {
  return (
    <svg
      className={`status-glyph status-glyph--${status}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      {status === 'active-response' && (
        <>
          <circle cx="8" cy="8" r="7.5" className="status-glyph__fill" />
          <circle cx="8" cy="5.9" r="1.7" fill="#fff" />
          <path d="M4.6 7.6c0 2.3 1.4 3.9 3.4 4.2 2-.3 3.4-1.9 3.4-4.2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {status === 'alert' && (
        <>
          <rect x="2.6" y="2.6" width="10.8" height="10.8" rx="1.6" transform="rotate(45 8 8)" className="status-glyph__fill" />
          <path d="M8 4.9v3.6" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="8" cy="10.9" r="0.95" fill="#fff" />
        </>
      )}
      {status === 'recovery' && (
        <>
          <rect x="1" y="1" width="14" height="14" rx="4" className="status-glyph__fill" />
          <path
            d="M4.4 10.6 7 8l1.7 1.7 3-3.3M9.6 6.4h2.1v2.1"
            fill="none"
            stroke="#3F2B00"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
      {status === 'resolved' && (
        <>
          <circle cx="8" cy="8" r="7.5" className="status-glyph__fill" />
          <path
            d="m5 8.2 2 2 4-4.2"
            fill="none"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
