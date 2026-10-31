import { BrandMark } from './ui/icons';

const EXPLORE = ['Tentang Rangkul', 'Program Kami', 'Cerita Dampak', 'Disaster Watch', 'FAQ'];
const CONTACT = ['Email', 'Instagram', 'X / Twitter'];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <BrandMark className="site-footer__mark" size={84} />
        <nav className="site-footer__col" aria-label="Explore">
          <p className="site-footer__heading">Explore</p>
          <ul>
            {EXPLORE.map((item) => (
              <li key={item}>
                <a href={item === 'Disaster Watch' ? '#watch' : '#'} data-placeholder={item === 'Disaster Watch' ? undefined : true}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <nav className="site-footer__col" aria-label="Contact">
          <p className="site-footer__heading">Contact</p>
          <ul>
            {CONTACT.map((item) => (
              <li key={item}>
                <a href="#" data-placeholder>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="site-footer__about">
          <p>Rangkul Project adalah gerakan anak muda untuk kemanusiaan, pendidikan dan tanggap bencana.</p>
          <p className="site-footer__copy">© 2026 Rangkul Project · brand fiktif</p>
        </div>
      </div>
      <div className="site-footer__note">
        <p>
          <strong>Portfolio concept.</strong> Rangkul Project is a fictional brand created to present this
          Disaster Watch proposal. Disaster events and figures are compiled from public BNPB, BPBD, PVMBG and
          news reports as of 31 October 2026; all responses, campaigns and stories are simulated. Links are
          disabled in this preview.
        </p>
      </div>
    </footer>
  );
}
