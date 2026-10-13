import { PARTNERSHIP_URL } from '../data';
import root from '../root.module.css';
import s from './Partnership.module.css';

export function Partnership() {
  return (
    <section id="kemitraan" className={s.section} aria-labelledby="o1-partner-title">
      <div className={`${root.wrap} ${s.panel}`}>
        <div className={s.copy}>
          <p className={s.badge}>Road to 200 Outlets</p>
          <h2 id="o1-partner-title" className={`${root.h2} ${s.title}`}>Miliki outletmu sendiri</h2>
          <p className={s.text}>Mari bermitra bersama MammaRoti dan hadirkan coffee bun favorit di kotamu. Mulai langkahmu memiliki outlet sendiri, tumbuh bersama kami, dan bagikan kehangatan di setiap gigitan.</p>
          <a className={`${root.btn} ${s.cta}`} href={PARTNERSHIP_URL} target="_blank" rel="noopener noreferrer">Hubungi Kami</a>
        </div>
        <figure className={s.map}>
          <img src="/images/outlet-map.webp" alt="Peta Indonesia dengan penanda lokasi outlet MammaRoti" width={1140} height={490} loading="lazy" />
        </figure>
      </div>
    </section>
  );
}
