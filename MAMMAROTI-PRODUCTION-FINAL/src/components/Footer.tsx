import { site } from '@/data/site';
import { CONTACT_URL, PARTNERSHIP_URL } from '@/data/content';
import { Logo } from './Logo';
import s from './Footer.module.css';

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.brand}>
          <a href="#beranda" className={s.logoLink} aria-label="MammaRoti — kembali ke atas">
            <Logo variant="lockup" label={null} className={s.logo} />
          </a>
          <address className={s.address}>{site.address}</address>
        </div>
        <nav className={s.col} aria-label="Navigasi footer">
          <h2 className={s.heading}>Jelajahi</h2>
          <ul>
            <li><a className={s.link} href="#beranda">Beranda</a></li>
            <li><a className={s.link} href="#adonan">Our Dough</a></li>
            <li><a className={s.link} href="#menu">Menu</a></li>
            <li><a className={s.link} href="#kemitraan">Kemitraan</a></li>
            <li><a className={s.link} href="#kontak">Kritik &amp; Saran</a></li>
          </ul>
        </nav>
        <div className={s.col}>
          <h2 className={s.heading}>Temukan Kami</h2>
          <ul>
            <li><a className={s.link} href="#outlet">Cari outlet terdekat</a></li>
            <li><a className={s.link} href="#kemitraan">Miliki outletmu sendiri</a></li>
          </ul>
        </div>
        <div className={s.col}>
          <h2 className={s.heading}>Let’s Talk</h2>
          <ul>
            <li><a className={s.link} href={CONTACT_URL} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></li>
            <li><a className={s.link} href={PARTNERSHIP_URL} target="_blank" rel="noopener noreferrer">Tanya kemitraan ↗</a></li>
          </ul>
        </div>
      </div>
      <div className={s.bottom}>
        <p>© 2026 MammaRoti</p>
        <p className={s.tagline}>YOUR EVERYDAY COFFEEBUN</p>
        <a className={s.topLink} href="#beranda">Kembali ke atas <span aria-hidden="true">↑</span></a>
      </div>
      <Logo variant="wheat" label={null} className={s.wheat} />
    </footer>
  );
}
