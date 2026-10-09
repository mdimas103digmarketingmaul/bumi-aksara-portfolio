import { sampleParagraph } from '@/data/site';

export function NewsSection() {
  return <section className="news" aria-labelledby="news-title">
    <h2 id="news-title">Berita &amp; Acara</h2>
    <div className="news-track" tabIndex={0} role="region" aria-label="Daftar berita, geser untuk melihat seluruh berita">
      {Array.from({ length: 5 }, (_, index) => <article className="news-card" key={index}>
        <div className="news-image">empty image</div>
        <time dateTime="2020-10-10">10/10/2020</time>
        <p>{sampleParagraph}</p>
      </article>)}
    </div>
  </section>;
}
