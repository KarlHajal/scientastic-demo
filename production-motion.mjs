import { tongueGeometry, vocalFoldPath } from './anatomy-geometry.mjs';

export const rhythmStarts = { short: [.10, .37, .64], long: [.10, .52, .76] };

/** Return the next closure, vowel, or pause in the illustrative syllable sequence. */
export function nextRhythmPhase(progress, pattern) {
  const phases = rhythmStarts[pattern].flatMap((start) => [start + .02, start + .09, start + .16]);
  return phases.find((point) => point > progress + .001) ?? phases[0];
}

/** Render simultaneous production events on one shared, qualitative time axis. */
export function coordinationTimeline(t, pattern) {
  const starts = rhythmStarts[pattern];
  const x = (time) => 115 + time * 390;
  return `<div class="coordination-timeline"><div class="rhythm-options" role="group" aria-label="${t('rhythmComparison')}">${['short', 'long'].map((id) => `<button data-action="rhythm-pattern" data-value="${id}" aria-pressed="${pattern === id}">${t(id === 'short' ? 'shortPause' : 'longPause')}</button>`).join('')}</div>
    <svg class="rhythm-score" viewBox="0 0 540 315" role="img" aria-label="${t('rhythmAlt')}">
      <defs><pattern id="voice-hatch" width="6" height="22" patternUnits="userSpaceOnUse"><path d="M3 0V22" stroke="currentColor" stroke-width="2" opacity=".4"/></pattern></defs>
      <g class="rhythm-grid">${starts.map((s) => `<path d="M${x(s)} 52V248"/>`).join('')}</g>
      <text x="12" y="104">${t('lungs')}</text><text x="12" y="164">${t('voice')}</text><text x="12" y="224">${t('lipsLabel')}</text>
      <rect class="breath-track" x="${x(.07)}" y="85" width="${390 * .87}" height="24" rx="8"/>
      ${starts.map((s, i) => `<text class="rhythm-syllable" data-syllable="${i}" x="${x(s + .07)}" y="48" text-anchor="middle">pa</text><rect class="voice-track" x="${x(s + .04)}" y="145" width="${390 * .10}" height="24" rx="6"/><rect class="voice-texture" x="${x(s + .04)}" y="145" width="${390 * .10}" height="24" rx="6" fill="url(#voice-hatch)"/>
      <rect class="lip-closed" x="${x(s)}" y="205" width="${390 * .04}" height="24" rx="3"/><rect class="lip-open" x="${x(s + .04)}" y="205" width="${390 * .10}" height="24" rx="4"/><text class="phoneme-label" x="${x(s + .02)}" y="245" text-anchor="middle">p</text><text class="phoneme-label" x="${x(s + .09)}" y="245" text-anchor="middle">a</text>`).join('')}
      <path class="rhythm-axis" d="M115 272H505m-7-4 7 4-7 4"/><text class="time-label" x="505" y="297" text-anchor="end">${t('timeLabel')}</text>
      <g class="rhythm-cursor"><path d="M0 59V255"/><circle cy="64" r="5"/></g>
    </svg><div class="rhythm-status"><span class="phase-symbol" aria-hidden="true"></span><p class="rhythm-phase" aria-live="off"></p></div>
    <button class="rhythm-step text-button" data-action="rhythm-step">${t('nextMovement')}</button></div>`;
}

