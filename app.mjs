import { coordinationTimeline, mountProductionMotion, nextRhythmPhase } from './production-motion.mjs';
import { anatomicalSection } from './anatomy-views.mjs';
import { tongueGeometry, tongueSettingsAt } from './anatomy-geometry.mjs';
import { vowelSettings, clipLabelKey } from './model.mjs';
import { parseDemo, styleSynthesisExamples } from './assets.mjs';
import { drawOutputWaveform } from './waveform.mjs';
import { researchCopy } from './research-copy.mjs';
import { researchViews } from './research.mjs';
import { EducationalVoice } from './voice.mjs';
import { assetURL } from './urls.mjs';

const copy = {
  "fr": {
    "title": "Synthèse vocale pour la santé",
    "event": "Scientastic · EPFL",
    "skip": "Aller au contenu",
    "reset": "Recommencer",
    "interfaceLanguage": "Langue de l'interface",
    "nav": "Les étapes",
    "listen": "Écouter",
    "explore": "Explorer",
    "listenTitle": "Écoutez et comparez les deux enregistrements",
    "listenLead": "Comparez les deux extraits.",
    "typical": "Parole typique",
    "atypical": "Parole atypique",
    "play": "Écouter",
    "stop": "Arrêter",
    "replay": "Réécouter",
    "waiting": "Indisponible",
    "waitingNote": "Extraits indisponibles.",
    "loading": "Chargement…",
    "unavailable": "Extraits indisponibles.",
    "sentence": "Phrase",
    "sentenceWaiting": "Phrase indisponible.",
    "reveal": "Afficher le texte",
    "hide": "Masquer le texte",
    "translation": "Traduction française",
    "languageLabel": "Langue",
    "en": "Anglais",
    "fr": "Français",
    "observations": "Différences entendues",
    "observeHelp": "",
    "rhythm": "Rythme",
    "voice": "Voix",
    "articulation": "Articulation",
    "rhythmHint": "",
    "voiceHint": "",
    "articulationHint": "",
    "continue": "Production de la parole",
    "continueShort": "Production",
    "example": "Exemple",
    "human": "Enregistrement humain",
    "synthesized": "Parole synthétisée",
    "converted": "Enregistrement transformé",
    "exploreTitle": "Production de la parole",
    "exploreLead": "Sélectionnez une partie.",
    "animation": "Animation",
    "simulation": "Simulation",
    "modes": "Modes d'exploration",
    "lungs": "Le souffle",
    "folds": "La voix",
    "tongue": "L'articulation",
    "timing": "La coordination",
    "lungsTitle": "Souffle",
    "lungsText": "L’air expiré remonte des poumons vers le larynx.",
    "lungsChange": "Un souffle limité peut modifier la parole.",
    "foldsTitle": "Plis vocaux",
    "foldsText": "Leur vibration produit les sons voisés.",
    "foldsChange": "Leur vibration modifie la qualité de la voix.",
    "tongueTitle": "Articulation",
    "tongueText": "La langue et les lèvres façonnent les sons.",
    "tongueChange": "Des mouvements moins précis modifient les sons.",
    "timingTitle": "Coordination",
    "timingText": "Les mouvements s’enchaînent pour produire les sons et les pauses.",
    "timingChange": "Leur coordination modifie le rythme.",
    "changes": "Difficultés possibles",
    "anatomyCaption": "Schéma simplifié",
    "anatomyAlt": "Schéma du souffle, des plis vocaux et de la bouche, avec une bande de coordination séparée.",
    "pause": "Pause",
    "resume": "Animer",
    "lungsLabel": "Poumons",
    "foldsLabel": "Plis vocaux",
    "tongueLabel": "Langue et lèvres",
    "airLabel": "Trajet de l'air",
    "timingLabel": "Mouvements dans le temps",
    "simTitle": "Sons de voyelles",
    "simLead": "",
    "simLabel": "",
    "startSound": "Écouter",
    "stopSound": "Arrêter",
    "playing": "Son actif",
    "silent": "Son coupé",
    "front": "Position de la langue",
    "backLabel": "Arrière",
    "frontLabel": "Avant",
    "height": "Hauteur de la langue",
    "low": "Basse",
    "high": "Haute",
    "pitch": "Hauteur de la voix",
    "deep": "Grave",
    "highPitch": "Aiguë",
    "voicing": "Vibration",
    "voiced": "Avec vibration",
    "unvoiced": "Souffle seul",
    "limit": "Limiter les mouvements",
    "limitHelp": "",
    "simNote": "Modèle simplifié, sans correspondance avec un diagnostic.",
    "presets": "Voyelles",
    "simReset": "Réinitialiser",
    "padLabel": "Position de langue du modèle. Utilisez les curseurs pour le contrôle au clavier.",
    "sources": "Sources",
    "sourcesText": "L'animation illustre des mécanismes de production. Les sons de la simulation sont générés localement, sans enregistrer votre voix. Les paramètres sont illustratifs, sans validation clinique.",
    "sourceVoice": "NIDCD : production de la voix",
    "sourceDisorder": "ASHA : dysarthrie",
    "sourceModel": "NCVS : sons et résonances",
    "footer": "Synthèse de parole pathologique",
    "back": "Écoute",
    "audioError": "Cet extrait ne peut pas être lu. Essayez l'autre extrait ou poursuivez l'exploration.",
    "simError": "Le son n'a pas pu démarrer dans ce navigateur.",
    "motionHint": "Vous pouvez mettre les mouvements en pause.",
    "progress": "Lecture de l'extrait",
    "done": "Lecture terminée"
  },
  "en": {
    "title": "Speech synthesis for health",
    "event": "Scientastic · EPFL",
    "skip": "Skip to content",
    "reset": "Start again",
    "interfaceLanguage": "Interface language",
    "nav": "The steps",
    "listen": "Listen",
    "explore": "Explore",
    "listenTitle": "Listen and compare the two recordings",
    "listenLead": "Compare the two recordings.",
    "typical": "Typical speech",
    "atypical": "Atypical speech",
    "play": "Play",
    "stop": "Stop",
    "replay": "Replay",
    "waiting": "Unavailable",
    "waitingNote": "Recordings unavailable.",
    "loading": "Loading…",
    "unavailable": "Recordings unavailable.",
    "sentence": "Sentence",
    "sentenceWaiting": "Sentence unavailable.",
    "reveal": "Show text",
    "hide": "Hide text",
    "translation": "English translation",
    "languageLabel": "Language",
    "en": "English",
    "fr": "French",
    "observations": "Differences",
    "observeHelp": "",
    "rhythm": "Rhythm",
    "voice": "Voice",
    "articulation": "Articulation",
    "rhythmHint": "",
    "voiceHint": "",
    "articulationHint": "",
    "continue": "Speech production",
    "continueShort": "Production",
    "example": "Example",
    "human": "Human recording",
    "synthesized": "Synthesized speech",
    "converted": "Transformed recording",
    "exploreTitle": "Speech production",
    "exploreLead": "Select a part.",
    "animation": "Animation",
    "simulation": "Simulation",
    "modes": "Exploration modes",
    "lungs": "Breath",
    "folds": "Voice",
    "tongue": "Articulation",
    "timing": "Coordination",
    "lungsTitle": "Airflow",
    "lungsText": "Exhaled air flows from the lungs to the larynx.",
    "lungsChange": "Limited airflow can affect speech.",
    "foldsTitle": "Vocal folds",
    "foldsText": "Their vibration produces voiced sounds.",
    "foldsChange": "Changes in vibration affect voice quality.",
    "tongueTitle": "Articulation",
    "tongueText": "The tongue and lips shape speech sounds.",
    "tongueChange": "Less precise movements change the sounds.",
    "timingTitle": "Coordination",
    "timingText": "Movements are timed to produce sounds and pauses.",
    "timingChange": "Changes in coordination affect rhythm.",
    "changes": "Possible difficulties",
    "anatomyCaption": "Simplified diagram",
    "anatomyAlt": "Illustration of airflow, vocal folds, and mouth, with a separate coordination strip.",
    "pause": "Pause",
    "resume": "Animate",
    "lungsLabel": "Lungs",
    "foldsLabel": "Vocal folds",
    "tongueLabel": "Tongue and lips",
    "airLabel": "Airflow",
    "timingLabel": "Movements over time",
    "simTitle": "Vowel sounds",
    "simLead": "",
    "simLabel": "",
    "startSound": "Play",
    "stopSound": "Stop",
    "playing": "Sound on",
    "silent": "Sound off",
    "front": "Tongue position",
    "backLabel": "Back",
    "frontLabel": "Front",
    "height": "Tongue height",
    "low": "Low",
    "high": "High",
    "pitch": "Voice pitch",
    "deep": "Lower",
    "highPitch": "Higher",
    "voicing": "Vibration",
    "voiced": "With vibration",
    "unvoiced": "Air only",
    "limit": "Limit movement",
    "limitHelp": "",
    "simNote": "Simplified model, without a link to a diagnosis.",
    "presets": "Vowels",
    "simReset": "Reset",
    "padLabel": "Tongue position in the model. Use the sliders for keyboard control.",
    "sources": "Sources",
    "sourcesText": "The animation illustrates speech-production mechanisms. Simulation sounds are generated locally without recording your voice. The parameters are illustrative and have not been clinically validated.",
    "sourceVoice": "NIDCD: voice production",
    "sourceDisorder": "ASHA: dysarthria",
    "sourceModel": "NCVS: sounds and resonances",
    "footer": "Pathological speech synthesis",
    "back": "Listening",
    "audioError": "This recording could not be played. Try the other recording or continue exploring.",
    "simError": "Sound could not start in this browser.",
    "motionHint": "You can pause the movements.",
    "progress": "Recording playback",
    "done": "Playback finished"
  }
};

