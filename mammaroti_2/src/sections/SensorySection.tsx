export function SensorySection() {
  return <section className="sensory" aria-label="Crunchy, Melt, Joy, Sweet">
    <div className="wheat-strip left" aria-hidden="true" /><div className="wheat-strip right" aria-hidden="true" />
    <img className="split-bun" src="/images/split-bun.webp" alt="Roti MammaRoti terbelah, memperlihatkan bagian dalamnya" width="655" height="683" loading="lazy" />
    <span className="sensory-word crunchy">Crunchy</span><span className="sensory-word melt">Melt</span>
    <span className="sensory-word joy">Joy</span><span className="sensory-word sweet">Sweet</span>
    {(['crunchy', 'melt', 'joy', 'sweet'] as const).map(name => <img key={name} className={`sensory-arrow arrow-${name}`} src={`/icons/arrow-${name}.svg`} alt="" loading="lazy" />)}
    <a className="keep-scrolling" href="#original">Keep Scrolling...</a>
  </section>;
}
