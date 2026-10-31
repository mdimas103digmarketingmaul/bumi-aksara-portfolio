import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { publicUrl } from '../lib/publicUrl';
import { BrandMotif } from './ui/icons';

/*
 * Just enough surrounding homepage to show Disaster Watch in context.
 * Rangkul Project and everything below is fictional, written for this portfolio
 * concept. Story photos: Freepik stock via Magnific. All links are disabled.
 */

const PROGRAMS = [
  {
    name: 'Rangkul Siaga',
    year: '2026',
    description:
      'Respons bencana Rangkul — posko, dapur umum, logistik dan pemulihan bersama relawan lokal. Disaster Watch adalah wajah publiknya.',
    featured: true,
  },
  {
    name: 'Ruang Suara',
    year: '2026',
    description: 'Forum diskusi anak muda untuk memahami dan menyuarakan isu kebijakan publik.',
  },
  {
    name: 'Telusur Kota',
    year: '2026',
    description: 'Jalan kaki bareng untuk mengenal sejarah, kampung dan komunitas di kota sendiri.',
  },
  {
    name: 'Relawan Rangkul',
    year: '2026',
    description: 'Jalur sukarelawan terbuka: ikut turun tangan di program sosial, kapan pun kamu siap.',
  },
];

const STORIES = [
  {
    image: '/images/stories/story-mangrove.jpg',
    date: '12 Oktober 2026',
    title: 'Seratus Relawan, Seribu Bibit: Cerita dari Pesisir Mangrove',
  },
  {
    image: '/images/stories/story-cleanup.jpg',
    date: '28 September 2026',
    title: 'Bersih-Bersih Pascabanjir Bersama Warga dan Relawan Muda',
  },
  {
    image: '/images/stories/story-children.jpg',
    date: '3 September 2026',
    title: 'Kembali ke Sekolah: Perlengkapan Belajar untuk Anak Penyintas',
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
            Cerita Dampak
          </h2>
          <a href="#" data-placeholder className="btn btn--text">
            Lihat semua cerita <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
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

/** Closing statement band. */
export function SupportBand() {
  return (
    <section className="home-section home-section--band" aria-labelledby="band-title">
      <div className="container">
        <div className="band">
          <BrandMotif className="band__sparkle" size={72} />
          <h2 id="band-title" className="band__title">
            Bergerak bersama,
            <br />
            pulih bersama.
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
