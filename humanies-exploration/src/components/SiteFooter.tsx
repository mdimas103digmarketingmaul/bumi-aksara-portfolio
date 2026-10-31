import { publicUrl } from '../lib/publicUrl';

const EXPLORE = ['Tentang Humanies', 'Program Kami', 'Impact Stories', 'Disaster Watch', 'FAQ'];
const CONTACT = ['Email', 'Instagram', 'X / Twitter'];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <img className="site-footer__mark" src={publicUrl('/brand/humanies-monogram.png')} alt="" width={120} height={74} />
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
          <p>Humanies Project adalah yayasan yang berfokus pada isu kemanusiaan, demokrasi dan sosial.</p>
          <p className="site-footer__copy">© 2026 Humanies Project</p>
        </div>
      </div>
      <div className="site-footer__note">
        <p>
          <strong>Redesign prototype.</strong> Disaster events and figures are compiled from BNPB, BPBD, PVMBG and
          news reports as of 31 October 2026 and may have changed since. Responses marked “Simulasi” are simulated
          Humanies responses for demonstration; their donate buttons do not lead to real campaigns.
        </p>
      </div>
    </footer>
  );
}
