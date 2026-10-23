/* =========================================================================
   Web Motion Lab — core runtime
   Shared helpers every effect module uses. Loaded first, exposes window.Lab.

   Design rules that keep 50 demos from fighting each other:
   - Every rAF loop is tied to a stage element and only runs while that
     stage is visible and the tab is in the foreground.
   - Non-continuous loops go to sleep once their motion has settled.
   - There is exactly one scroll listener for the whole page.
   - Pointer listeners are attached to a demo stage, never to window.
   ========================================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const INTENSITY = { subtle: 0.55, normal: 1, strong: 1.6 };

  const store = {
    get(key) { try { return localStorage.getItem('wml:' + key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem('wml:' + key, value); } catch (e) { /* private mode */ } },
  };

  const state = {
    motion: store.get('motion') || (mqReduce.matches ? 'reduced' : 'on'),
    intensity: INTENSITY[store.get('intensity')] ? store.get('intensity') : 'normal',
  };
  const changeListeners = new Set();

  /* ---------- math ---------- */
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const map = (v, inMin, inMax, outMin, outMax) => outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin);
  // Frame-rate independent smoothing: higher lambda = snappier follow.
  const damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt));

  /* Damped spring (semi-implicit Euler, sub-stepped for stability). */
  function spring({ stiffness = 170, damping = 18, mass = 1, value = 0 } = {}) {
    return {
      value, velocity: 0, target: value, stiffness, damping, mass,
      step(dt) {
        let remaining = dt;
        while (remaining > 0) {
          const h = Math.min(remaining, 1 / 120);
          const force = -this.stiffness * (this.value - this.target) - this.damping * this.velocity;
          this.velocity += (force / this.mass) * h;
          this.value += this.velocity * h;
          remaining -= h;
        }
        return !this.settled;
      },
      get settled() { return Math.abs(this.velocity) < 0.02 && Math.abs(this.value - this.target) < 0.02; },
      snap(v = this.target) { this.value = this.target = v; this.velocity = 0; },
    };
  }

  /* ---------- visibility (one shared IntersectionObserver) ---------- */
  const visibilityCallbacks = new Map();
  const visibilityState = new Map();
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      visibilityState.set(entry.target, entry.isIntersecting);
      (visibilityCallbacks.get(entry.target) || []).forEach((cb) => cb(entry.isIntersecting, entry));
    });
  }, { rootMargin: '120px 0px' });

  function onVisible(el, cb) {
    if (!visibilityCallbacks.has(el)) {
      visibilityCallbacks.set(el, []);
      visibilityObserver.observe(el);
    }
    visibilityCallbacks.get(el).push(cb);
    // Late subscribers (e.g. lazily started loops) get the current state right away.
    if (visibilityState.has(el)) cb(visibilityState.get(el));
  }

  /* Run cb once, the first time el gets close to the viewport. */
  function whenNear(el, cb, margin = '200px') {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { io.disconnect(); cb(); }
    }, { rootMargin: margin });
    io.observe(el);
  }

  /* Trigger cb each time el crosses `threshold` of the viewport. */
  function onEnter(el, cb, { threshold = 0.35, once = false } = {}) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        cb(entry);
        if (once) io.unobserve(entry.target);
      });
    }, { threshold });
    io.observe(el);
    return io;
  }

  /* ---------- rAF loops scoped to a stage ----------
     tick(dt, time) renders one frame.
     continuous: true  -> runs whenever visible (ambient loops).
                          With reduced motion it renders one static frame.
     continuous: false -> runs after wake(); sleeps when tick returns false. */
  function loop(el, tick, { continuous = false } = {}) {
    let raf = 0;
    let last = 0;
    let visible = false;
    let awake = continuous;

    const canRun = () => awake && visible && !document.hidden && !(continuous && Lab.reduced);
    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      raf = 0;
      const keepGoing = tick(dt, now / 1000);
      if (keepGoing === false && !continuous) awake = false;
      if (canRun()) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (raf || !canRun()) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const staticFrame = () => { if (continuous && Lab.reduced) tick(0, 0); };

    onVisible(el, (isVisible) => { visible = isVisible; isVisible ? start() : stop(); });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    onChange(() => { stop(); staticFrame(); start(); });
    staticFrame();

    return {
      wake() { awake = true; start(); },
      sleep() { if (!continuous) awake = false; stop(); },
      get running() { return raf !== 0; },
    };
  }

  /* ---------- scroll manager (single passive listener) ---------- */
  const scrollItems = new Set();
  let scrollQueued = false;
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();
  let rawVelocity = 0;

  /* --sticky-top is a calc() string, so sum its two plain-pixel parts instead. */
  function headerOffset() {
    const styles = getComputedStyle(root);
    return (parseFloat(styles.getPropertyValue('--header-h')) || 0) + (parseFloat(styles.getPropertyValue('--mobile-nav-h')) || 0);
  }

  function runScrollItems() {
    scrollQueued = false;
    const vh = window.innerHeight;
    const top = headerOffset();
    scrollItems.forEach((item) => {
      if (!item.visible) return;
      if (item.mode === 'page') {
        const max = document.documentElement.scrollHeight - vh;
        item.fn({ progress: max > 0 ? clamp(window.scrollY / max) : 0, velocity: Lab.scrollVelocity });
        return;
      }
      const rect = item.el.getBoundingClientRect();
      let progress;
      if (item.mode === 'pin') {
        // 0 when the section top reaches the sticky line, 1 when its bottom reaches the viewport bottom.
        const travel = rect.height - (vh - top);
        progress = travel > 0 ? clamp((top - rect.top) / travel) : 0;
      } else {
        // 0 when the element's top enters from the bottom, 1 when its bottom leaves at the top.
        progress = clamp((vh - rect.top) / (vh + rect.height));
      }
      item.fn({ progress, rect, vh, velocity: Lab.scrollVelocity });
    });
  }

  function queueScroll() {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(runScrollItems); }
  }

  window.addEventListener('scroll', () => {
    const now = performance.now();
    const dy = window.scrollY - lastScrollY;
    const dt = Math.max(now - lastScrollTime, 1);
    rawVelocity = lerp(rawVelocity, (dy / dt) * 1000, 0.35);
    lastScrollY = window.scrollY;
    lastScrollTime = now;
    queueScroll();
  }, { passive: true });
  window.addEventListener('resize', queueScroll, { passive: true });

  /* el = null tracks the whole page (mode 'page'). */
  function onScroll(el, fn, { mode = 'cross' } = {}) {
    const item = { el, fn, mode: el ? mode : 'page', visible: !el };
    scrollItems.add(item);
    if (el) onVisible(el, (v) => { item.visible = v; if (v) queueScroll(); });
    else queueScroll();
    return item;
  }

  /* ---------- pointer helper scoped to an element ---------- */
  function pointer(el, { move, enter, leave, down } = {}) {
    const read = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      return { x, y, w: r.width, h: r.height, nx: (x / r.width) * 2 - 1, ny: (y / r.height) * 2 - 1, type: e.pointerType };
    };
    if (move) el.addEventListener('pointermove', (e) => move(read(e), e), { passive: true });
    if (enter) el.addEventListener('pointerenter', (e) => enter(read(e), e), { passive: true });
    if (leave) el.addEventListener('pointerleave', (e) => leave(e), { passive: true });
    if (down) el.addEventListener('pointerdown', (e) => down(read(e), e));
    return read;
  }

  /* ---------- text helpers ---------- */
  /* Split text into word and/or char spans. Screen readers get one
     visually-hidden copy of the text; the animated spans are aria-hidden. */
  function split(el, by = 'chars', offset = 0) {
    const text = el.dataset.text || el.textContent.trim().replace(/\s+/g, ' ');
    el.dataset.text = text;
    el.textContent = '';
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = text;
    el.appendChild(sr);
    const pieces = [];
    let index = offset;
    text.split(' ').forEach((word, wi, words) => {
      const w = document.createElement('span');
      w.className = 'split-w';
      w.setAttribute('aria-hidden', 'true');
      if (by === 'words') {
        w.textContent = word;
        w.style.setProperty('--i', index++);
        pieces.push(w);
      } else {
        [...word].forEach((ch) => {
          const c = document.createElement('span');
          c.className = 'split-c';
          c.textContent = ch;
          c.style.setProperty('--i', index++);
          w.appendChild(c);
          pieces.push(c);
        });
      }
      el.appendChild(w);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return pieces;
  }

  const SCRAMBLE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>[]{}';
  /* Each character cycles random glyphs until its own reveal time. */
  function scramble(el, finalText, { duration = 900 } = {}) {
    if (el._scrambleRaf) cancelAnimationFrame(el._scrambleRaf);
    el.setAttribute('aria-label', finalText);
    if (Lab.reduced) { el.textContent = finalText; return; }
    const start = performance.now();
    const reveal = [...finalText].map((ch, i) => (i / finalText.length) * duration * 0.7 + Math.random() * duration * 0.3);
    const step = (now) => {
      const t = now - start;
      let out = '';
      [...finalText].forEach((ch, i) => {
        out += ch === ' ' || t >= reveal[i] ? ch : SCRAMBLE_GLYPHS[(Math.random() * SCRAMBLE_GLYPHS.length) | 0];
      });
      el.textContent = out;
      el._scrambleRaf = t < duration ? requestAnimationFrame(step) : 0;
    };
    el._scrambleRaf = requestAnimationFrame(step);
  }

  /* Magnetic pull toward the pointer, with spring return.
     `area` limits where the pointer is listened to (a demo stage). */
  function magnet(el, area, { radius = 120, strength = 0.35, onUpdate } = {}) {
    const sx = spring({ stiffness: 220, damping: 16 });
    const sy = spring({ stiffness: 220, damping: 16 });
    const ticker = loop(area, (dt) => {
      const a = sx.step(dt);
      const b = sy.step(dt);
      el.style.transform = `translate3d(${sx.value.toFixed(2)}px, ${sy.value.toFixed(2)}px, 0)`;
      if (onUpdate) onUpdate(sx.value, sy.value);
      return a || b;
    });
    area.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || Lab.reduced) return;
      // Measure against the resting box (minus current offset) so the field doesn't drift.
      const r = el.getBoundingClientRect();
      const left = r.left - sx.value;
      const top = r.top - sy.value;
      const dx = e.clientX - (left + r.width / 2);
      const dy = e.clientY - (top + r.height / 2);
      // Distance from the pointer to the button's edge: the field hugs any shape of button.
      const ex = Math.max(left - e.clientX, 0, e.clientX - (left + r.width));
      const ey = Math.max(top - e.clientY, 0, e.clientY - (top + r.height));
      const inside = Math.hypot(ex, ey) < radius;
      sx.target = inside ? dx * strength * Lab.k : 0;
      sy.target = inside ? dy * strength * Lab.k : 0;
      el.classList.toggle('is-magnetized', inside);
      ticker.wake();
    }, { passive: true });
    area.addEventListener('pointerleave', () => {
      sx.target = 0; sy.target = 0;
      el.classList.remove('is-magnetized');
      ticker.wake();
    }, { passive: true });
  }

  /* ---------- settings ---------- */
  function applySettings() {
    root.dataset.motion = state.motion;
    root.dataset.intensity = state.intensity;
    root.style.setProperty('--k', INTENSITY[state.intensity]);
  }
  function onChange(fn) { changeListeners.add(fn); }
  function notify() { applySettings(); changeListeners.forEach((fn) => fn(state)); }

  const Lab = {
    effects: [],
    state,
    store,
    clamp, lerp, map, damp, spring,
    onVisible, whenNear, onEnter, loop, onScroll, pointer,
    split, scramble, magnet, onChange,
    get reduced() { return state.motion === 'reduced'; },
    get k() { return INTENSITY[state.intensity]; },
    get fine() { return mqFine.matches; },
    get scrollVelocity() {
      // Velocity decays naturally once scrolling stops — no extra loop needed.
      const idle = performance.now() - lastScrollTime;
      return rawVelocity * Math.exp(-idle / 140);
    },
    define(def) { this.effects.push(def); },
    setMotion(value) { state.motion = value; store.set('motion', value); notify(); },
    setIntensity(value) { if (!INTENSITY[value]) return; state.intensity = value; store.set('intensity', value); notify(); },
    refreshScroll: queueScroll,
  };

  applySettings();
  window.Lab = Lab;
})();