/** Animate phonation independently of highlighting; return a frame disposer. */
export function mountProductionMotion({ root, state, t }) {
  let frame = 0, previous = null;
  const timeline = root.querySelector('.coordination-timeline');
  const tongue = root.querySelector('#animated-tongue');
  const position = root.querySelector('.vowel-position');
  const lips = root.querySelector('.anatomical-section .lips');
  const opening = root.querySelector('.lip-opening');
  const fold = root.querySelector('.section-vocal-fold');
  let rhythmPhase = 'pause';
  const isVoice = () => state.mode === 'animation'
    ? (state.part !== 'timing' || rhythmPhase === 'open') && (!state.sounding || state.sim.voiced)
    : state.sounding && state.sim.voiced;
  const duration = state.part === 'timing' ? 8000 : 7200;
  function draw() {
    const progress = (state.productionTime % duration) / duration;
    if (timeline) {
      timeline.querySelector('.rhythm-cursor').setAttribute('transform', `translate(${115 + progress * 390} 0)`);
      let phase = 'pause', active = -1;
      rhythmStarts[state.rhythmPattern].forEach((s, i) => {
        if (progress >= s && progress < s + .14) { phase = progress < s + .04 ? 'closed' : 'open'; active = i; }
      });
      timeline.dataset.phase = phase;
      rhythmPhase = phase;
      timeline.querySelector('.phase-symbol').textContent = phase === 'closed' ? 'p' : phase === 'open' ? 'a' : '·';
      timeline.querySelector('.rhythm-phase').textContent = t({ closed: 'phaseClosed', open: 'phaseOpen', pause: 'phasePause' }[phase]);
      timeline.querySelectorAll('[data-syllable]').forEach((node, i) => node.classList.toggle('active', i === active));
      const head = root.querySelector('.anatomical-section');
      head.dataset.phase = phase;
      // Lip closure produces /p/; the tongue stays low for the following /a/.
      const local = active < 0 ? 0 : progress - rhythmStarts[state.rhythmPattern][active];
      const smooth = (value) => { const x = Math.max(0, Math.min(1, value)); return x * x * (3 - 2 * x); };
      const aperture = phase === 'closed' ? .35 * (1 - smooth(local / .015))
        : phase === 'open' ? smooth((local - .04) / .02) * (1 - .65 * smooth((local - .115) / .025)) : .35;
      const upper = 238.5 - 5.5 * aperture, lower = 238.5 + 5.5 * aperture;
      lips.setAttribute('d', `M264 224Q263 ${upper + 2} 254 ${upper}M264 248Q260 ${lower - 2} 254 ${lower}`);
      opening.setAttribute('d', `M254 ${upper}L254 ${lower}L248 ${lower - 1.5 * aperture}L248 ${upper + 1.5 * aperture}Z`);
      const preparation = Math.max(...rhythmStarts[state.rhythmPattern].map((start) =>
        smooth((progress - start + .035) / .035) * (1 - smooth((progress - start - .14) / .035))));
      tongue.setAttribute('d', tongueGeometry({ front: .5, height: .6 - .52 * preparation }).path);
      position.textContent = phase === 'closed' ? 'p' : phase === 'open' ? 'a' : '';
      root.querySelectorAll('.anatomical-section .lung').forEach((lung) => {
        const breath = Math.max(0, Math.min(1, (progress - .07) / .87));
        lung.style.transform = `scale(${1.04 - breath * .07},${1.08 - breath * .12})`;
      });
      const air = head.querySelector('.section-airflow');
      air.style.strokeDashoffset = String(-progress * 90);
      air.style.opacity = progress >= .07 && progress <= .94 ? '1' : '.25';
    }
    if (fold) {
      // A single profile stays in the sagittal section; the motion is slowed.
      const displacement = isVoice() ? 1.2 * Math.sin(state.productionTime / 55) : 0;
      fold.setAttribute('d', vocalFoldPath(displacement));
    }
    if (tongue && state.part === 'tongue') {
      // Hold each vowel, then interpolate the surface while the attachment stays fixed.
      const vowels = [[.5, 0], [1, 1], [0, 1]];
      const segment = progress * 3, index = Math.floor(segment), local = segment - index;
      const blend = Math.max(0, Math.min(1, (local - .35) / .65));
      const eased = blend * blend * (3 - 2 * blend);
      const from = vowels[index], to = vowels[(index + 1) % 3];
      tongue.setAttribute('d', tongueGeometry({ front: from[0] + (to[0] - from[0]) * eased, height: from[1] + (to[1] - from[1]) * eased }).path);
      const rounded = (index === 2 ? 1 - eased : index === 1 ? eased : 0);
      const tip=254+rounded*2;
      lips.setAttribute('d', `M264 224Q${263+rounded*2} 235 ${tip} 233M264 248Q${260+rounded*2} 242 ${tip} 244`);
      opening.setAttribute('d', `M${tip} 233L${tip} 244L248 242L248 235Z`);
      position.textContent = ['A', 'I', state.language === 'fr' ? 'OU' : 'OO'][index];
    }
  }
  function tick(now) {
    if (previous !== null) state.productionTime += Math.min(now - previous, 80);
    previous = now;
    draw();
    frame = requestAnimationFrame(tick);
  }
  draw();
  // Pausing the explanatory animation must not freeze an actively played vowel.
  const motionAllowed = state.mode === 'simulation' ? state.sounding : state.motion;
  if (motionAllowed && !document.hidden && ((state.mode === 'animation' && (timeline || state.part === 'tongue')) || isVoice())) frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}
