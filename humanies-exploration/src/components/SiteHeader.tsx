import { publicUrl } from '../lib/publicUrl';

/** Mirrors the live humaniesproject.org navigation; Disaster Watch is the new entry. */
const NAV_ITEMS = [
  { label: 'Beranda' },
  { label: 'Program Kami' },
  { label: 'Disaster Watch', current: true },
  { label: 'Impact Stories' },
  { label: 'Hubungi Kami' },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#" data-placeholder className="site-header__logo" aria-label="Humanies Project — beranda">
          <img src={publicUrl('/brand/humanies-logo.png')} alt="Humanies Project" width={150} height={36} />
        </a>
        <nav className="site-header__nav" aria-label="Main">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.current ? '#watch' : '#'}
                  data-placeholder={item.current ? undefined : true}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#" data-placeholder className="btn btn--primary btn--small">
            Dukung Kami
          </a>
        </nav>
      </div>
    </header>
  );
}
