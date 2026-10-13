(() => {
  'use strict';

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && typeof value === 'string' && value.trim()) {
      element.textContent = value;
    }
  };

  fetch('content/home.json', { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(content => {
      const hero = content?.hero;
      if (!hero) return;

      setText('#hero-eyebrow', hero.eyebrow);
      setText('#hero-headline-line-1', hero.headlineLine1);
      setText('#hero-headline-line-2-prefix', hero.headlineLine2Prefix);
      setText('#hero-headline-highlight', hero.headlineHighlight);
      setText('#hero-description', hero.description);
    })
    .catch(error => {
      // Website tetap memakai teks fallback dari index.html jika file CMS gagal dibaca.
      console.warn('Konten CMS Hero tidak dapat dimuat:', error);
    });
})();
