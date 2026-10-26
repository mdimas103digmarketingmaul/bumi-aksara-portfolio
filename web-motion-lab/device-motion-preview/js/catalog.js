/* Content is separate from rendering and animation so studies are easy to extend. */
window.MotionLab = {};
MotionLab.sections = [
  { id: 'basic', title: 'Basic transforms', note: 'Start here. Change size, angle, or position.', items: [
    ['scale-up', 'Scale Up / Zoom In', 'Object grows toward the viewer.', 'scale(.82) → scale(1)', 'Scale'],
    ['scale-down', 'Scale Down / Zoom Out', 'Object becomes smaller without changing its depth.', 'scale(1) → scale(.80)', 'Scale'],
    ['rotate-z', 'Rotate Z', 'Rotate the object on the flat screen plane.', '−8° → +5° → 0°', 'Z-axis'],
    ['flip', 'Flip', 'A half turn reveals the back of the laptop.', 'rotateY(0°) → rotateY(180°)', 'Y-axis'],
    ['slide', 'Slide In', 'The object enters from the right and settles at center.', 'translateX(180px) → 0', 'X-axis'],
    ['rise', 'Rise Up', 'The object rises into place with a soft fade.', 'translateY(65px) + opacity', 'Y-axis']
  ]},
  { id: 'orientation', title: '3D orientation', note: 'Same position. A different relationship to the viewer.', items: [
    ['yaw', 'Yaw / Rotate Y', 'The right edge comes closer as the left edge moves away.', 'rotateY(−25°) → +15° → 0°', 'Y-axis'],
    ['pitch', 'Pitch / Rotate X', 'The top and bottom edges tilt toward and away from you.', 'rotateX(+24°) → −20° → 0°', 'X-axis'],
    ['roll', 'Roll / Rotate Z', 'Tilt sideways, like gently tilting your head.', 'rotateZ(−12°) → +12° → 0°', 'Z-axis'],
    ['tilt', 'Perspective Tilt', 'Two small rotations create an angled product view.', 'rotateX(10°) + rotateY(−20°)', 'X + Y'],
    ['turn', 'Perspective Turn', 'Turn farther to reveal the side, then return to the front.', 'front → rotateY(−48°) → front', 'Y-axis']
  ]},
  { id: 'depth', title: 'Position & depth', note: 'Move along an axis. Watch what changes and what stays still.', items: [
    ['move-x', 'Move X', 'Move horizontally while keeping the same orientation.', 'translateX(−55px) → +55px', 'X-axis'],
    ['move-y', 'Move Y', 'Move vertically while keeping the same orientation.', 'translateY(+36px) → −36px', 'Y-axis'],
    ['move-z', 'Move Z / Push Forward', 'Depth movement, not just scaling.', 'translateZ(−100px) → +100px', 'Z-axis']
  ]},
  { id: 'camera', title: 'Camera-like motion', note: 'Move the scene relative to the viewer. CSS camera simulations, not a 3D camera.', items: [
    ['push', 'Push In', 'Approach the laptop; nearby and distant layers grow differently.', 'scene translateZ(−100px → +90px)', 'Camera · Z'],
    ['pull', 'Pull Back', 'Retreat from the laptop to reveal more of the scene.', 'scene translateZ(+90px → −100px)', 'Camera · Z'],
    ['pan', 'Pan', 'Sweep the viewpoint horizontally across a stationary scene.', 'perspective-origin: 25% → 75%', 'Camera · X'],
    ['orbit', 'Orbit Simulation', 'Travel around the laptop to see its right and left sides.', 'rotateY + translateX + perspective', 'Simulation']
  ]},
  { id: 'ambient', title: 'Ambient motion', note: 'Quiet, continuous movement. These differences are intentionally small.', items: [
    ['float', 'Floating', 'A slow vertical float with a barely visible tilt.', 'translateY(±6px) + rotateZ(±1°)', 'Subtle'],
    ['drift', 'Gentle Drift', 'Drift slowly along a short diagonal path.', 'translate(−7px, +5px) → (+7px, −5px)', 'Subtle'],
    ['breathe', 'Breathing Motion', 'A tiny change in scale gives the object a gentle pulse.', 'scale(1) → 1.015 → 1', 'Subtle'],
    ['micro', 'Micro Rotation', 'A very small rotation keeps the object feeling alive.', 'rotateZ(−1.5°) → +1.5°', 'Subtle']
  ]},
  { id: 'easing', title: 'Easing comparison', note: 'Same laptop. Same 120 px journey. Same 2.4 seconds. Only the speed curve changes.', items: [
    ['linear', 'Linear', 'Constant speed from beginning to end.', 'f(t) = t', 'Easing'],
    ['ease-in', 'Ease In', 'Start slowly, then accelerate toward the end.', 'f(t) = t³', 'Easing'],
    ['ease-out', 'Ease Out', 'Start quickly, then slow down into the end.', 'f(t) = 1 − (1 − t)³', 'Easing'],
    ['ease-in-out', 'Ease In Out', 'Accelerate gently, then decelerate gently.', 'cubic ease-in-out', 'Easing'],
    ['overshoot', 'Overshoot', 'Travel past the destination, then settle back.', 'back ease-out', 'Easing'],
    ['bounce', 'Bounce', 'Arrive with a series of diminishing rebounds.', 'bounce ease-out', 'Easing'],
    ['elastic', 'Elastic', 'Stretch beyond the end, then oscillate into place.', 'elastic ease-out', 'Easing']
  ]},
  { id: 'pivot', title: 'Anchor & pivot', note: 'The green marker is the anchor. Change the anchor, change the arc.', items: [
    ['pivot-center', 'Center Pivot', 'Rotate around a fixed point at the center of the object.', 'transform-origin: 50% 50%', 'Pivot'],
    ['pivot-bottom', 'Bottom Pivot', 'Tilt up from an anchor on the bottom edge.', 'transform-origin: 50% 100%', 'Pivot'],
    ['pivot-left', 'Left Pivot', 'Open around the left edge, like a hinged panel.', 'transform-origin: 0% 50%', 'Pivot']
  ]},
  { id: 'polish', title: 'Visual polish', note: 'Observe the treatment, not the movement. Every effect can be switched off for comparison.', items: [
    ['shadow', 'No Shadow vs Soft Shadow', 'A soft shadow gives the object weight and separation.', 'Toggle effect to compare with no shadow.', 'Shadow'],
    ['contact', 'Contact Shadow', 'A small, dense shadow places the object on a surface.', 'Tighter shadow at the contact point.', 'Shadow'],
    ['blur', 'Motion Blur Simulation', 'A brief blur softens the fastest part of a movement.', 'CSS blur approximation; not shutter-based blur.', 'Simulation'],
    ['glow', 'Glow', 'A restrained halo separates the object from its background.', 'A low-opacity light layer behind the device.', 'Light'],
    ['reflection', 'Reflection', 'A faded mirror image suggests a polished surface.', 'CSS reflection approximation; not ray-traced.', 'Simulation'],
    ['rim', 'Rim Light', 'A narrow highlight defines the outer edges of the laptop.', 'Simulated edge lighting on the enclosure.', 'Simulation'],
    ['dof', 'Depth of Field Simulation', 'A sharp laptop and soft background suggest selective focus.', 'Fixed layer blur; not optical depth of field.', 'Simulation'],
    ['vignette', 'Vignette', 'Slightly darker edges guide attention toward the center.', 'A subtle radial exposure treatment.', 'Compositing']
  ]},
  { id: 'parallax', title: 'Parallax', note: 'Two layers, two speeds, one sense of depth.', items: [
    ['parallax', 'Parallax', 'Foreground and background move at different speeds to create depth.', 'foreground ±36px / background ±10px', 'Depth']
  ]},
  { id: 'combined', title: 'Combined Motion', note: 'Simple ingredients, carefully timed. An eight-second product study.', items: [
    ['combined', 'A quiet product moment', 'Rise, turn, approach, float, and settle into a composed final frame.', 'Rise → yaw → push in → float → settle', '8 seconds']
  ]}
];