for (const language of ['fr', 'en']) Object.assign(copy[language], researchCopy[language]);

Object.assign(copy.fr, {
  "palateLabel": "Palais dur",
  "softPalateLabel": "Voile du palais",
  "jawLabel": "Mandibule",
  "hyoidLabel": "Os hyoïde",
  "frontView": "Vue de face",
  "topView": "Vue du dessus",
  "lipsLabel": "Lèvres",
  "rhythmComparison": "Durée des pauses",
  "shortPause": "Pauses courtes",
  "longPause": "Une pause plus longue",
  "timeLabel": "Temps",
  "nextMovement": "Mouvement suivant",
  "phaseClosed": "Lèvres fermées : p",
  "phaseOpen": "Lèvres ouvertes et voix : a",
  "phasePause": "Pause",
  "rhythmAlt": "Trois syllabes pa sur un même axe temporel : souffle, vibration vocale et ouverture des lèvres.",
  "timingText": "Le souffle, la voix et les lèvres se coordonnent dans le temps.",
  "timingChange": "Comparez les pauses entre les syllabes.",
  "timingCaption": "Séquence schématique, ralentie",
  "sectionCaption": "Coupe médiane schématique · mouvements ralentis",
  "sectionAlt": "Coupe médiane de la tête et du cou. Plis vocaux dans le larynx, poumons vus de face.",
  "sourceArticulation": "LMU : images IRM des voyelles"
});
Object.assign(copy.en, {
  "palateLabel": "Hard palate",
  "softPalateLabel": "Soft palate",
  "jawLabel": "Mandible",
  "hyoidLabel": "Hyoid bone",
  "frontView": "Front view",
  "topView": "Top view",
  "lipsLabel": "Lips",
  "rhythmComparison": "Pause duration",
  "shortPause": "Short pauses",
  "longPause": "One longer pause",
  "timeLabel": "Time",
  "nextMovement": "Next movement",
  "phaseClosed": "Lips closed: p",
  "phaseOpen": "Lips open and voice: a",
  "phasePause": "Pause",
  "rhythmAlt": "Three pa syllables on one time axis: breath, vocal-fold vibration and lip opening.",
  "timingText": "Breath, voice and lip movements are coordinated in time.",
  "timingChange": "Compare the pauses between syllables.",
  "timingCaption": "Illustrative sequence, slowed down",
  "sectionCaption": "Schematic midsagittal section · slowed movements",
  "sectionAlt": "Midsagittal section of the head and neck. Vocal folds within the larynx; lungs shown from the front.",
  "sourceArticulation": "LMU: MRI of vowel articulation"
});

