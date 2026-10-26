(() => {
  const keys = '<span class="key"></span>'.repeat(56) + '<span class="key"></span>';
  function website() {
    return `<div class="mock-site">
      <div class="mock-nav"><span class="mock-brand">form & field</span><span class="mock-links"><span>Work</span><span>About</span><span>Contact ↗</span></span></div>
      <div class="mock-hero"><div class="mock-eyebrow">INDEPENDENT DESIGN STUDIO</div><div class="mock-title">A little less.<br><i>A little better.</i></div><div class="mock-subtitle">Thoughtful identities and digital spaces.<br>Made with clarity. Built to last.</div><div class="mock-visual"></div></div>
      <div class="mock-projects"><div class="mock-section-label"><span>SELECTED WORK</span><span>01 — 02</span></div><div class="mock-project-grid"><div><div class="mock-project-art"></div><div class="mock-project-name">Everyday objects ↗</div></div><div><div class="mock-project-art second"></div><div class="mock-project-name">Room to grow ↗</div></div></div></div>
      <div class="mock-type"><div class="mock-section-label"><span>WORDS & FORMS</span><span>03</span></div><div class="mock-large-type">Aa Bb.</div><p>Good design gives the important<br>things room to breathe.</p><div class="mock-type-footer"><span>FORM & FIELD</span><span>LET’S MAKE SOMETHING ↗</span></div></div>
    </div>`;
  }
  function device(reflection = false) {
    return `<div class="device ${reflection ? 'reflection-copy' : 'device-primary'}">
      <div class="soft-shadow"></div><div class="contact-shadow"></div>
      <div class="screen-lid"><div class="display">${website()}</div><span class="camera-dot"></span><span class="chin">FIELD / 14</span><div class="lid-back"><span>FIELD</span></div></div>
      <div class="hinge"></div><div class="deck"><div class="keyboard">${keys}</div><div class="trackpad"></div><div class="deck-edge"></div></div>
    </div>`;
  }
  function curve(id) {
    const points = Array.from({ length: 61 }, (_, i) => `${i ? 'L' : 'M'}${(i / 60 * 60).toFixed(2)},${(26 - MotionLab.ease[id](i / 60) * 22).toFixed(2)}`).join(' ');
    return `<svg class="curve" viewBox="0 0 64 30" aria-hidden="true"><path class="curve-base" d="M0 0V27H64"/><path class="curve-path" d="${points}"/></svg>`;
  }
  function cardHTML(def) {
    const { id, title, description, recipe, axis, number, section, category } = def;
    const easing = section === 'easing';
    const polish = section === 'polish';
    const wide = id === 'combined' || id === 'parallax';
    const depth = ['move-z', 'push', 'pull', 'pan', 'orbit'].includes(id);
    const scenery = id === 'parallax' || id === 'dof';
    const reflection = id === 'reflection' || id === 'combined';
    const pivot = section === 'pivot';
    return `<article class="motion-card ${wide ? 'full-width' : ''} ${id}-card ${easing ? 'easing-card' : ''} ${polish ? `polish-card effect-${id} effect-on` : ''} ${pivot ? id : ''}" id="study-${id}" aria-labelledby="title-${id}" data-motion="${id}">
      <header class="card-header"><div class="card-kicker"><span>${category}</span><span class="study-number">${String(number).padStart(2, '0')}</span></div><h3 id="title-${id}">${title}</h3><p class="card-description">${description}</p></header>
      <div class="stage" role="img" aria-label="Animated laptop demonstrating ${title}. ${description}">
        <span class="stage-label">${easing ? '120 px / 2.4 s' : id === 'combined' ? 'PRODUCT STUDY / 08 SEC' : 'FIELD / 14'}</span>
        ${easing ? curve(id) + '<div class="travel-line"></div><span class="travel-label start">A</span><span class="travel-label end">B</span>' : ''}
        <div class="scene-visibility" aria-hidden="true"><div class="scene"><div class="world">
          ${depth ? '<div class="depth-frame"></div>' : ''}${['push', 'pull', 'pan'].includes(id) ? '<div class="depth-pin"></div>' : ''}
          ${scenery ? '<div class="scenery"></div>' : ''}${id === 'glow' ? '<div class="halo"></div>' : ''}
          <div class="easing-traveler"><div class="mount"><div class="actor">${device()}${reflection ? device(true) : ''}</div></div></div>
        </div></div></div>
        ${pivot ? '<div class="pivot-overlay" aria-hidden="true"><div class="mount"><div class="pivot-marker"><span>pivot</span></div></div></div>' : ''}
        ${id === 'vignette' ? '<div class="vignette-overlay"></div>' : ''}
        ${scenery ? '<span class="layer-caption">BACKGROUND / FOREGROUND</span>' : ''}
        <span class="axis-guide ${axis.startsWith('Y') ? 'y-guide' : axis.startsWith('Z') ? 'z-guide' : ''}">${axis}</span>
      </div>
      ${id === 'combined' ? '<div class="sequence-labels"><span>00 / RISE</span><span>02 / TURN</span><span>04 / APPROACH</span><span>06 / SETTLE</span></div>' : ''}
      <footer class="card-footer"><code class="recipe">${recipe}</code><div class="card-actions"><button class="text-button" data-replay aria-label="Replay ${title}${easing ? ' (all easing studies)' : ''}">↻ Replay</button><button class="text-button" data-pause aria-label="Pause ${title}" aria-pressed="false">Ⅱ Pause</button>${polish ? `<label class="effect-toggle"><input type="checkbox" data-effect checked aria-label="Enable ${title} effect"> Effect</label>` : ''}<span class="play-state">Ready</span></div></footer>
    </article>`;
  }
  const playback = new MotionLab.Playback();
  const library = document.querySelector('#library');
  const navigation = document.querySelector('#category-nav');
  let number = 0;
  for (const [index, section] of MotionLab.sections.entries()) {
    const definitions = section.items.map(([id, title, description, recipe, axis]) => ({ id, title, description, recipe, axis, number: ++number, section: section.id, category: section.title }));
    const element = document.createElement('section');
    element.className = 'motion-section';
    element.id = section.id;
    element.setAttribute('aria-labelledby', `heading-${section.id}`);
    element.innerHTML = `<div class="section-head"><span class="section-number">${String(index + 1).padStart(2, '0')}</span><h2 id="heading-${section.id}">${section.title}</h2></div><p class="section-note">${section.note}</p>${section.id === 'easing' ? '<div class="wide-note"><span><strong>A → B in 2.4 s</strong><br>All seven curves share one clock. A short fade resets the journey.</span><button id="replay-easing" class="button">↻ Compare again</button></div>' : ''}<div class="cards-grid">${definitions.map(cardHTML).join('')}</div>`;
    library.append(element);
    definitions.forEach(definition => playback.register(element.querySelector(`#study-${definition.id}`), definition));
    navigation.insertAdjacentHTML('beforeend', `<a href="#${section.id}"><span>${String(index + 1).padStart(2, '0')}</span>${section.title}</a>`);
  }
  document.querySelector('#study-count').textContent = `${number} studies · 10 categories`;
  playback.connect();
  // A small read-only-friendly public surface also makes local verification straightforward.
  MotionLab.playback = playback;
  const sections = [...document.querySelectorAll('.motion-section')];
  let scheduled = false;
  function updateNavigation() {
    let current = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top < 210) current = section;
    navigation.querySelectorAll('a').forEach(link => {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); } }, { passive: true });
  updateNavigation();
})();
