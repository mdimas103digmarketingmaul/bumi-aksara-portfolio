export function HeroSection() {
  return <section className="hero" id="beranda" aria-label="Your everyday coffebun">
    <h1 className="sr-only">Your everyday coffebun</h1>
    <div className="hero-type" aria-hidden="true">
      <span>Your everyday coffebun</span>
      <span>Your everyday coffebun</span>
      <span>Your everyday coffebun</span>
    </div>
    <img className="hero-bun" src="/images/hero-bun.webp" alt="Coffee bun MammaRoti dengan lapisan luar keemasan" width="654" height="603" fetchPriority="high" />
    <a href="#outlet" className="find-us">Temukan Kami<span><img src="/icons/arrow-down.svg" alt="" width="14" height="20" /></span></a>
  </section>;
}
