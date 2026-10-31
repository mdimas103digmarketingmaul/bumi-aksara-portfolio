import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { publicUrl } from '../lib/publicUrl';
import { SparkleCluster } from './ui/icons';

/*
 * Just enough surrounding Humanies homepage to show Disaster Watch in context.
 * Programs and stories are taken from the live site (lightly tidied); copy is
 * placeholder for this redesign preview. All links are prototype placeholders.
 */

const PROGRAMS = [
  {
    name: 'Humanies Bersiaga',
    year: '2024',
    description:
      'Inisiatif tanggap bencana Humanies — posko, logistik dan pemulihan bersama relawan lokal. Disaster Watch adalah wajah publiknya.',
    featured: true,
  },
  {
    name: 'Unlock Behind',
    year: '2024',
    description: 'Ruang bagi milenial dan Gen Z untuk membongkar dan memahami isu kebijakan publik.',
  },
  {
    name: 'Jelajah Kota',
    year: '2024',
    description: 'Wadah anak muda Jakarta untuk mengenal lebih dekat tempat-tempat di kotanya dengan cara berbeda.',
  },
  {
    name: 'Volunnies',
    year: '2024',
    description: 'Kegiatan sukarela yang membuka kesempatan bagi siapa saja untuk terlibat di program sosial.',
  },
];

const STORIES = [
  {
    image: '/images/story-kampung-bayam.jpg',
    date: '27 Agustus 2024',
    title: 'Mendobrak Batas Kesulitan: Humanies Project Bantu Warga Kampung Bayam',
  },
  {
    image: '/images/story-kawal-putusan-mk.jpg',
    date: '9 September 2024',
    title: 'Humanies Project Menggerakkan 11 Ribu Donatur untuk #KawalPutusanMK',
  },
  {
    image: '/images/story-mangrove.jpg',
    date: '28 Mei 2025',
    title: 'Menanam Mangrove Bersama Relawan Humanies',
  },
];

export function ProgramsTeaser() {
  return (
    <section className="home-section home-section--tint" id="programs" aria-labelledby="programs-title">
      <div className="container container--narrow">
        <h2 id="programs-title" className="section-title">
          Our Programs
        </h2>
        <ul className="programs">
          {PROGRAMS.map((program) => (
            <li key={program.name}>
              <a href="#" data-placeholder className={`program-row${program.featured ? ' program-row--featured' : ''}`}>
                <span className="program-row__name">
                  {program.name}
                  {program.featured && <span className="program-row__tag">Powers Disaster Watch</span>}
                </span>
                <span className="program-row__year">{program.year}</span>
                <span className="program-row__body">{program.description}</span>
                <ArrowUpRight className="program-row__arrow" size={22} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function StoriesTeaser() {
  return (
    <section className="home-section" aria-labelledby="stories-title">
      <div className="container">
        <div className="section-head">
          <h2 id="stories-title" className="section-title">
            Impact Stories
          </h2>
          <a href="#" data-placeholder className="btn btn--text">
            Lihat semua kisah <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
        <ul className="stories">
          {STORIES.map((story) => (
            <li key={story.title}>
              <a href="#" data-placeholder className="story-card">
                <span className="story-card__media">
                  <img src={publicUrl(story.image)} alt="" loading="lazy" />
                </span>
                <span className="story-card__date">{story.date}</span>
                <span className="story-card__title">{story.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Closing statement band — the live site's signature blue block with sparkles. */
export function SupportBand() {
  return (
    <section className="home-section home-section--band" aria-labelledby="band-title">
      <div className="container">
        <div className="band">
          <SparkleCluster className="band__sparkle" size={72} />
          <h2 id="band-title" className="band__title">
            Terus bergerak!
            <br />
            Karena peduli itu nggak pernah sia-sia.
          </h2>
          <p className="band__copy">
            Every response on the map is carried by donors, volunteers and local partners. Join them.
          </p>
          <div className="band__actions">
            <a href="#" data-placeholder className="btn btn--light">
              Dukung Kami
            </a>
            <a href="#" data-placeholder className="btn btn--ghost-light">
              Jadi Relawan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
