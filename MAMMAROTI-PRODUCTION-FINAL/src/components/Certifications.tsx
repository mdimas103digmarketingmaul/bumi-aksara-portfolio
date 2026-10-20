import { certificates } from '@/data/content';
import s from './Certifications.module.css';

export function Certifications() {
  return (
    <section className={s.section} aria-labelledby="mr-cert-title">
      <h2 id="mr-cert-title" className={s.srOnly}>Sertifikasi dan penghargaan</h2>
      <ul className={s.list}>
        {certificates.map((c) => (
          <li key={c.src} className={s.item}>
            <span className={s.mark}>
              <img src={c.src} alt={c.alt} width={c.w} height={c.h} loading="lazy" />
            </span>
            <p>{c.text.split('\n').map((line) => <span key={line} className={c.text.includes('\n') ? s.fixedLine : undefined}>{line}</span>)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