const listeningCues = ['voice', 'articulation', 'prosody', 'rhythm'];
const parts = ['lungs', 'folds', 'tongue', 'timing'];
const defaultSim = () => ({ front: 0.5, height: 0.6, pitch: 135, voiced: true, limited: false });
const state = {
  palette: 'wii', language: 'fr', step: 1, visual: 'section', mode: 'animation', part: 'lungs', pairs: [], pair: 0,
  revealedCues: new Set(), reveal: true, played: new Set(), audio: null, progress: 0,
  loading: true, failed: false, error: '', motion: !matchMedia('(prefers-reduced-motion: reduce)').matches,
  productionTime: 0, rhythmPattern: 'short', sim: defaultSim(), sounding: false, lesson: 'tongue', sceneView: {},
  demo: parseDemo({ version: 1, pairs: [] }),
  synthesisMode: 'rnv', rnvControl: 'vowels', rnvFactor: 2, reconstructionExample: 0, reconstructionRevealed: false, synthesisExample: 0, variant: 0, outputWords: false, application: 'augmentation', augmentationRevealed: false,
};
const root = document.querySelector('#app');
let disposeProductionMotion = () => {};
const t = (key) => copy[state.language][key] ?? key;
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const pair = () => state.pairs[state.pair];
const clipLabel = (type, clip) => t(type === 'typical' ? 'typical' : clipLabelKey(type, clip));
const audio = new Audio();
audio.preload = 'metadata';
let productionScene = null;
const voice = new EducationalVoice(() => { state.sounding = false; syncSoundButton(); });
const shapes = {
  play: '<path d="m9 5 11 7-11 7Z"/>', stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>', back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  reset: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>', check: '<path d="m5 12 4 4L19 6"/>',
  sound: '<path d="m4 9 4 0 5-4v14l-5-4H4Zm12-1a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  pause: '<path d="M8 5v14M16 5v14"/>', plus: '<path d="M12 5v14M5 12h14"/>',
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${shapes[name] ?? shapes.sound}</svg>`;

function navigation() {
  return `<a class="skip" href="#content">${t('skip')}</a><header class="demo-header"><nav class="steps" aria-label="${t('nav')}">${[1, 2, 3, 4, 5].map((step) => `<button data-action="step" data-value="${step}" ${state.step === step ? 'aria-current="step"' : ''}><span>0${step}</span>${t(['listen', 'explore', 'transcribe', 'synthesize', 'applications'][step - 1])}</button>`).join('')}<div class="step-line" aria-hidden="true"></div></nav></header>`;
}

function footer() {
  return `<footer class="institution-footer"><a class="brand footer-brand" href="#" data-action="step" data-value="1" aria-label="${t('title')}"><strong>${t('title')}</strong></a><div class="footer-controls"><div class="language" aria-label="${t('interfaceLanguage')}"><button data-action="language" data-value="fr" lang="fr" aria-pressed="${state.language === 'fr'}">Français</button><button data-action="language" data-value="en" lang="en" aria-pressed="${state.language === 'en'}">English</button></div><button class="reset icon-button" data-action="reset" aria-label="${t('reset')}" title="${t('reset')}">${icon('reset')}</button></div><div class="institution-logos"><a href="https://www.epfl.ch/" target="_blank" rel="noreferrer"><img class="epfl-logo" src="${assetURL('/media/branding/epfl.svg')}" alt="EPFL"></a><a href="https://www.idiap.ch/" target="_blank" rel="noreferrer"><img class="idiap-logo" src="${assetURL('/media/branding/idiap.png')}" alt="Idiap Research Institute"></a><a href="https://www.snf.ch/" target="_blank" rel="noreferrer"><img class="snsf-logo" src="${assetURL('/media/branding/snsf.png')}" alt="${t('snsfName')}"></a></div></footer>`;
}

function listen() {
  const current = pair();
  const translation = current?.sentence === 'Hey Google, sing me a song.' ? '' : current?.translations[state.language];
  return `<div class="page-heading"><h1 id="page-title" tabindex="-1">${t('listenTitle')}</h1></div>
  ${state.pairs.length > 1 ? `<select class="example-select" id="pair-select" aria-label="${t('example')}">${state.pairs.map((_, i) => `<option value="${i}" ${state.pair === i ? 'selected' : ''}>${t('example')} ${i + 1}</option>`).join('')}</select>` : ''}
  <section class="listening" aria-label="${t('listen')}"><div class="sentence"><div class="sentence-content">${current?.sentence ? `<p lang="${esc(current.language)}">“${esc(current.sentence)}”</p>${translation && !current.language.startsWith(state.language) ? `<p class="translation">${esc(translation)}</p>` : ''}` : `<p class="placeholder">${t('sentenceWaiting')}</p>`}</div></div>
  <div class="audio-pair">${['typical', 'atypical'].map((type) => {
    const recording = current?.[type], available = Boolean(recording?.src), playing = state.audio === type;
    return `<article class="audio-card ${type} ${playing ? 'is-playing' : ''}"><h2>${clipLabel(type, recording)}</h2><button class="play-button" data-action="audio" data-value="${type}" ${available ? '' : 'disabled'} aria-label="${t(playing ? 'stop' : 'play')} · ${clipLabel(type, recording)}">${icon(playing ? 'stop' : 'play')}</button><div class="play-progress" role="progressbar" aria-label="${t('progress')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${playing ? state.progress : 0}" style="--progress:${playing ? state.progress : 0}%"><span></span></div></article>`;
  }).join('')}</div>${!current?.typical.src || !current?.atypical.src ? `<p class="missing-notice" role="status">${t(state.loading ? 'loading' : state.failed ? 'unavailable' : 'waitingNote')}</p>` : ''}</section>
  <section class="observations"><h2>${t('observations')}</h2><div class="observation-options">${listeningCues.map((id, i) => {
    const revealed = state.revealedCues.has(id);
    return `<button class="observation reveal-card ${revealed ? 'revealed' : ''}" data-action="observe" data-value="${id}" aria-expanded="${revealed}" aria-label="${t(revealed ? 'hideCue' : 'revealCue')} ${i + 1}"><span class="cue-flipper"><span class="cue-front" aria-hidden="${revealed}"><span class="cue-number">${i + 1}</span></span><span class="cue-answer" aria-hidden="${!revealed}"><strong>${t(id)}</strong></span></span></button>`;
  }).join('')}</div></section>`;
}

function hotspot(part, x, y) {
  return `<g class="hotspot" role="button" tabindex="0" aria-label="${t(part)}" aria-pressed="${state.part === part}" data-action="part" data-value="${part}" transform="translate(${x} ${y})"><circle r="15"/><path d="M-6 0H6M0-6V6"/></g>`;
}

function classicAnatomy() {
  return `<div class="anatomy ${state.motion ? '' : 'motion-paused'}" data-region="${state.part}"><svg class="anatomy-svg" viewBox="0 0 600 565" role="group" aria-label="${t('anatomyAlt')}"><defs><linearGradient id="skin" x1="0" x2="1"><stop stop-color="#f5e5d9"/><stop offset="1" stop-color="#fcefe3"/></linearGradient><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#ccd9d3"/></pattern></defs><rect width="600" height="565" fill="url(#dots)" opacity=".45"/><ellipse cx="300" cy="460" rx="190" ry="18" fill="#e5ebe5"/>
  <path class="head-outline" d="M226 354 231 287C202 252 188 207 191 156 193 99 217 48 266 37 327 19 382 54 393 98L402 128 441 156Q450 166 427 174L418 182Q439 188 428 199L416 208Q421 230 402 248C382 269 356 280 342 291L341 354Z" fill="url(#skin)" stroke="#bdb5a7" stroke-width="2"/>
  <path d="M398 126 340 134Q300 141 283 170" stroke="#cdb7ab" stroke-width="2" fill="none"/>
  <path class="oral-space" d="M284 190Q334 168 420 182L421 205Q364 240 286 224Z" fill="#fffcf7" stroke="#c2c4b6" stroke-width="2"/>
  <path class="trachea" d="M278 215 278 357" stroke="#fdfcf6" stroke-width="25" stroke-linecap="round"/>
  <path d="M278 227v129" stroke="#a4bab0" stroke-width="2" stroke-dasharray="2 12"/>
  <g class="organ organ-lungs"><path class="lung lung-left" d="M260 360C234 352 207 369 190 398 175 425 183 451 214 451L261 440Z" fill="#a3cec4" stroke="#468e80" stroke-width="2"/><path class="lung lung-right" d="M296 360C323 352 350 369 366 398 382 425 374 451 343 451L295 440Z" fill="#a3cec4" stroke="#468e80" stroke-width="2"/><path d="M278 343v34m0-10-38 37m38-37 39 37" fill="none" stroke="#45877c" stroke-width="7" stroke-linecap="round"/></g>
  <path class="airflow" d="M278 423V321L278 230Q280 192 329 191L431 191" fill="none" stroke="#218e88" stroke-width="5" stroke-dasharray="5 13" stroke-linecap="round"/>
  <g class="organ organ-folds"><rect x="256" y="292" width="44" height="34" rx="13" fill="#d9c9e5" stroke="#82659d" stroke-width="2"/><path class="fold fold-left" d="M264 299Q280 306 265 318" fill="none" stroke="#73518d" stroke-width="5" stroke-linecap="round"/><path class="fold fold-right" d="M292 299Q276 306 291 318" fill="none" stroke="#73518d" stroke-width="5" stroke-linecap="round"/></g>
  <g class="organ organ-tongue"><path class="tongue" d="M286 223Q303 188 339 202T396 210Q371 236 286 223Z" fill="#dd9892" stroke="#b56d6a" stroke-width="2"/><path class="lips" d="M421 182Q436 187 426 195M420 207Q432 202 426 195" fill="none" stroke="#b96667" stroke-width="5" stroke-linecap="round"/></g>
  <g class="diagram-label"><path d="M192 410H93"/><text x="40" y="401">${t('lungsLabel')}</text><path d="M257 309H116"/><text x="40" y="299">${t('foldsLabel')}</text><path d="M364 208H488"/><text x="389" y="247">${t('tongueLabel')}</text><text class="air-label" x="314" y="359">${t('airLabel')}</text></g>
  ${hotspot('lungs', 193, 386)}${hotspot('folds', 229, 309)}${hotspot('tongue', 449, 216)}
  <g class="organ organ-timing"><rect x="75" y="490" width="450" height="56" rx="20" fill="#e9e6ee"/><text x="94" y="513" class="timing-text">${t('timingLabel')}</text>${Array.from({ length: 7 }, (_, i) => `<rect class="timing-beat" x="${294 + i * 27}" y="513" width="13" height="${[12, 21, 16, 27, 12, 21, 17][i]}" rx="5" fill="#88709e" style="animation-delay:${i * 0.18}s"/>`).join('')}</g>${hotspot('timing', 520, 500)}
  </svg><span class="anatomy-caption">${t('anatomyCaption')}</span><button class="motion-toggle" data-action="motion" aria-pressed="${state.motion}">${icon(state.motion ? 'pause' : 'play')}${t(state.motion ? 'pause' : 'resume')}</button></div>`;
}

function sceneFigure(simulation = false) {
  return '<div id="anatomy-3d" class="scene-host" data-scene="loading"><div class="scene-fallback">' + anatomicalSection({ t, settings: state.sim, simulation, hotspot }) + '</div><button class="scene-reset text-button" data-action="scene-reset">' + icon('reset') + t('resetView') + '</button><p class="scene-status" role="status"></p></div>';
}

function anatomy() {
  const figure = anatomicalSection({ t, settings: state.sim, hotspot });
  return '<div class="anatomy ' + (state.motion ? '' : 'motion-paused') + '" data-region="' + state.part + '">' + figure + '<button class="motion-toggle" data-action="motion" aria-pressed="' + state.motion + '">' + icon(state.motion ? 'pause' : 'play') + t(state.motion ? 'pause' : 'resume') + '</button></div>';
}

function animationView() {
  const part = state.part;
  const explanation = part === 'timing'
    ? `<section class="coordination-panel" aria-label="${t('timingTitle')}">${coordinationTimeline(t, state.rhythmPattern)}</section>`
    : `<section class="explanation" aria-live="polite"><h2>${t(`${part}Title`)}</h2><p class="part-description">${t(`${part}Text`)}</p><div class="change-note"><p>${t(`${part}Change`)}</p></div>${['folds', 'tongue'].includes(part) ? `<button class="mechanism-link" data-action="lesson" data-value="${part === 'folds' ? 'voicing' : 'tongue'}">${t('tryMechanism')}${icon('arrow')}</button>` : ''}</section>`;
  return `<div class="anatomy-layout production-stage" data-part="${part}"><div class="part-picker" role="group" aria-label="${t('explore')}">${parts.map((part, i) => `<button data-action="part" data-value="${part}" aria-pressed="${state.part === part}"><span>0${i + 1}</span>${t(part)}</button>`).join('')}</div>${anatomy()}${explanation}</div>`;
}

function slider(id, title, value, min, max, left, right) {
  return `<label class="slider-label" for="${id}">${t(title)}</label><input id="${id}" type="range" min="${min}" max="${max}" value="${value}" data-control="${id}"><div class="range-ends"><span>${t(left)}</span><span>${t(right)}</span></div>`;
}

function classicPad() {
  return `<svg id="tongue-pad" viewBox="0 0 560 330" role="img" aria-label="${t('padLabel')}"><defs><pattern id="pad-grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#c6d7d1"/></pattern></defs><rect x="48" y="38" width="464" height="236" rx="30" fill="#fafbf6" stroke="#cedbd2"/><rect x="48" y="38" width="464" height="236" rx="30" fill="url(#pad-grid)"/>
  <path class="model-roof" d="M86 234V145Q86 73 160 73H428Q466 73 466 109" fill="none" stroke="#8daba2" stroke-width="12" stroke-linecap="round"/>
  <path id="model-tongue" d="" fill="#dfb2a5" fill-opacity=".8" stroke="#b7867a" stroke-width="2"/>
  <rect id="limited-area" x="207.2" y="135.6" width="145.6" height="52.8" rx="20" fill="#e7def0" fill-opacity=".5" stroke="#8b6aa0" stroke-dasharray="5 5" ${state.sim.limited ? '' : 'hidden'}/>
  <circle id="tongue-halo" r="28" fill="var(--action)" fill-opacity=".09"/><circle id="tongue-handle" r="17" fill="var(--action)" stroke="#fff" stroke-width="5"/>
  <text x="72" y="306">${t('backLabel')}</text><text x="469" y="306">${t('frontLabel')}</text><text x="70" y="25">${t('high')}</text><text x="70" y="263">${t('low')}</text></svg>`;
}

function simulationView() {
  const settings = vowelSettings(state.sim.front, state.sim.height, state.sim.limited);
  const figure = state.visual === 'diagram' ? classicPad() : state.visual === '3d' ? sceneFigure(true) : anatomicalSection({ t, settings: state.sim, simulation: true, hotspot });
  return `${lessonGuide()}<div class="simulation-layout production-stage" data-lesson="${state.lesson}"><aside class="simulation-context"><h2>${t('simTitle')}</h2><div class="presets"><div>${['a', 'i', 'u'].map((vowel) => `<button data-action="preset" data-value="${vowel}" aria-label="[${vowel}]">${vowel === 'u' ? (state.language === 'fr' ? 'OU' : 'OO') : vowel.toUpperCase()}</button>`).join('')}</div></div><div class="sound-play-actions"><button class="button primary" id="sound-button" data-action="sound" aria-pressed="${state.sounding}">${icon(state.sounding ? 'stop' : 'sound')}<span>${t(state.sounding ? 'stopSound' : 'startSound')}</span></button><button class="text-button" data-action="sim-reset">${t('simReset')}</button></div></aside><section class="sound-playground ${state.sounding ? 'is-sounding' : ''} ${state.motion ? '' : 'motion-paused'}" data-voiced="${state.sim.voiced}" data-region="${state.lesson === 'voicing' ? 'folds' : 'tongue'}"><div class="simulation-heading"><span class="sound-state ${state.sounding ? 'on' : ''}">${t(state.sounding ? 'playing' : 'silent')}</span></div>${figure}<p class="drag-hint">${t(state.visual === '3d' ? 'dragSceneTongue' : 'dragTongue')}</p></section><section class="sound-controls" aria-label="${t('simulationControls')}"><section class="simulation-control-group ${state.lesson === 'tongue' ? 'is-relevant' : ''}" data-control-group="tongue" data-number="01" aria-labelledby="control-tongue"><h3 id="control-tongue"><span>01</span>${t('lessonTongue')}</h3><div class="control-row">${slider('front', 'front', Math.round(settings.x * 100), 0, 100, 'backLabel', 'frontLabel')}</div><div class="control-row">${slider('height', 'height', Math.round(settings.y * 100), 0, 100, 'low', 'high')}</div></section><section class="simulation-control-group ${state.lesson === 'voicing' ? 'is-relevant' : ''}" data-control-group="voicing" data-number="02" aria-labelledby="control-voicing"><h3 id="control-voicing"><span>02</span>${t('lessonVoicing')}</h3><div class="control-row">${slider('pitch', 'pitch', state.sim.pitch, 95, 240, 'deep', 'highPitch')}</div><div class="voicing"><span class="slider-label">${t('voicing')}</span><div role="group" aria-label="${t('voicing')}"><button data-action="voiced" data-value="true" aria-pressed="${state.sim.voiced}">${t('voiced')}</button><button data-action="voiced" data-value="false" aria-pressed="${!state.sim.voiced}">${t('unvoiced')}</button></div></div></section><section class="simulation-control-group ${state.lesson === 'limits' ? 'is-relevant' : ''}" data-control-group="limits" data-number="03" aria-labelledby="control-limits"><h3 id="control-limits"><span>03</span>${t('lessonLimits')}</h3><label class="limit-control"><input id="limited" type="checkbox" ${state.sim.limited ? 'checked' : ''}><span>${t('limit')}</span></label></section></section></div>`;
}


function explore() {
  return `<div class="explore-top"><div class="page-heading"><h1 id="page-title" tabindex="-1">${t('exploreTitle').replace('\n', '<br>')}</h1></div><div class="explore-controls"><div class="mode-switch" role="tablist" aria-label="${t('modes')}">${['animation', 'simulation'].map((mode) => `<button id="tab-${mode}" role="tab" aria-selected="${state.mode === mode}" aria-controls="exploration-panel" tabindex="${state.mode === mode ? 0 : -1}" data-action="mode" data-value="${mode}">${t(mode)}</button>`).join('')}</div></div>${state.sounding && state.mode === 'animation' ? `<button class="button secondary continuing-sound" id="sound-button" data-action="sound" aria-pressed="true">${icon('stop')}${t('stopSound')}</button>` : ''}</div><section id="exploration-panel" role="tabpanel" aria-labelledby="tab-${state.mode}">${state.mode === 'animation' ? animationView() : simulationView()}</section>`;
}


function lessonGuide() {
  const lesson = state.lesson;
  const key = { tongue: 'exploreTongue', voicing: 'exploreVoicing', limits: 'exploreLimits' }[lesson];
  return `<div class="lesson-guide"><div class="lesson-options" role="group" aria-label="${t('lessonTitle')}">${['tongue', 'voicing', 'limits'].map((id, i) => `<button data-action="lesson" data-value="${id}" aria-pressed="${lesson === id}"><span class="lesson-number">0${i + 1}</span>${t({ tongue: 'lessonTongue', voicing: 'lessonVoicing', limits: 'lessonLimits' }[id])}</button>`).join('')}</div><div class="lesson-instruction"><p>${t(key)}</p><button class="text-button" data-action="anatomy-link" data-value="${lesson === 'voicing' ? 'folds' : 'tongue'}">${t('returnMechanism')}</button></div></div>`;
}

function focusSimulationLesson(lesson) {
  if (state.lesson === lesson) return;
  state.lesson = lesson;
  state.part = lesson === 'voicing' ? 'folds' : 'tongue';
  root.querySelector('.simulation-layout').dataset.lesson = lesson;
  root.querySelector('.sound-playground').dataset.region = state.part;
  root.querySelectorAll('.lesson-options [data-action=lesson]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.value === lesson)));
  root.querySelector('.lesson-instruction p').textContent = t({ tongue: 'exploreTongue', voicing: 'exploreVoicing', limits: 'exploreLimits' }[lesson]);
  root.querySelector('[data-action=anatomy-link]').dataset.value = state.part;
  root.querySelectorAll('[data-control-group]').forEach((group) => group.classList.toggle('is-relevant', group.dataset.controlGroup === lesson));
  disposeProductionMotion();
  disposeProductionMotion = mountProductionMotion({ root, state, t });
}

function augmentationExample() {
  return state.demo.augmentation.examples.find((item) => item.pairId === pair()?.id) ?? state.demo.augmentation.examples[0];
}

function resolveAudio(id) {
  if (id.startsWith('showcase:')) return state.demo.showcase.reconstruction?.[id.slice(9)];
  if (id.startsWith('rnv:')) {
    const controls = state.demo.showcase.controls;
    const sweep = controls?.sweeps.find((item) => item.id === state.rnvControl) ?? controls?.sweeps[0];
    return id === 'rnv:source' ? controls?.source : sweep?.values[Math.min(state.rnvFactor, sweep.values.length-1)];
  }

  if (id.startsWith('reconstruction:')) {
    const item = state.demo.reconstruction.examples[state.reconstructionExample];
    return id === 'reconstruction:source' ? state.pairs.find((p) => p.id === item?.pairId)?.atypical : item?.output;
  }
  if (id.startsWith('recognition:')) return state.pairs[0]?.[id.slice(12)];
  if (id === 'typical' || id === 'atypical') return pair()?.[id];
  const example = styleSynthesisExamples(state.demo)[state.synthesisExample];
  if (id === 'synthesis-input') return example?.input;
  if (id.startsWith('variant:')) return example?.variants.find((variant) => variant.id === id.slice(8));
  if (id === 'augmentation') {
    const item = augmentationExample();
    return state.pairs.find((candidate) => candidate.id === item?.pairId)?.[item?.clip];
  }
  return null;
}

function playControl(id, clip, label) {
  const active = state.audio === id;
  return `<div class="compact-audio ${active ? 'is-playing' : ''}"><button data-action="audio" data-value="${esc(id)}" ${clip?.src ? '' : 'disabled'} aria-label="${t(active ? 'stop' : 'play')} · ${esc(label)}">${icon(active ? 'stop' : 'play')}<span>${t(active ? 'stop' : 'play')}</span></button><div class="play-progress" role="progressbar" aria-label="${t('progress')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${active ? state.progress : 0}" style="--progress:${active ? state.progress : 0}%"><span></span></div></div>`;
}

const research = researchViews({ state, t, esc, icon, pair, playControl, clipLabel });

function render() {
  disposeProductionMotion();
  productionScene?.dispose(); productionScene = null;
  const focused = document.activeElement;
  const focusedId = focused?.id;
  const focusedTag = focused?.tagName?.toLowerCase();
  const action = focused?.dataset.action;
  const value = focused?.dataset.value;
  document.documentElement.lang = state.language;
  document.documentElement.dataset.palette = state.palette;
  document.querySelector('meta[name="theme-color"]').content = getComputedStyle(document.documentElement).getPropertyValue('--header-surface').trim();
  document.title = t('title');
  root.innerHTML = `${navigation()}<main id="content" data-step="${state.step}" data-mode="${state.mode}">${[listen, explore, research.recognition, research.synthesis, research.applicationsPage][state.step - 1]()}${state.error ? `<p class="error-note" role="alert">${esc(state.error)}</p>` : ''}${state.step === 2 ? `<details class="sources"><summary>${t('sources')}</summary><p>${t('sourcesText')}</p><ul><li><a href="https://commons.wikimedia.org/wiki/File:Respiratory_system_complete_no_labels.svg" target="_blank" rel="noreferrer">${t('anatomyAttribution')}</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a></li><li><a href="https://www.nidcd.nih.gov/health/taking-care-your-voice" target="_blank" rel="noreferrer">${t('sourceVoice')}</a></li><li><a href="https://helpingyoucommunicate.org/article/dysarthria" target="_blank" rel="noreferrer">${t('sourceDisorder')}</a></li><li><a href="https://www.phonetik.uni-muenchen.de/~hoole/kurse/movies/mri3d/mri3d.html" target="_blank" rel="noreferrer">${t('sourceArticulation')}</a></li><li><a href="https://ncvs.org/tutorials/how-the-vocal-tract-filters-sound/" target="_blank" rel="noreferrer">${t('sourceModel')}</a></li></ul></details>` : ''}</main>${footer()}`;
  prepareNotes();
  if (state.step === 2 && state.visual === '3d') mountProductionScene();
  if (state.step === 4) {
    for (const svg of root.querySelectorAll('.output-waveform[data-audio-id]')) {
      drawOutputWaveform(svg, resolveAudio(svg.dataset.audioId), t('waveformUnavailable'));
    }
  }
  if (state.augmentationRevealed && state.step === 5) {
    const comparison = document.getElementById('augmentation-dialog');
    const experiment = comparison?.closest('.notes-dialog');
    experiment?.showModal();
    comparison?.showModal();
    comparison?.addEventListener('close', () => { state.augmentationRevealed = false; render(); }, { once: true });
  }
  if (state.step === 2 && state.mode === 'simulation') { updateModel(); bindPad(); }
  if (state.step === 2) disposeProductionMotion = mountProductionMotion({ root, state, t });
  if (action) root.querySelector(`${CSS.escape(focusedTag)}[data-action="${CSS.escape(action)}"]${value ? `[data-value="${CSS.escape(value)}"]` : ''}`)?.focus({ preventScroll: true });
  else if (focusedId) document.getElementById(focusedId)?.focus({ preventScroll: true });
}

async function mountProductionScene() {
  const host = document.getElementById('anatomy-3d');
  if (!host) return;
  try {
    const { AnatomyScene } = await import('./anatomy-3d.mjs');
    if (!host.isConnected) return;
    productionScene = new AnatomyScene({
      host, settings: state.sim, part: state.mode === 'simulation' ? (state.lesson === 'voicing' ? 'folds' : 'tongue') : state.part,
      simulation: state.mode === 'simulation', sounding: state.sounding, motion: state.motion, view: state.sceneView, t,
      onTongue: (front, height) => { state.sim.front = front; state.sim.height = height; updateModel(); },
      onCamera: (view) => { state.sceneView = view; },
    });
  } catch {
    if (!host.isConnected) return;
    host.dataset.scene = 'unavailable';
    host.querySelector('.scene-status').textContent = t('sceneUnavailable');
    host.querySelector('.scene-fallback').hidden = false;
    const hint = host.closest('.sound-playground')?.querySelector('.drag-hint');
    if (hint) hint.textContent = t('dragTongue');
  }
}

function prepareNotes() {
  for (const [index, details] of [...root.querySelectorAll('details')].entries()) {
    const summary = details.querySelector('summary');
    const label = summary.textContent;
    summary.remove();
    const wrapper = document.createElement('div');
    wrapper.className = 'notes-control';
    wrapper.innerHTML = `<button class="text-button notes-trigger" data-action="notes" data-value="${index}" aria-haspopup="dialog">${esc(label)}</button><dialog id="notes-${index}" class="notes-dialog" aria-labelledby="notes-title-${index}"><div class="dialog-heading"><h2 id="notes-title-${index}">${esc(label)}</h2><form method="dialog"><button class="icon-button" aria-label="${t('close')}">×</button></form></div><div class="notes-body">${details.innerHTML}</div></dialog>`;
    details.replaceWith(wrapper);
  }
}

function stopAll({ keepSimulation = false } = {}) {
  audio.pause(); audio.currentTime = 0; state.audio = null; state.progress = 0;
  if (!keepSimulation) { voice.stop(false); state.sounding = false; }
}

function syncSoundButton() {
  const button = document.querySelector('#sound-button');
  if (!button) return;
  button.setAttribute('aria-pressed', String(state.sounding));
  button.innerHTML = `${icon(state.sounding ? 'stop' : 'sound')}<span>${t(state.sounding ? 'stopSound' : 'startSound')}</span>`;
  const status = document.querySelector('.sound-state');
  if (status) {
    status.textContent = t(state.sounding ? 'playing' : 'silent');
    status.classList.toggle('on', state.sounding);
  }
  document.querySelector('.sound-playground')?.classList.toggle('is-sounding', state.sounding);
  productionScene?.update({ sounding: state.sounding });
  disposeProductionMotion();
  disposeProductionMotion = mountProductionMotion({ root, state, t });
}

function updateModel() {
  const settings = vowelSettings(state.sim.front, state.sim.height, state.sim.limited);
  state.sim.front = settings.x; state.sim.height = settings.y;
  const anatomical = state.visual !== 'diagram';
  const tongue = tongueGeometry(state.sim, { interactive: true });
  const x = anatomical ? tongue.x : 98 + settings.x * 364, y = anatomical ? tongue.y : 228 - settings.y * 132;
  for (const id of ['tongue-handle', 'tongue-halo']) {
    const element = document.getElementById(id);
    element?.setAttribute('cx', x); element?.setAttribute('cy', y);
  }
  document.getElementById('model-tongue')?.setAttribute('d', anatomical ? tongue.path : `M96 235Q${x - 50} ${y - 28} ${x} ${y}T462 235Z`);
  for (const key of ['front', 'height']) {
    const input = document.getElementById(key);
    if (input) input.value = Math.round(state.sim[key] * 100);
  }
  voice.update(state.sim);
  productionScene?.update({ settings: state.sim });
}

function bindPad() {
  const pad = document.getElementById('tongue-pad');
  const update = (event) => {
    const point = pad.createSVGPoint(); point.x = event.clientX; point.y = event.clientY;
    const local = point.matrixTransform(pad.getScreenCTM().inverse());
    focusSimulationLesson(state.sim.limited ? 'limits' : 'tongue');
    Object.assign(state.sim, tongueSettingsAt(local.x, local.y, state.sim.limited));
    updateModel();
  };
  pad.addEventListener('pointerdown', (event) => { if (event.button !== 0 || !event.target.closest('#tongue-handle,#tongue-halo,.section-tongue,.controller-region,#limited-area')) return; pad.setPointerCapture(event.pointerId); pad.classList.add('is-dragging'); update(event); });
  pad.addEventListener('pointermove', (event) => { if (pad.hasPointerCapture(event.pointerId)) update(event); });
  pad.addEventListener('pointerup', (event) => { if (pad.hasPointerCapture(event.pointerId)) pad.releasePointerCapture(event.pointerId); });
  pad.addEventListener('lostpointercapture', () => pad.classList.remove('is-dragging'));
}

root.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-action]');
  if (!button || button.disabled) return;
  event.preventDefault();
  const { action, value } = button.dataset;
  const previousStep = state.step;
  state.error = '';
  if (action === 'scene-reset') { productionScene?.resetView(); return; }
  if (action === 'notes') { stopAll({ keepSimulation: true }); render(); document.getElementById(`notes-${value}`)?.showModal(); return; }
  if (action === 'language') { stopAll({ keepSimulation: true }); state.language = value; }
  else if (action === 'step') {
    stopAll({ keepSimulation: Number(value) === state.step }); state.step = Number(value);
  }
  else if (action === 'reset') { stopAll(); Object.assign(state, { step: 1, mode: 'animation', part: 'lungs', productionTime: 0, rhythmPattern: 'short', reveal: true, pair: 0, revealedCues: new Set(), played: new Set(), sim: defaultSim(), sceneView: {}, lesson: 'tongue', synthesisMode: 'rnv', rnvControl: 'vowels', rnvFactor: 2, reconstructionExample: 0, reconstructionRevealed: false, synthesisExample: 0, variant: 0, outputWords: false, application: 'augmentation', augmentationRevealed: false }); }
  else if (action === 'reveal') state.reveal = !state.reveal;
  else if (action === 'observe') {
    const revealed = !state.revealedCues.has(value);
    revealed ? state.revealedCues.add(value) : state.revealedCues.delete(value);
    button.classList.toggle('revealed', revealed);
    button.setAttribute('aria-expanded', String(revealed));
    button.setAttribute('aria-label', t(revealed ? 'hideCue' : 'revealCue') + ' ' + (listeningCues.indexOf(value) + 1));
    button.querySelector('.cue-front').setAttribute('aria-hidden', String(revealed));
    button.querySelector('.cue-answer').setAttribute('aria-hidden', String(!revealed));
    return;
  }
  else if (action === 'part') { state.part = value; state.productionTime = 0; }
  else if (action === 'rhythm-pattern') { state.rhythmPattern = value; state.productionTime = 0; }
  else if (action === 'rhythm-step') { state.motion = false; state.productionTime = nextRhythmPhase((state.productionTime % 8000) / 8000, state.rhythmPattern) * 8000; }
  else if (action === 'motion') state.motion = !state.motion;
  else if (action === 'mode') { stopAll({ keepSimulation: true }); state.mode = value; }
  else if (action === 'audio') {
    if (state.audio === value) stopAll();
    else {
      stopAll(); const src = resolveAudio(value)?.src; if (!src) return;
      state.audio = value; audio.src = assetURL(src); render();
      try { await audio.play(); state.played.add(value); }
      catch (error) { if (error.name !== 'AbortError' && state.audio === value) { state.error = t('audioError'); state.audio = null; } }
    }
  }
  else if (action === 'sound') {
    if (state.sounding) { voice.stop(false); state.sounding = false; }
    else {
      stopAll(); state.sounding = true;
      try { await voice.start(state.sim); } catch { voice.stop(false); state.sounding = false; state.error = t('simError'); }
    }
  }
  else if (action === 'voiced') { state.sim.voiced = value === 'true'; state.lesson = 'voicing'; state.part = 'folds'; }
  else if (action === 'preset') { state.lesson = state.sim.limited ? 'limits' : 'tongue'; state.part = 'tongue'; const [front, height] = { a: [0.5, 0], i: [1, 1], u: [0, 1] }[value]; Object.assign(state.sim, { front, height }); }
  else if (action === 'augmentation-reveal') { stopAll(); state.augmentationRevealed = !state.augmentationRevealed; }
  else if (action === 'output-words') state.outputWords = !state.outputWords;
  else if (action === 'synthesis-mode') { stopAll(); state.synthesisMode = value; }
  else if (action === 'rnv-control') { stopAll(); state.rnvControl = value; }
  else if (action === 'reconstruction-reveal') state.reconstructionRevealed = !state.reconstructionRevealed;
  else if (action === 'variant') { stopAll(); state.variant = Number(value); }
  else if (action === 'synthesis-work') { stopAll(); state.step = 4; state.synthesisMode = 'rnv'; }
  else if (action === 'application') { stopAll(); state.application = value; }
  else if (action === 'lesson') { if (state.step !== 2) stopAll(); state.step = 2; state.mode = 'simulation'; state.lesson = value; state.part = value === 'voicing' ? 'folds' : 'tongue'; }
  else if (action === 'anatomy-link') { stopAll({ keepSimulation: true }); state.mode = 'animation'; state.part = value; }
  else if (action === 'sim-reset') { state.sim = defaultSim(); }
  render();
  if (action === 'step' || action === 'reset' || (action === 'lesson' && previousStep !== 2)) {
    document.getElementById('page-title').focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
});

root.addEventListener('input', (event) => {
  if (event.target.id === 'rnv-factor') {
    const controls = state.demo.showcase.controls;
    const sweep = controls.sweeps.find((item) => item.id === state.rnvControl) ?? controls.sweeps[0];
    const factor = sweep.values[Number(event.target.value)].factor.toLocaleString(state.language)+'×';
    document.getElementById('rnv-factor-value').textContent = factor;
    event.target.setAttribute('aria-valuetext', factor);
    return;
  }
  const control = event.target.dataset.control;
  if (!control) return;
  focusSimulationLesson(control === 'pitch' ? 'voicing' : state.sim.limited ? 'limits' : 'tongue');
  state.sim[control] = Number(event.target.value) / (control === 'pitch' ? 1 : 100);
  updateModel();
});
root.addEventListener('change', (event) => {
  if (event.target.id === 'rnv-factor') { stopAll(); state.rnvFactor = Number(event.target.value); render(); }
  if (event.target.id === 'visual-select') { stopAll({ keepSimulation: true }); state.visual = event.target.value; render(); }
  if (event.target.id === 'reconstruction-select') { stopAll(); state.reconstructionExample = Number(event.target.value); state.reconstructionRevealed = false; render(); }
  if (event.target.id === 'synthesis-select') { stopAll(); state.synthesisExample = Number(event.target.value); state.variant = 0; state.outputWords = false; render(); }
  if (event.target.id === 'limited') { state.sim.limited = event.target.checked; state.lesson = 'limits'; state.part = 'tongue'; updateModel(); render(); }
  if (event.target.id === 'pair-select') { stopAll(); state.pair = Number(event.target.value); state.reveal = true; state.played.clear(); state.revealedCues.clear(); state.augmentationRevealed = false; render(); }
});
root.addEventListener('keydown', (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('g[data-action]')) { event.preventDefault(); event.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
  if (event.target.matches('[role="tab"]') && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
    event.preventDefault(); const mode = event.key === 'Home' ? 'animation' : event.key === 'End' ? 'simulation' : state.mode === 'animation' ? 'simulation' : 'animation';
    stopAll({ keepSimulation: true }); state.mode = mode; render(); document.getElementById(`tab-${mode}`).focus();
  }
  if (event.key === 'Escape' && !root.querySelector('dialog[open]')) { stopAll(); state.augmentationRevealed = false; render(); }
});
audio.addEventListener('ended', () => { state.audio = null; state.progress = 0; render(); });
audio.addEventListener('error', () => { if (state.audio) { state.audio = null; state.error = t('audioError'); render(); } });
audio.addEventListener('timeupdate', () => {
  if (!state.audio || !Number.isFinite(audio.duration)) return;
  state.progress = Math.round(audio.currentTime / audio.duration * 100);
  const progress = root.querySelector('.is-playing .play-progress');
  progress?.style.setProperty('--progress', `${state.progress}%`); progress?.setAttribute('aria-valuenow', String(state.progress));
});
document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAll({ keepSimulation: true }); render(); } else { productionScene?.update(); if (state.step === 2) { disposeProductionMotion(); disposeProductionMotion = mountProductionMotion({ root, state, t }); } } });
window.addEventListener('pagehide', () => { disposeProductionMotion(); stopAll(); productionScene?.dispose(); });

render();
try {
  const response = await fetch(assetURL('/data/recordings.json'), { cache: 'no-store' });
  if (!response.ok) throw new Error('Recording configuration is unavailable.');
  state.demo = parseDemo(await response.json());
  state.pairs = state.demo.pairs;
} catch { state.failed = true; }
state.loading = false;
render();
