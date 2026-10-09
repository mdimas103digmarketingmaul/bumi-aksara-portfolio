import { site } from '@/data/site';

export function Footer() {
  return <footer className="footer">
    <div className="footer-wheat footer-wheat-left" aria-hidden="true" /><div className="footer-wheat footer-wheat-right" aria-hidden="true" />
    <div className="footer-company">
      <a href="#beranda" aria-label="MammaRoti — Kembali ke atas"><img src="/logos/mammaroti.webp" alt="MammaRoti" width="763" height="216" loading="lazy" /></a>
      <address>{site.address}</address>
      <a className="email" href={`mailto:${site.email}`}>{site.email}</a>
    </div>
    <div className="footer-locations"><h2>Lokasi kami</h2><div className="footer-city-columns">
      <ul>{['Jakarta', 'Yogja', 'Bandung', 'Surabaya'].map(city => <li key={city}><a href="#outlet">{city}</a></li>)}</ul>
      <ul>{['Bekasi', 'Tanggerang'].map(city => <li key={city}><a href="#outlet">{city}</a></li>)}</ul>
    </div></div>
    <div className="footer-social"><h2>Kontak</h2><ul>{site.social.map(item => <li key={item.name}>{item.href ? <a href={item.href} target="_blank" rel="noopener noreferrer">{item.name}</a> : <span>{item.name}</span>}</li>)}</ul></div>
  </footer>;
}
