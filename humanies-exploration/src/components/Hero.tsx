import { ArrowDown } from 'lucide-react';
import type { MapStatus } from '../types/disaster';
import { STATUS_META, STATUS_ORDER } from '../lib/status';
import { SparkleCluster, StatusGlyph } from './ui/icons';

interface HeroProps {
  counts: Record<MapStatus, number>;
  updatedLabel: string;
}

export function Hero({ counts, updatedLabel }: HeroProps) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__lead">
          <p className="hero__eyebrow">
            <span className="hero__live" aria-hidden="true" />
            Humanies Bersiaga · Disaster Watch
          </p>
          <h1 id="hero-title" className="hero__title">
            Know where help is needed. <span className="hero__title-line">Then move together.</span>
            <SparkleCluster className="hero__sparkle" size={56} />
          </h1>
          <p className="hero__copy">
            Disaster alerts and Humanies responses across Indonesia, in one place — so you can see what is
            happening and where your support goes.
          </p>
          <div className="hero__actions">
            <a href="#watch" className="btn btn--primary">
              Explore the map <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
            </a>
            <a href="#programs" className="btn btn--secondary">
              About Humanies Bersiaga
            </a>
          </div>
        </div>

        <div className="hero__aside">
          {/* Echoes the "Humanies In Number" cards on the live homepage. */}
          <ul className="hero__stats" aria-label="Current situations">
            {STATUS_ORDER.map((status) => (
              <li key={status} className={`stat-card stat-card--${status}`}>
                <strong className="stat-card__value">{counts[status]}</strong>
                <span className="stat-card__label">
                  <StatusGlyph status={status} size={13} />
                  {STATUS_META[status].plural}
                </span>
              </li>
            ))}
          </ul>
          <p className="hero__meta">
            <span className="hero__badge">Real events · Active Response simulated</span>
            <span>Updated {updatedLabel}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
