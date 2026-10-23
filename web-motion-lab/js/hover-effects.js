/* =========================================================================
   02 · Hover Interactions
   Mostly pure CSS. JavaScript only appears where hover alone can't know
   something — like where the pointer entered.
   ========================================================================= */
(function () {
  'use strict';

  Lab.define({
    id: 'hover-lift',
    category: 'hover',
    name: 'Hover Lift',
    aliases: ['Card Raise', 'Elevation on Hover', 'Float Up'],
    triggers: ['hover'],
    level: 1,
    complexity: 1,
    hint: 'Hover or Tab through the cards. Notice the shadow grows as the card rises.',
    anatomy: {
      trigger: 'Pointer hover or keyboard focus',
      target: 'The card + its shadow + image',
      transform: 'translateY · box-shadow · image scale',
      character: 'Ease-out (fast start, soft landing)',
    },
    tech: 'CSS transitions only',
    does: 'The card moves up a few pixels while its shadow becomes larger and softer, so it reads as physically lifting off the page. The image inside scales a tiny bit for extra life.',
    goodFor: ['Blog and case-study cards', 'Product grids', 'Corporate / finance UI', 'Any clickable card'],
    prompt: 'Add a hover lift to the project cards: on :hover and :focus-visible translate the card up 8px, deepen the box-shadow (larger blur and offset, low opacity), and scale the thumbnail to 1.04. Use a 450ms cubic-bezier(0.22, 1, 0.36, 1) ease-out, animate only transform and box-shadow, and keep the effect identical for keyboard focus.',
    init() {},
  });

  Lab.define({
    id: 'sheen',
    category: 'hover',
    name: 'Shine / Sheen Effect',
    aliases: ['Glint', 'Light Sweep', 'Shimmer on Hover'],
    triggers: ['hover'],
    level: 1,
    complexity: 1,
    hint: 'Hover the card or the button to sweep light across the surface.',
    anatomy: {
      trigger: 'Pointer hover or keyboard focus',
      target: 'A diagonal highlight pseudo-element',
      transform: 'translateX across the surface (skewed)',
      character: 'Ease-in-out, single pass',
    },
    tech: 'CSS ::after + linear-gradient + transition',
    does: 'A thin, skewed band of light slides across the element once, like light catching a glossy surface. It only animates on the way in, so it resets invisibly instead of sweeping backwards.',
    goodFor: ['Premium CTAs', 'Membership / pricing cards', 'Badges and awards', 'Luxury product tiles'],
    prompt: 'Add a sheen sweep to the premium card and its CTA: an ::after pseudo-element with a transparent → white(28%) → transparent linear-gradient, skewed -18°, positioned off the left edge. On :hover and :focus-visible translate it across the element over 900ms with ease-in-out, only transitioning on enter so it resets instantly on leave. Keep overflow hidden and the highlight subtle.',
    init() {},
  });

  Lab.define({
    id: 'image-zoom-pan',
    category: 'hover',
    name: 'Image Zoom & Pan',
    aliases: ['Hover Zoom', 'Pan-on-Hover', 'Inspect Zoom'],
    triggers: ['hover', 'mouse'],
    level: 1,
    complexity: 1,
    pointer: true,
    hint: 'Compare both frames. In the right one, move around while zoomed.',
    anatomy: {
      trigger: 'Hover (zoom) + pointer position (pan)',
      target: 'The image inside a clipped frame',
      transform: 'scale · transform-origin',
      character: 'Ease-out zoom, smoothed pan',
    },
    tech: 'CSS overflow + transition, JS sets transform-origin',
    does: 'The frame clips its image, so scaling the image never changes the layout. In the pan version, JavaScript moves the transform-origin to the pointer, so the zoom always focuses on the area you’re looking at.',
    goodFor: ['E-commerce product detail', 'Portfolio thumbnails', 'Architecture / interior photos'],
    prompt: 'Add zoom-and-pan to the product images: wrap each image in an overflow:hidden frame, scale the image to 1.6 on hover/focus with a 700ms ease-out, and on pointermove set transform-origin to the pointer position (as percentages) with a short 350ms transition so the pan feels smooth. Reset to centre on leave and keep a plain zoom for touch.',
    init(stage) {
      const frame = stage.querySelector('.zoompan__frame--pan');
      const img = frame.querySelector('img');
      Lab.pointer(frame, {
        move(p) {
          img.style.setProperty('--ox', ((p.x / p.w) * 100).toFixed(1) + '%');
          img.style.setProperty('--oy', ((p.y / p.h) * 100).toFixed(1) + '%');
        },
        leave() { img.style.setProperty('--ox', '50%'); img.style.setProperty('--oy', '50%'); },
      });
    },
  });

  Lab.define({
    id: 'mask-reveal',
    category: 'hover',
    name: 'Mask / Clip-Path Reveal',
    aliases: ['Circle Reveal', 'Wipe Reveal', 'Spotlight Reveal'],
    triggers: ['hover'],
    level: 2,
    complexity: 2,
    hint: 'Enter the left frame from different sides — the circle grows from where you came in.',
    anatomy: {
      trigger: 'Pointer entering the frame (and its entry point)',
      target: 'A second layer above the image',
      transform: 'clip-path: circle() radius · inset() edges',
      character: 'Ease-out (circle) · ease-in-out (wipe)',
    },
    tech: 'CSS clip-path transitions + JS entry coordinates',
    does: 'A second layer sits on top but is clipped to nothing. On hover the clip grows: a circle expanding from the exact point where the pointer entered, or an inset rectangle wiping up from the bottom. Nothing moves; the visible area changes.',
    goodFor: ['Before/after reveals', 'Project thumbnails', 'Hover captions', 'Black & white → colour images'],
    prompt: 'Add a clip-path reveal to the project thumbnails: overlay a colour version of the image clipped to circle(0% at X Y). On pointerenter, set X/Y CSS variables to the entry point, then transition clip-path to circle(150% at X Y) over 800ms ease-out; reverse on leave. Provide the same reveal on :focus-visible from the centre, and keep the base image meaningful without the effect.',
    init(stage) {
      stage.querySelectorAll('.mask-frame--circle').forEach((frame) => {
        const reveal = frame.querySelector('.mask-frame__reveal');
        const setOrigin = (p) => {
          reveal.style.setProperty('--mx', ((p.x / p.w) * 100).toFixed(1) + '%');
          reveal.style.setProperty('--my', ((p.y / p.h) * 100).toFixed(1) + '%');
        };
        Lab.pointer(frame, { enter: setOrigin, move: setOrigin });
        frame.addEventListener('focus', () => { reveal.style.setProperty('--mx', '50%'); reveal.style.setProperty('--my', '50%'); });
      });
    },
  });

  Lab.define({
    id: 'rolling-text',
    category: 'hover',
    name: 'Rolling Text Hover',
    aliases: ['Text Roll', 'Slot Text', 'Flip Text Link'],
    triggers: ['hover'],
    level: 2,
    complexity: 2,
    hint: 'Hover each link. Letters roll out upward while a copy rolls in from below.',
    anatomy: {
      trigger: 'Pointer hover or keyboard focus',
      target: 'Each letter of the label (and its copy)',
      transform: 'translateY by one line height',
      character: 'Ease-out with letter stagger',
    },
    tech: 'JS split into letters + CSS text-shadow copy + transition-delay',
    does: 'Every letter carries a duplicate of itself one line below (drawn with text-shadow). On hover each letter slides up by exactly one line, with a 24ms delay between letters, so the old word exits and the new one enters like a slot machine.',
    goodFor: ['Navigation links', 'Agency CTAs', 'Footer links', 'Menu overlays'],
    prompt: 'Add a rolling text hover to the navigation links: split each label into letter spans (keeping an accessible text copy), give each letter text-shadow: 0 1.15em <accent colour> to draw its duplicate one line below, clip the link to a single line, and on :hover/:focus-visible translateY(-1.15em) each letter with a 550ms ease-out and a 24ms per-letter stagger.',
    init(stage) {
      stage.querySelectorAll('.roll__link, .roll__cta-text').forEach((el) => Lab.split(el, 'chars'));
      stage.querySelectorAll('a').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));
    },
  });

  Lab.define({
    id: 'animated-border',
    category: 'hover',
    name: 'Animated Border',
    aliases: ['Border Draw', 'Line Trace', 'Gradient Border Spin'],
    triggers: ['hover'],
    level: 2,
    complexity: 2,
    hint: 'Hover each card. A draws its edges in sequence, B sends light around the border.',
    anatomy: {
      trigger: 'Pointer hover or keyboard focus',
      target: 'Border lines (A) · conic-gradient ring (B)',
      transform: 'scaleX/scaleY per edge · gradient angle (@property)',
      character: 'Linear, sequenced (A) · linear loop (B)',
    },
    tech: 'CSS transitions with delays · @property + conic-gradient + mask',
    does: 'A: four thin lines grow one after another to trace the box, and un-draw in reverse. B: a registered --angle custom property animates a conic-gradient that is masked to a 1.5px ring, so a highlight travels around the border.',
    goodFor: ['Feature highlights', 'Selected / active cards', 'Tech product pages', 'Pricing “recommended” tier'],
    prompt: 'Add an animated border to the featured card: register --angle with @property, paint a conic-gradient(from var(--angle)) with a short bright segment on a pseudo-element, mask it to a 1.5px ring with mask-composite, and animate --angle 0→360deg linearly over 2.6s only while hovered or focused. Fade the ring in and out, and keep a static 1px border as the fallback.',
    init() {},
  });
})();
