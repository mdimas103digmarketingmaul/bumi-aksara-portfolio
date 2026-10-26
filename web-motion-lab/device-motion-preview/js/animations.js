/* All motion is local: native Web Animations API, no animation dependencies. */
(() => {
  const smooth = 'cubic-bezier(.45, 0, .2, 1)';
  const ease = {
    linear: t => t,
    'ease-in': t => t * t * t,
    'ease-out': t => 1 - (1 - t) ** 3,
    'ease-in-out': t => t < .5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2,
    overshoot: t => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2,
    bounce: t => {
      const n = 7.5625, d = 2.75;
      if (t < 1 / d) return n * t * t;
      if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75;
      if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375;
      return n * (t -= 2.625 / d) * t + .984375;
    },
    elastic: t => t === 0 || t === 1 ? t : 2 ** (-10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI / 3)) + 1
  };
  MotionLab.ease = ease;
  // Do not animate opacity on depth containers: it can flatten their 3D children.
  const pose = transform => ({ transform });
  const travel = (start, end) => [
    { ...pose(start), offset: 0 }, { ...pose(start), offset: .12, easing: smooth },
    { ...pose(end), offset: .82 }, { ...pose(end), offset: 1 }
  ];
  const sweep = (a, b, c = 'none') => [
    { transform: a, offset: 0, easing: smooth },
    { transform: b, offset: .52, easing: smooth },
    { transform: c, offset: .86 }, { transform: c, offset: 1 }
  ];

  MotionLab.buildAnimations = (card, definition) => {
    const id = definition.id;
    const handles = [];
    const add = (selector, frames, options = {}) => {
      card.querySelectorAll(selector).forEach(element => {
        const animation = element.animate(frames, {
          duration: 5200, iterations: 1, fill: 'both', easing: 'linear',
          direction: 'alternate', ...options
        });
        animation.pause();
        animation.currentTime = 0;
        handles.push(animation);
      });
    };
    const actor = (frames, options) => add('.actor', frames, options);
    const standard = {
      'scale-up': travel('scale(.82)', 'scale(1)'),
      'scale-down': travel('scale(1)', 'scale(.8)'),
      'rotate-z': sweep('rotateZ(-8deg)', 'rotateZ(5deg)', 'rotateZ(0deg)'),
      flip: travel('rotateY(0deg)', 'rotateY(180deg)'),
      slide: [{ transform: 'translateX(180px)', offset: 0, easing: smooth }, { transform: 'translateX(0)', offset: .68 }, { transform: 'translateX(0)', offset: 1 }],
      rise: [{ transform: 'translateY(65px)', offset: 0, easing: smooth }, { transform: 'translateY(0)', offset: .68 }, { transform: 'translateY(0)', offset: 1 }],
      yaw: sweep('rotateY(-25deg)', 'rotateY(15deg)', 'rotateY(0deg)'),
      pitch: sweep('rotateX(24deg)', 'rotateX(-20deg)', 'rotateX(0deg)'),
      roll: sweep('rotateZ(-12deg)', 'rotateZ(12deg)', 'rotateZ(0deg)'),
      tilt: travel('rotateX(0deg) rotateY(0deg) scale(.96)', 'rotateX(10deg) rotateY(-20deg) scale(1.02)'),
      turn: sweep('rotateY(0deg)', 'rotateY(-48deg)', 'rotateY(0deg)'),
      'move-x': travel('translateX(-55px)', 'translateX(55px)'),
      'move-y': travel('translateY(36px)', 'translateY(-36px)'),
      'move-z': travel('translateZ(-100px) rotateY(-14deg)', 'translateZ(100px) rotateY(-14deg)'),
      float: sweep('translateY(6px) rotateZ(-1deg)', 'translateY(-6px) rotateZ(1deg)', 'translateY(6px) rotateZ(-1deg)'),
      drift: travel('translate(-7px, 5px)', 'translate(7px, -5px)'),
      breathe: sweep('scale(1)', 'scale(1.015)', 'scale(1)'),
      micro: travel('rotateZ(-1.5deg)', 'rotateZ(1.5deg)'),
      'pivot-center': sweep('rotateZ(-15deg)', 'rotateZ(15deg)', 'rotateZ(0deg)'),
      'pivot-bottom': travel('rotateX(-42deg)', 'rotateX(0deg)'),
      'pivot-left': travel('rotateY(-50deg)', 'rotateY(0deg)')
    };
    if (standard[id]) actor(standard[id], { duration: definition.section === 'ambient' ? 7200 : 5200 });
    if (id === 'slide' || id === 'rise') add('.scene-visibility', [{ opacity: 0 }, { opacity: 1, offset: .68 }, { opacity: 1 }]);
    if (id.startsWith('pivot-')) card.querySelector('.actor').style.transformOrigin = {
      'pivot-center': '50% 50%', 'pivot-bottom': '50% 100%', 'pivot-left': '0% 50%'
    }[id];

    if (id === 'push' || id === 'pull') {
      const pair = ['translateZ(-100px)', 'translateZ(90px)'];
      if (id === 'pull') pair.reverse();
      add('.world', travel(...pair), { duration: 6200 });
      actor(travel('rotateY(-9deg) rotateX(3deg)', 'rotateY(-6deg) rotateX(2deg)'), { duration: 6200 });
    }
    if (id === 'pan') {
      add('.scene', [{ perspectiveOrigin: '25% 45%', easing: smooth }, { perspectiveOrigin: '75% 45%' }], { duration: 6200 });
      add('.world', travel('translateX(25px)', 'translateX(-25px)'), { duration: 6200 });
    }
    if (id === 'orbit') {
      actor([
        { transform: 'translateX(0) rotateY(0deg)', offset: 0, easing: smooth },
        { transform: 'translateX(24px) rotateY(-30deg)', offset: .3, easing: smooth },
        { transform: 'translateX(-24px) rotateY(30deg)', offset: .7, easing: smooth },
        { transform: 'translateX(0) rotateY(0deg)', offset: 1 }
      ], { duration: 8000, direction: 'normal' });
      add('.depth-frame', sweep('translateZ(-190px) translateX(0)', 'translateZ(-190px) translateX(-28px)', 'translateZ(-190px) translateX(0)'), { duration: 8000, direction: 'normal' });
    }
    if (id === 'parallax') {
      actor(travel('translateX(-36px)', 'translateX(36px)'), { duration: 6800 });
      add('.scenery', travel('translateZ(-100px) translateX(-10px)', 'translateZ(-100px) translateX(10px)'), { duration: 6800 });
    }
    if (definition.section === 'easing') {
      // 120 px / 2400 ms for every forward journey. Sample non-CSS curves faithfully.
      const frames = Array.from({ length: 121 }, (_, i) => ({
        offset: i / 120 * .6, transform: `translateX(${-60 + 120 * ease[id](i / 120)}px)`, opacity: 1
      }));
      frames.push(
        { offset: .78, transform: 'translateX(60px)', opacity: 1 },
        { offset: .85, transform: 'translateX(60px)', opacity: 0 },
        { offset: .86, transform: 'translateX(-60px)', opacity: 0 },
        { offset: 1, transform: 'translateX(-60px)', opacity: 1 }
      );
      // Move the mount: a pixel is a screen pixel, regardless of device display scale.
      add('.easing-traveler', frames, { duration: 4000, direction: 'normal' });
    }
    if (id === 'blur') {
      actor(travel('translateX(-55px)', 'translateX(55px)'));
      add('.device-primary', [{ filter: 'blur(0px)', offset: 0 }, { filter: 'blur(0px)', offset: .16 }, { filter: 'blur(1.6px)', offset: .43 }, { filter: 'blur(0px)', offset: .8 }, { filter: 'blur(0px)', offset: 1 }]);
    }
    if (id === 'combined') {
      actor([
        { transform: 'translateY(48px) rotateY(-22deg) rotateX(7deg)', offset: 0, easing: smooth },
        { transform: 'translateY(0) rotateY(-17deg) rotateX(4deg)', offset: .24, easing: smooth },
        { transform: 'translateY(-4px) rotateY(-8deg) rotateX(2deg)', offset: .56, easing: smooth },
        { transform: 'translateY(-8px) rotateY(-6deg) rotateZ(.6deg)', offset: .74, easing: smooth },
        { transform: 'translateY(0) rotateY(-5deg) rotateZ(0deg)', offset: .93 },
        { transform: 'translateY(0) rotateY(-5deg) rotateZ(0deg)', offset: 1 }
      ], { duration: 8000 });
      add('.scene-visibility', [{ opacity: 0 }, { opacity: 1, offset: .24 }, { opacity: 1 }], { duration: 8000 });
      add('.world', travel('translateZ(-75px)', 'translateZ(30px)'), { duration: 8000 });
      add('.soft-shadow', [{ opacity: .1 }, { opacity: .8, offset: .3 }, { opacity: .6, offset: .75 }, { opacity: .8 }], { duration: 8000 });
    }
    // Independently scrolling screen, still governed by all playback controls.
    add('.mock-site', [
      { transform: 'translateY(0)', offset: 0 }, { transform: 'translateY(0)', offset: .12, easing: smooth },
      { transform: 'translateY(-162px)', offset: .36 }, { transform: 'translateY(-162px)', offset: .5, easing: smooth },
      { transform: 'translateY(-324px)', offset: .77 }, { transform: 'translateY(-324px)', offset: 1 }
    ], { duration: id === 'combined' ? 8000 : 12000 });
    return handles;
  };
})();
