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

/** The four-point spark from the Humanies wordmark. */
export function Sparkle({ size = 12, ...rest }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...rest}>
      <path
        fill="currentColor"
        d="M12 1.5c.5 5.4 4.8 9.9 10.5 10.5-5.7.6-10 5.1-10.5 10.5C11.5 17.1 7.2 12.6 1.5 12 7.2 11.4 11.5 6.9 12 1.5Z"
      />
    </svg>
  );
}

/**
 * The Humanies sparkle cluster (two filled four-point stars + one outlined),
 * as used beside headlines and on blue bands on humaniesproject.org.
 */
export function SparkleCluster({ size = 64, ...rest }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={(size * 85) / 75} viewBox="0 0 75 85" aria-hidden="true" {...rest}>
      <path
        fill="currentColor"
        d="M25.724.571c.248-.559 1.053-.521 1.249.058 4.021 11.888 13.355 21.222 25.244 25.244.579.195.616 1 .057 1.249l-.326.144C40.949 32.155 32.154 40.95 27.265 51.95l-.093.21c-.289.65-1.211.65-1.5 0C20.723 41.025 11.82 32.122.685 27.173c-.649-.289-.649-1.211 0-1.499l.21-.094C11.895 20.692 20.69 11.896 25.579.897Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeMiterlimit="10"
        d="M72.564 43.869c-5.94 3.142-10.777 8.032-13.858 14.01-3.155-6.063-8.1-11.009-14.163-14.163 5.978-3.081 10.868-7.919 14.01-13.858 2.766 6.247 7.764 11.244 14.011 14.011Z"
      />
      <path
        fill="currentColor"
        d="M39.26 51.015c.16-.361.68-.337.807.037 2.597 7.678 8.625 13.707 16.304 16.304.374.126.398.646.037.806l-.211.094c-7.104 3.157-12.784 8.838-15.942 15.942l-.06.136c-.186.419-.782.419-.968 0-3.196-7.192-8.947-12.942-16.138-16.138-.42-.187-.42-.782 0-.969l.135-.06c7.105-3.157 12.785-8.838 15.942-15.942Z"
      />
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
          <path
            fill="#fff"
            d="M8 3.6c.3 2.3 2.1 4.1 4.4 4.4-2.3.3-4.1 2.1-4.4 4.4-.3-2.3-2.1-4.1-4.4-4.4 2.3-.3 4.1-2.1 4.4-4.4Z"
          />
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
