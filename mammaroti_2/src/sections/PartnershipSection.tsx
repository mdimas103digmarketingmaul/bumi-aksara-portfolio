import { sampleParagraph, site } from '@/data/site';

export function PartnershipSection() {
  return <section className="partnership" aria-labelledby="partnership-title">
    <div className="partnership-card">
      <h2 id="partnership-title">Miliki outletmu sendiri</h2>
      <p>{sampleParagraph}</p>
      <img className="outlet-map" src="/images/outlet-map.webp" alt="Peta Indonesia dengan penanda lokasi outlet" width="1140" height="490" loading="lazy" />
      <a className="pill-button" href={`mailto:${site.email}?subject=Kemitraan%20MammaRoti`}>Hubungi Kami</a>
    </div>
  </section>;
}
