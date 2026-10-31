import { BrandLogo } from './ui/icons';

const NAV_ITEMS = [
  { label: 'Beranda' },
  { label: 'Program Kami' },
  { label: 'Disaster Watch', current: true },
  { label: 'Cerita Dampak' },
  { label: 'Hubungi Kami' },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="#" data-placeholder className="site-header__logo" aria-label="Rangkul Project — beranda">
          <BrandLogo size={30} />
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
