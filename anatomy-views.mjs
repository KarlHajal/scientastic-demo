import { pathData, tongueGeometry, tongueControlRegion, vocalFoldPath } from './anatomy-geometry.mjs';
import { headContour, sectionArtwork } from './anatomy-shapes.mjs';

/** Render the published section at its original aspect ratio with local motion. */
export function anatomicalSection({t,settings,simulation=false,hotspot}) {
  const tongue=tongueGeometry(settings,{interactive:simulation});
  const prefix=simulation?'section-sim':'section-animation';
  return `<svg ${simulation?'id="tongue-pad"':''} class="anatomy-svg anatomical-section" viewBox="${simulation?'80 85 235 285':'-30 20 440 430'}" preserveAspectRatio="xMidYMid meet" role="${simulation?'img':'group'}" aria-label="${t(simulation?'padLabel':'sectionAlt')}">
    <defs><linearGradient id="${prefix}-tongue" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e0b1a9"/><stop offset="1" stop-color="#ce9690"/></linearGradient><radialGradient id="${prefix}-lung"><stop stop-color="#bfd6ce"/><stop offset="1" stop-color="#91b9ac"/></radialGradient><clipPath id="${prefix}-crop"><rect x="85" y="32" width="220" height="337"/></clipPath></defs>
    <g class="section-structure" clip-path="url(#${prefix}-crop)">
      <path class="section-skin" d="${pathData(headContour)}" fill="transparent" stroke="none"/>
      <g class="medical-illustration">${sectionArtwork}</g>
      <g class="organ organ-tongue"><path ${simulation?'id="model-tongue"':'id="animated-tongue"'} class="section-tongue" d="${tongue.path}" fill="url(#${prefix}-tongue)" stroke="#bd8580" stroke-width="1.2"/>
        <path class="lip-opening" d="M254 233L254 244L248 242L248 235Z" fill="#fcfbf8"/>
        <path class="lips" d="M264 224Q263 235 254 233M264 248Q260 242 254 244" fill="none" stroke="#c08b84" stroke-width="2.5" stroke-linecap="round"/>
      </g>
      <g class="organ organ-folds"><path class="section-vocal-fold fold" d="${vocalFoldPath()}" fill="#957da2" stroke="#786285" stroke-width="1"/></g>
    </g>
    ${simulation?`<path class="controller-region" d="${tongueControlRegion()}" fill="var(--action)" fill-opacity=".06" stroke="var(--action)" stroke-opacity=".6" stroke-width=".9" stroke-dasharray="2 2"/><path id="limited-area" d="${tongueControlRegion(true)}" fill="var(--action)" fill-opacity=".1" stroke="var(--action)" stroke-width=".7" stroke-dasharray="1 2" ${settings.limited?'':'hidden'}/><circle id="tongue-halo" cx="${tongue.x}" cy="${tongue.y}" r="8" fill="var(--action)" fill-opacity=".14"/><circle id="tongue-handle" cx="${tongue.x}" cy="${tongue.y}" r="5.5" fill="var(--action)" stroke="#fff" stroke-width="1.3"/>`:`
      <path class="section-trachea" d="M155 366V397" fill="none" stroke="#b0c7c9" stroke-width="11"/><path d="M155 366V397" fill="none" stroke="#f5faf8" stroke-width="7"/>
      <g class="chest-view organ organ-lungs" transform="translate(-5 0)"><path class="lung lung-left" d="M152 383C140 379 122 394 117 410C112 425 122 432 135 429L152 421Z" fill="url(#${prefix}-lung)" stroke="#73998c" stroke-width="1.1"/><path class="lung lung-right" d="M168 383C180 379 198 394 203 410C208 425 198 432 185 429L168 421Z" fill="url(#${prefix}-lung)" stroke="#73998c" stroke-width="1.1"/><path d="M160 381V397L144 411M160 397L176 411" fill="none" stroke="#70988c" stroke-width="3" stroke-linecap="round"/></g>
      <path class="airflow section-airflow" d="M155 397V352" fill="none" stroke="#3c97a4" stroke-width="2" stroke-dasharray="1 4" stroke-linecap="round"/>
      <g class="figure-labels"><path d="M223 260L292 257H310M153 341H85M199 413H310"/><text x="320" y="264">${t('tongueShort')}</text><text x="78" y="347" text-anchor="end">${t('foldsLabel')}</text><text x="320" y="420">${t('lungsLabel')}</text></g>
      <text class="vowel-position" x="340" y="307" text-anchor="middle"></text>
      <g class="section-hotspots">${hotspot('tongue',338,220)}${hotspot('folds',38,380)}${hotspot('lungs',338,380)}</g>
    `}</svg>`;
}
