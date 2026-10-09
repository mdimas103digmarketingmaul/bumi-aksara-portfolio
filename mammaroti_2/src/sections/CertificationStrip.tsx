const certificates = [
  { logo: 'halal', text: 'Sertifikasi halal Badan Penyelengara Jaminan Produk Halal' },
  { logo: 'pengayoman', text: 'Telah terdaftar dan berizin Kementrian Hukum dan Hak Asasi Manusia' },
  { logo: 'ifbc', text: 'Most Expansive Brand IFBC 2024' },
];

export function CertificationStrip() {
  return <section className="certifications" aria-label="Sertifikasi dan penghargaan">
    <div className="certificate-track">{[...certificates, ...certificates].map((item, index) => <div className={`certificate ${item.logo}`} key={index} aria-hidden={index >= certificates.length ? true : undefined}>
      <img src={`/logos/${item.logo}.webp`} alt="" loading="lazy" /><p>{item.text}</p>
    </div>)}</div>
  </section>;
}
