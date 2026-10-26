(() => {
  class Playback {
    constructor() {
      this.records = [];
      this.playing = true;
      this.loop = true;
      this.speed = 1;
      this.media = matchMedia('(prefers-reduced-motion: reduce)');
      this.reduced = this.media.matches;
      this.easingClock = null;
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const record = this.records.find(r => r.card === entry.target);
          record.visible = entry.isIntersecting;
          this.sync(record);
        });
        this.syncEasingClock();
      }, { threshold: .05 });
      document.addEventListener('visibilitychange', () => this.syncAll());
      this.media.addEventListener('change', event => this.setReduced(event.matches));
    }
    register(card, definition) {
      const record = { card, definition, visible: false, paused: false, handles: null };
      this.records.push(record);
      this.observer.observe(card);
      card.querySelector('[data-replay]').addEventListener('click', () => {
        if (definition.section === 'easing') this.replayEasing();
        else this.replay(record);
      });
      card.querySelector('[data-pause]').addEventListener('click', () => {
        if (definition.section === 'easing') {
          const pause = !record.paused;
          this.records.filter(r => r.definition.section === 'easing').forEach(r => { r.paused = pause; });
        } else record.paused = !record.paused;
        this.syncAll();
      });
      const toggle = card.querySelector('[data-effect]');
      if (toggle) toggle.addEventListener('change', () => {
        card.classList.toggle('effect-on', toggle.checked);
      });
    }
    initialize(record) {
      if (record.handles) return;
      record.handles = MotionLab.buildAnimations(record.card, record.definition);
      record.handles.forEach(animation => {
        animation.effect.updateTiming({ iterations: this.loop ? Infinity : 1 });
        animation.playbackRate = this.speed;
        animation.onfinish = () => this.status(record);
      });
    }
    active(record) {
      return this.playing && !this.reduced && !document.hidden && record.visible && !record.paused;
    }
    freeze(animation) {
      const time = animation.currentTime;
      animation.pause();
      // pause() is pending until the next frame; fix the hold time immediately.
      if (time !== null) animation.currentTime = time;
    }
    ended(animation) {
      return !this.loop && Number(animation.currentTime) >= animation.effect.getTiming().duration;
    }
    sync(record) {
      if (!record.handles && !record.visible) { this.status(record); return; }
      this.initialize(record);
      record.handles.forEach((animation, index) => {
        if (this.reduced) {
          this.freeze(animation);
          // Static, readable final pose. Keep screens at their hero, and devices centered.
          animation.currentTime = animation.effect.target.matches('.mock-site') ? 0 : animation.effect.getTiming().duration * .75;
          if (record.definition.section === 'easing' && index === 0) animation.currentTime = 2400;
        } else if (this.active(record)) {
          if (!this.ended(animation)) animation.play();
        } else this.freeze(animation);
      });
      this.status(record);
    }
    status(record) {
      const finished = record.handles && record.handles.every(a => this.ended(a));
      const state = this.reduced ? 'Reduced motion' : finished ? 'Finished' : !this.playing || record.paused ? 'Paused' : !record.visible ? 'Offscreen' : 'Playing';
      record.card.dataset.state = state;
      record.card.querySelector('.play-state').textContent = state;
      const button = record.card.querySelector('[data-pause]');
      button.textContent = record.paused ? '▷ Play' : 'Ⅱ Pause';
      button.setAttribute('aria-pressed', String(record.paused));
      button.setAttribute('aria-label', `${record.paused ? 'Play' : 'Pause'} ${record.definition.title}${record.definition.section === 'easing' ? ' (all easing studies)' : ''}`);
      button.disabled = this.reduced;
      record.card.querySelector('[data-replay]').disabled = this.reduced;
    }
    syncAll() {
      this.records.forEach(r => this.sync(r));
      this.syncEasingClock();
      document.body.classList.toggle('reduced-motion', this.reduced);
      document.querySelector('#reduce-motion').checked = this.reduced;
      document.querySelector('#play-all').setAttribute('aria-pressed', String(this.playing && !this.reduced));
      document.querySelector('#pause-all').setAttribute('aria-pressed', String(!this.playing));
      ['play-all', 'pause-all', 'replay-all', 'speed', 'replay-easing'].forEach(id => {
        const control = document.getElementById(id);
        if (control) control.disabled = this.reduced;
      });
    }
    syncEasingClock() {
      const records = this.records.filter(r => r.definition.section === 'easing');
      const anyActive = records.some(r => this.active(r));
      if (!this.easingClock && !anyActive) return;
      if (!this.easingClock) {
        this.easingClock = document.querySelector('#easing .cards-grid').animate([{}, {}], { duration: 4000, iterations: this.loop ? Infinity : 1, fill: 'both' });
        this.easingClock.pause();
        this.easingClock.currentTime = 0;
        this.easingClock.playbackRate = this.speed;
      }
      if (anyActive && !this.ended(this.easingClock)) this.easingClock.play();
      else this.freeze(this.easingClock);
      // A common timeline means newly visible curves join the same experiment.
      records.forEach(record => {
        if (!record.handles || this.reduced) return;
        const movement = record.handles[0];
        movement.currentTime = this.easingClock.currentTime;
        if (this.active(record) && !this.ended(this.easingClock)) {
          movement.play();
          movement.startTime = this.easingClock.startTime;
        }
      });
    }
    replay(record) {
      this.initialize(record);
      record.paused = false;
      record.handles.forEach(a => { a.currentTime = 0; });
      // Replay explicitly resumes global playback, while retaining other card pauses.
      this.playing = true;
      this.syncAll();
    }
    replayEasing() {
      this.playing = true;
      if (this.easingClock) this.easingClock.currentTime = 0;
      this.records.filter(r => r.definition.section === 'easing').forEach(r => {
        r.paused = false;
        if (r.handles) r.handles.forEach(a => { a.currentTime = 0; });
      });
      this.syncAll();
      this.announce('All easing studies restarted together.');
    }
    setReduced(value) {
      this.reduced = value;
      if (!value) this.records.forEach(r => { if (r.handles) r.handles.forEach(a => { a.currentTime = 0; }); });
      if (this.easingClock) this.easingClock.currentTime = 0;
      this.syncAll();
      this.announce(value ? 'Reduced motion enabled. All previews are static.' : 'Motion restored.');
    }
    announce(message) { document.querySelector('#announcement').textContent = message; }
    connect() {
      document.querySelector('#play-all').addEventListener('click', () => {
        this.playing = true;
        this.records.forEach(r => {
          r.paused = false;
          if (r.handles) r.handles.forEach(a => { if (this.ended(a)) a.currentTime = 0; });
        });
        if (this.easingClock && this.ended(this.easingClock)) this.easingClock.currentTime = 0;
        this.syncAll(); this.announce('Playing all visible studies.');
      });
      document.querySelector('#pause-all').addEventListener('click', () => {
        this.playing = false; this.syncAll(); this.announce('All studies paused.');
      });
      document.querySelector('#replay-all').addEventListener('click', () => {
        this.playing = true;
        this.records.forEach(r => { r.paused = false; if (r.handles) r.handles.forEach(a => { a.currentTime = 0; }); });
        if (this.easingClock) this.easingClock.currentTime = 0;
        this.syncAll(); this.announce('All studies reset. Visible studies are playing.');
      });
      document.querySelector('#loop').addEventListener('change', event => {
        this.loop = event.target.checked;
        this.records.forEach(r => {
          if (r.handles) r.handles.forEach(a => {
            // Finish the current forward cycle when switching looping off.
            const duration = a.effect.getTiming().duration;
            const phase = this.loop ? Number(a.currentTime || 0) % duration : (a.effect.getComputedTiming().progress ?? 0) * duration;
            a.effect.updateTiming({ iterations: this.loop ? Infinity : 1 });
            a.currentTime = phase;
          });
        });
        if (this.easingClock) {
          const phase = Number(this.easingClock.currentTime || 0) % 4000;
          this.easingClock.effect.updateTiming({ iterations: this.loop ? Infinity : 1 });
          this.easingClock.currentTime = phase;
        }
        this.syncAll(); this.announce(this.loop ? 'Loop enabled.' : 'Loop off. Each study will finish once.');
      });
      document.querySelector('#speed').addEventListener('change', event => {
        this.speed = Number(event.target.value);
        this.records.forEach(r => r.handles?.forEach(a => a.updatePlaybackRate(this.speed)));
        this.easingClock?.updatePlaybackRate(this.speed);
        this.announce(`Playback speed ${this.speed} times.`);
      });
      document.querySelector('#reduce-motion').addEventListener('change', event => this.setReduced(event.target.checked));
      document.querySelector('#replay-easing').addEventListener('click', () => this.replayEasing());
      this.syncAll();
    }
  }
  MotionLab.Playback = Playback;
})();
