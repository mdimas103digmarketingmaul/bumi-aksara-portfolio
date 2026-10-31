import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CAMPAIGN_CATEGORY_LABEL,
  MAYAR_HOME,
  campaigns,
  type Campaign,
  type CampaignCategory,
} from '../data/campaigns';
import { publicUrl } from '../lib/publicUrl';
import { SparkleCluster } from './ui/icons';

type CategoryFilter = 'all' | CampaignCategory;

// Open campaigns lead; order within each group follows the data file.
const sorted = [...campaigns].sort((a, b) => Number(b.status === 'open') - Number(a.status === 'open'));

const CATEGORY_ORDER = Object.keys(CAMPAIGN_CATEGORY_LABEL) as CampaignCategory[];
const categoryCount = (category: CampaignCategory) => campaigns.filter((c) => c.category === category).length;

/** Branded cover for campaigns without a usable banner — styled like Humanies' own Mayar banners. */
function GeneratedCover({ campaign }: { campaign: Campaign }) {
  return (
    <span className="campaign-cover" aria-hidden="true">
      <img className="campaign-cover__logo" src={publicUrl('/brand/humanies-logo.png')} alt="" width={84} height={20} />
      <span className="campaign-cover__title">{campaign.title}</span>
      <span className="campaign-cover__sub">{CAMPAIGN_CATEGORY_LABEL[campaign.category]}</span>
      <SparkleCluster className="campaign-cover__sparkle" size={34} />
    </span>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const isOpen = campaign.status === 'open';
  return (
    <article className={`campaign-card${isOpen ? ' is-open' : ''}`}>
      <a
        className="campaign-card__link"
        href={campaign.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${campaign.title} — ${isOpen ? 'donasi' : 'lihat campaign'} di Mayar (opens in a new tab)`}
      >
        <span className="campaign-card__media">
          {campaign.image ? (
            <img
              src={publicUrl(campaign.image)}
              alt=""
              loading="lazy"
              style={campaign.imagePosition ? { objectPosition: campaign.imagePosition } : undefined}
            />
          ) : (
            <GeneratedCover campaign={campaign} />
          )}
          <span className={`campaign-card__status campaign-card__status--${campaign.status}`}>
            {isOpen ? 'Masih dibuka' : 'Selesai'}
          </span>
        </span>
        <span className="campaign-card__body">
          <span className={`campaign-chip campaign-chip--${campaign.category}`}>
            {CAMPAIGN_CATEGORY_LABEL[campaign.category]}
          </span>
          <span className="campaign-card__title">{campaign.title}</span>
          {campaign.note && <span className="campaign-card__note">{campaign.note}</span>}
          <span className="campaign-card__foot">
            {isOpen ? (
              <span className="btn btn--primary btn--small btn--external campaign-card__cta">
                Donasi <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
              </span>
            ) : (
              <span className="campaign-card__view">
                Lihat campaign <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
              </span>
            )}
            <span className="campaign-card__via">via Mayar</span>
          </span>
        </span>
      </a>
    </article>
  );
}

/**
 * Real Humanies campaigns from Mayar: category chips filter one horizontal,
 * swipeable row (scroll-snap). Open campaigns first, then the finished ones.
 */
export function CampaignsSection() {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const visible = useMemo(
    () => (filter === 'all' ? sorted : sorted.filter((c) => c.category === filter)),
    [filter],
  );
  const openCount = visible.filter((c) => c.status === 'open').length;

  // Track whether the row can scroll further, to enable/disable the arrows and edge fades.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: 0 });
    const update = () =>
      setEdges({
        start: track.scrollLeft <= 4,
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
      });
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [visible]);

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: 'smooth' });
  };

  const options: { id: CategoryFilter; label: string; count: number }[] = [
    { id: 'all', label: 'Semua', count: campaigns.length },
    ...CATEGORY_ORDER.map((category) => ({
      id: category,
      label: CAMPAIGN_CATEGORY_LABEL[category],
      count: categoryCount(category),
    })),
  ];

  return (
    <section className="home-section campaigns" id="galang-dana" aria-labelledby="campaigns-title">
      <div className="container">
        <div className="section-head campaigns__head">
          <div>
            <p className="section-eyebrow">Galang Dana Humanies</p>
            <h2 id="campaigns-title" className="section-title">
              Setiap kepedulian punya ceritanya.
            </h2>
            <p className="section-lead">
              Dari tanggap bencana sampai pendidikan — kampanye Humanies yang masih berjalan dan yang sudah
              selesai, langsung dari halaman galang dana resmi di Mayar.
            </p>
          </div>
          <a className="btn btn--text" href={MAYAR_HOME} target="_blank" rel="noopener noreferrer">
            Lihat semua di Mayar <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>

        <div className="campaigns__bar">
          <div className="campaigns__chips" role="group" aria-label="Filter kampanye berdasarkan kategori">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`campaigns__chip${option.id === filter ? ' is-active' : ''}`}
                aria-pressed={option.id === filter}
                onClick={() => setFilter(option.id)}
              >
                {option.label}
                <span className="campaigns__chip-count">{option.count}</span>
              </button>
            ))}
          </div>
          <div className="campaigns__nav">
            <button
              type="button"
              className="campaigns__arrow"
              onClick={() => scrollByPage(-1)}
              disabled={edges.start}
              aria-label="Kampanye sebelumnya"
            >
              <ChevronLeft size={18} strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="campaigns__arrow"
              onClick={() => scrollByPage(1)}
              disabled={edges.end}
              aria-label="Kampanye berikutnya"
            >
              <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="campaigns__summary" aria-live="polite">
          {visible.length} kampanye · {openCount > 0 ? `${openCount} masih dibuka` : 'semua sudah selesai'}
        </p>
      </div>

      <div
        className={`campaigns__viewport${edges.start ? '' : ' fade-start'}${edges.end ? '' : ' fade-end'}`}
      >
        <ul className="campaigns__track" ref={trackRef} key={filter}>
          {visible.map((campaign, index) => (
            <li key={campaign.id} className="campaigns__item" style={{ '--i': index } as React.CSSProperties}>
              <CampaignCard campaign={campaign} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
