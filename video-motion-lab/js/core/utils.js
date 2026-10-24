/* =========================================================================
   Video Motion Lab — core utilities
   Loaded first. Creates window.VML and the shared maths every demo uses:
   interpolation, seeded randomness, noise, easing curves and settings.

   Rule that keeps every demo scrubbable: a demo never stores animation
   state between frames. Its look is always a pure function of time `t`,
   so play, pause, scrub, speed and frame-step are exact by construction.
   ========================================================================= */
(function () {
  'use strict';

  const VML = (window.VML = window.VML || {});

  /* ---------- interpolation ---------- */
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  /* Normalised progress of `t` inside a window that starts at `start` and lasts `dur`. */
  const seg = (t, start, dur) => (dur <= 0 ? (t >= start ? 1 : 0) : clamp((t - start) / dur));
  /* Map v from [a,b] to [c,d], clamped. */
  const map = (v, a, b, c, d) => c + (d - c) * clamp((v - a) / (b - a));
  /* 0 → 1 → 0 bump over [0,1]. */
  const bump = (p) => Math.sin(clamp(p) * Math.PI);
  const fract = (v) => v - Math.floor(v);
  const mix3 = (a, b, c, p) => (p < 0.5 ? lerp(a, b, p * 2) : lerp(b, c, (p - 0.5) * 2));

  /* ---------- seeded randomness (deterministic → scrubbable) ---------- */
  function rng(seed = 1) {
    let a = seed >>> 0 || 1;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const hash = (n) => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);

  /* Smooth value noise: 1D and 2D, range ≈ -1…1. Cheap and deterministic. */
  const smooth = (t) => t * t * (3 - 2 * t);
  function noise1(x) {
    const i = Math.floor(x), f = x - i;
    return lerp(hash(i) * 2 - 1, hash(i + 1) * 2 - 1, smooth(f));
  }
  const h2 = (x, y) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) * 2 - 1;
  function noise2(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y), fx = smooth(x - ix), fy = smooth(y - iy);
    return lerp(lerp(h2(ix, iy), h2(ix + 1, iy), fx), lerp(h2(ix, iy + 1), h2(ix + 1, iy + 1), fx), fy);
  }
  /* Layered noise for handheld camera drift. */
  const fbm1 = (x) => noise1(x) * 0.6 + noise1(x * 2.1 + 7) * 0.3 + noise1(x * 4.3 + 13) * 0.1;

  /* ---------- easing ---------- */
  function bezier(x1, y1, x2, y2) {
    const A = (a, b) => 1 - 3 * b + 3 * a, B = (a, b) => 3 * b - 6 * a, C = (a) => 3 * a;
    const calc = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
    const slope = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 6; i++) {
        const s = slope(t, x1, x2);
        if (Math.abs(s) < 1e-6) break;
        t -= (calc(t, x1, x2) - x) / s;
      }
      // Fallback bisection if Newton wandered off.
      if (t < 0 || t > 1 || Math.abs(calc(t, x1, x2) - x) > 1e-4) {
        let lo = 0, hi = 1;
        for (let i = 0; i < 24; i++) { t = (lo + hi) / 2; calc(t, x1, x2) < x ? (lo = t) : (hi = t); }
      }
      return calc(t, y1, y2);
    };
  }

  /* Closed-form damped harmonic oscillator, normalised to t ∈ [0,1].
     zeta = damping ratio (<1 bounces, 1 = critical, >1 overdamped), w = angular frequency. */
  function spring(zeta = 0.4, w = 14) {
    return function (t) {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      if (zeta < 1) {
        const wd = w * Math.sqrt(1 - zeta * zeta);
        return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + ((zeta * w) / wd) * Math.sin(wd * t));
      }
      if (zeta === 1) return 1 - Math.exp(-w * t) * (1 + w * t);
      const s = Math.sqrt(zeta * zeta - 1), r1 = -w * (zeta - s), r2 = -w * (zeta + s);
      return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
    };
  }

  const pow = (p) => ({
    in: (t) => Math.pow(t, p),
    out: (t) => 1 - Math.pow(1 - t, p),
    inOut: (t) => (t < 0.5 ? Math.pow(2 * t, p) / 2 : 1 - Math.pow(2 - 2 * t, p) / 2),
  });
  const backS = 1.70158;
  const bounceOut = (t) => {
    const n = 7.5625, d = 2.75;
    if (t < 1 / d) return n * t * t;
    if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
    if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
    return n * (t -= 2.625 / d) * t + 0.984375;
  };
  /* Viscous friction: velocity decays exponentially (a thrown object on ice). */
  const inertia = (k = 6) => (t) => (1 - Math.exp(-k * t)) / (1 - Math.exp(-k));
  /* Momentum: pushed (accelerating) for the first `a` of the time, then coasts with friction. */
  function momentum(a = 0.32, k = 5.5) {
    const x1 = a * a, v1 = 2 * a, total = x1 + (v1 / k) * (1 - Math.exp(-k * (1 - a)));
    return (t) => (t < a ? t * t : x1 + (v1 / k) * (1 - Math.exp(-k * (t - a)))) / total;
  }

  const E = {
    linear: (t) => t,
    'sine.in': (t) => 1 - Math.cos((t * Math.PI) / 2),
    'sine.out': (t) => Math.sin((t * Math.PI) / 2),
    'sine.inOut': (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    'expo.in': (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
    'expo.out': (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    'expo.inOut': (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2),
    'circ.out': (t) => Math.sqrt(1 - Math.pow(t - 1, 2)),
    'circ.inOut': (t) => (t < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2),
    'back.in': (t) => (backS + 1) * t * t * t - backS * t * t,
    'back.out': (t) => 1 + (backS + 1) * Math.pow(t - 1, 3) + backS * Math.pow(t - 1, 2),
    'back.inOut': (t) => {
      const c = backS * 1.525;
      return t < 0.5 ? (Math.pow(2 * t, 2) * ((c + 1) * 2 * t - c)) / 2 : (Math.pow(2 * t - 2, 2) * ((c + 1) * (t * 2 - 2) + c) + 2) / 2;
    },
    'back.soft': (t) => { const s = 0.9; return 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2); },
    'elastic.out': (t) => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
    'bounce.out': bounceOut,
    'bounce.in': (t) => 1 - bounceOut(1 - t),
    spring: spring(0.38, 15),
    'spring.soft': spring(0.5, 11),
    'spring.stiff': spring(0.62, 20),
    'spring.wobbly': spring(0.22, 18),
    'spring.critical': spring(1, 11),
    'spring.damped': spring(0.72, 13),
    inertia: inertia(6),
    momentum: momentum(),
    friction: pow(2).out, // constant deceleration = quadratic ease-out
    /* Named cubic-béziers used throughout the lab. */
    premium: bezier(0.22, 1, 0.36, 1),
    smooth: bezier(0.65, 0, 0.35, 1),
    snap: bezier(0.8, 0, 0.1, 1),
    punch: bezier(0.2, 1.4, 0.4, 1),
    css: bezier(0.25, 0.1, 0.25, 1), // the CSS keyword `ease`
  };
  [['quad', 2], ['cubic', 3], ['quart', 4], ['quint', 5]].forEach(([n, p]) => {
    const f = pow(p);
    E[n + '.in'] = f.in; E[n + '.out'] = f.out; E[n + '.inOut'] = f.inOut;
  });
  // Short aliases: in / out / inOut = cubic, matching how designers usually say it.
  E.in = E['cubic.in']; E.out = E['cubic.out']; E.inOut = E['cubic.inOut'];

  const ease = (e) => (typeof e === 'function' ? e : E[e] || E.out);

  /* ---------- settings (persisted, observable) ---------- */
  const store = {
    get(k) { try { return localStorage.getItem('vml:' + k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('vml:' + k, v); } catch (e) { /* storage blocked */ } },
  };
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const DEFAULTS = { format: '9:16', speed: '1', bg: 'dark', safe: 'off', labels: 'off', motion: mqReduce.matches ? 'reduced' : 'on', loop: 'on' };
  const ALLOWED = {
    format: ['9:16', '4:5', '1:1', '16:9'], speed: ['0.5', '1', '1.5', '2'], bg: ['dark', 'light'],
    safe: ['on', 'off'], labels: ['on', 'off'], motion: ['on', 'reduced'], loop: ['on', 'off'],
  };
  const settings = {};
  Object.keys(DEFAULTS).forEach((k) => {
    const saved = store.get(k);
    settings[k] = ALLOWED[k].includes(saved) ? saved : DEFAULTS[k];
  });
  const listeners = new Set();
  function setSetting(key, value) {
    if (!ALLOWED[key] || !ALLOWED[key].includes(value) || settings[key] === value) return;
    settings[key] = value;
    store.set(key, value);
    document.documentElement.dataset[key] = value;
    listeners.forEach((fn) => fn(key, value));
  }
  const onSetting = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

  /* ---------- tiny DOM/string helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  /* Split text into character spans grouped per word (words never break mid-line). */
  function chars(text, ref = 'ch', cls = '') {
    return text.split(' ').map((w) =>
      `<span class="w">${[...w].map((c) => `<span class="ch ${cls}" data-r="${ref}">${esc(c)}</span>`).join('')}</span>`
    ).join(' ');
  }
  function words(text, ref = 'w', cls = '') {
    return text.split(' ').map((w) => `<span class="wd ${cls}" data-r="${ref}">${esc(w)}</span>`).join(' ');
  }
  const fmtTime = (t) => {
    const s = Math.max(0, t);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + (s % 60).toFixed(2).padStart(5, '0');
  };

  Object.assign(VML, {
    clamp, lerp, seg, map, bump, fract, mix3, rng, hash, noise1, noise2, fbm1,
    bezier, spring, inertia, momentum, E, ease,
    settings, setSetting, onSetting, store, esc, chars, words, fmtTime,
    get reduced() { return settings.motion === 'reduced'; },
  });
  Object.keys(settings).forEach((k) => { document.documentElement.dataset[k] = settings[k]; });
})();
