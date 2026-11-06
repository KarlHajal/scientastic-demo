import { styleSynthesisExamples } from './assets.mjs';
import { alignWords } from './transcripts.mjs';
import { assetURL } from './urls.mjs';

/** Render the research pages using only loaded recordings and saved outputs. */
export function researchViews({ state, t, esc, icon, pair, playControl, clipLabel }) {
  const local = (value) => esc(value?.[state.language] ?? '');
  const heading = (title, lead) => `<div class="page-heading"><h1 id="page-title" tabindex="-1">${t(title).replace('\n', '<br>')}</h1></div>`;
  const sentence = (text, language, translations = {}) => `<div class="research-sentence"><p lang="${esc(language || 'en')}">${text ? `“${esc(text)}”` : t('sentenceWaiting')}</p>${text && text !== 'Hey Google, sing me a song.' && !language.startsWith(state.language) && translations[state.language] ? `<p class="translation">${esc(translations[state.language])}</p>` : ''}</div>`;
  const legend = () => `<div class="difference-legend">${['substitution', 'deletion', 'insertion'].map((kind) => `<span><i class="${kind}"></i>${t(kind)}</span>`).join('')}</div>`;

  function markedWords(reference, hypothesis, language) {
    const aligned = alignWords(reference, hypothesis);
    return `<div class="marked-transcript" lang="${esc(language)}">${hypothesis === '' ? `<p class="no-words">${t('noWords')}</p>` : ''}${aligned.map((word) => {
      if (word.type === 'correct') return `<span class="word correct">${esc(word.hypothesis)}</span>`;
      if (word.type === 'substitution') return `<span class="word substitution" aria-label="${esc(word.reference)} → ${esc(word.hypothesis)}"><span class="word-reference">${esc(word.reference)}</span>${esc(word.hypothesis)}</span>`;
      if (word.type === 'deletion') return `<span class="word deletion" aria-label="${t('missingWord')} : ${esc(word.reference)}">${esc(word.reference)}</span>`;
      return `<span class="word insertion" aria-label="${t('insertion')} : ${esc(word.hypothesis)}">${esc(word.hypothesis)}</span>`;
    }).join(' ')}</div>`;
  }

  function resultBox({ title, output, reference, language, revealed, control = '', modelLabel = '' }) {
    return `<article class="result-card"><div class="result-top"><h2>${title}</h2>${output === null ? `<span class="result-status">${t('resultsWaiting')}</span>` : ''}</div>${control}${modelLabel ? `<p class="model-label">${t('modelLabel')} : ${esc(modelLabel)}</p>` : ''}<div class="result-output">${output !== null && revealed ? markedWords(reference, output.hypothesis, language) : `<div class="result-concealed" aria-label="${t(output === null ? 'resultsWaiting' : 'revealResults')}"><span></span><span></span><span></span></div>`}</div></article>`;
  }

  function recognition() {
    const current = state.pairs[0];
    const systems = [state.demo.recognition, ...state.demo.recognition.alternatives];
    const system = systems.find((item) => ['whisper-small', 'whisper-small-mlx'].includes(item.model?.id));
    const saved = system?.examples.find((item) => item.pairId === current?.id);
    const hasResults = Boolean(saved && (saved.typical !== null || saved.atypical !== null));
    return `${heading('recognizeTitle', 'recognizeLead')}
      <p class="model-label">Whisper small</p>
      <section class="recognition-board">${sentence(current?.sentence, current?.language, current?.translations)}<div class="result-grid">${['typical', 'atypical'].map((type) => resultBox({
        title: clipLabel(type, current?.[type]), output: saved?.[type] ?? null, reference: current?.sentence ?? '', language: current?.language ?? 'en', revealed: true,
        control: playControl(`recognition:${type}`, current?.[type], clipLabel(type, current?.[type])),
      })).join('')}</div>${hasResults ? legend() : ''}</section>
      <details class="method-notes"><summary>${t('notes')}</summary><p>${t('exampleOnly')} ${t('normalization')}</p></details>
      `;
  }

  function networkSymbol() {
    const layers = [[18, [24, 60, 96]], [80, [12, 44, 76, 108]], [142, [24, 60, 96]]];
    const edges = layers.slice(0, -1).flatMap(([x, ys], i) => ys.flatMap((y) => layers[i + 1][1].map((nextY) => '<line x1="' + x + '" y1="' + y + '" x2="' + layers[i + 1][0] + '" y2="' + nextY + '"/>'))).join('');
    const nodes = layers.flatMap(([x, ys]) => ys.map((y) => '<circle cx="' + x + '" cy="' + y + '" r="7"/>')).join('');
    return '<svg class="network-symbol" viewBox="0 0 160 120" role="img" aria-label="' + t('networkSymbol') + '">' + edges + nodes + '</svg>';
  }

  function audioWaveform(id) {
    return `<svg class="output-waveform" data-audio-id="${esc(id)}" viewBox="0 0 264 80" role="img" aria-label="${t('waveformLabel')}" data-status="loading"><path d=""/></svg>`;
  }

  function diagramArrow() {
    return `<span class="stage-arrow" aria-hidden="true">${icon('arrow')}</span>`;
  }

  function rhythmSymbol() {
    return `<svg class="rhythm-symbol" viewBox="0 0 80 56" aria-hidden="true"><path class="rhythm-symbol-axis" d="M6 16H74M6 40H74"/><path d="M14 10V22M26 10V22M38 10V22M50 10V22M62 10V22M14 34V46M34 34V46M54 34V46M72 34V46"/></svg>`;
  }

  function conversionBlock(kind) {
    return `<div class="process-block conversion-process process-${kind}"><h3>${t(kind === 'rhythm' ? 'rhythmConversion' : 'voiceConversion')}</h3></div>`;
  }

  function reconstructionPlayer() {
    const example = state.demo.showcase.reconstruction;
    return `<section class="showcase-row reconstruction-row" aria-labelledby="reconstruction-title"><header class="showcase-row-header"><h2 id="reconstruction-title">${t('reconstructionHeading')}</h2><span class="showcase-method">RnV</span><p class="showcase-phrase" lang="${example?.language ?? 'en'}">${example ? esc(example.sentence) : '—'}</p></header>
      <div class="reconstruction-stages">${['original','rhythm','voice'].map((stage, i) => `${i ? diagramArrow()+conversionBlock(stage)+diagramArrow() : ''}<article class="conversion-stage stage-${stage}"><h3>${t('rnvStage'+stage)}</h3>${audioWaveform('showcase:'+stage)}${playControl('showcase:'+stage, example?.[stage], t('rnvStage'+stage))}</article>`).join('')}</div></section>`;
  }

  function controlledSynthesis() {
    const controls = state.demo.showcase.controls;
    const sweep = controls?.sweeps.find((item) => item.id === state.rnvControl) ?? controls?.sweeps[0];
    const factorIndex = sweep ? Math.min(state.rnvFactor, sweep.values.length-1) : 0;
    const selected = sweep?.values[factorIndex];
    return `<div class="controlled-synthesis synthesis-demonstration"><article class="synthesis-input-block"><h3>${t('typical')}</h3><p class="task-syllables">${controls ? esc(controls.task) : '—'}</p>${playControl('rnv:source', controls?.source, t('typical'))}</article>
      ${diagramArrow()}<div class="process-block synthesis-process"><div class="process-heading"><h3>${t('rhythmConversion')}</h3></div>${sweep ? `<div class="rhythm-control-tabs" role="group" aria-label="${t('rnvParameter')}">${controls.sweeps.map((item) => `<button data-action="rnv-control" data-value="${item.id}" aria-pressed="${sweep.id === item.id}">${t('rnv'+item.id)}</button>`).join('')}</div><div class="rnv-range"><label for="rnv-factor">${t('rnvDuration'+sweep.id)}</label><output for="rnv-factor" id="rnv-factor-value">${selected.factor.toLocaleString(state.language)}×</output><input id="rnv-factor" type="range" min="0" max="${sweep.values.length-1}" step="1" value="${factorIndex}" aria-valuetext="${selected.factor.toLocaleString(state.language)}×"><div class="rnv-range-ticks" aria-hidden="true">${sweep.values.map((item) => `<span>${item.factor.toLocaleString(state.language)}×</span>`).join('')}</div></div>` : `<p class="missing-notice">${t('synthesisWaiting')}</p>`}</div>${diagramArrow()}
      <article class="controlled-output"><h3>${t('rnvControlledAudio')}</h3>${audioWaveform('rnv:output')}${playControl('rnv:output', selected, t('rnvControlledAudio'))}</article></div>`;
  }

  function synthesisPlayer() {
    const examples = styleSynthesisExamples(state.demo);
    const example = examples[state.synthesisExample];
    const variant = example?.variants[0];
    return `<div class="style-synthesis synthesis-demonstration"><article class="synthesis-input-block"><h3>${t('inputText')}</h3><div class="style-text-content">${examples.length > 1 ? `<select id="synthesis-select" aria-label="${t('example')}">${examples.map((item,i) => `<option value="${i}" ${i === state.synthesisExample ? 'selected' : ''}>${t(item.id === 'synthesis-choice-03' ? 'styleCommand' : 'styleRecipe')}</option>`).join('')}</select>` : ''}<p lang="${esc(example?.language ?? 'en')}">${example ? esc(example.sentence) : t('sentenceWaiting')}</p></div></article>
      ${diagramArrow()}<div class="process-block synthesis-process style-process">${networkSymbol()}<h3>StyleTTS 2</h3></div>${diagramArrow()}
      <article class="style-output"><h3>${t('synthesizedSpeech')}</h3>${audioWaveform(variant ? 'variant:'+variant.id : '')}${playControl(variant ? 'variant:'+variant.id : 'variant:missing', variant, t('generated'))}</article></div>`;
  }

  function augmentation() {
    const examples = state.demo.augmentation.examples;
    const saved = examples.find((item) => item.pairId === pair()?.id) ?? examples[0];
    const input = saved ? state.pairs.find((item) => item.id === saved.pairId) : null;
    return `<p>${t('augmentationText')}</p><div class="training-diagram"><div><span>${t('trainingOriginal')}</span><b aria-hidden="true">→</b><span>${t('training')}</span><b aria-hidden="true">→</b><strong>${t('baselineSystem')}</strong></div><div><span>${t('trainingOriginal')}<small>${t('trainingExtra')}</small></span><b aria-hidden="true">→</b><span>${t('training')}</span><b aria-hidden="true">→</b><strong>${t('augmentedSystem')}</strong></div></div>${saved ? `<div class="augmentation-input">${sentence(input.sentence, input.language, input.translations)}${playControl('augmentation', input[saved.clip], t('inputRecording'))}<p>${t('sameInput')}</p></div><button class="button secondary" data-action="augmentation-reveal" aria-expanded="${state.augmentationRevealed}">${t(state.augmentationRevealed ? 'hideComparison' : 'showComparison')}</button>${state.augmentationRevealed ? `<dialog id="augmentation-dialog" class="comparison-dialog" aria-label="${t('showComparison')}"><form method="dialog"><button class="icon-button" aria-label="${t('close')}">×</button></form><div class="result-grid augmentation-results">${['baseline', 'augmented'].map((condition) => resultBox({ title: t(condition), output: saved[condition], reference: input.sentence, language: input.language, revealed: true, modelLabel: saved[condition].model.label })).join('')}</div>${legend()}<details class="experiment-details"><summary>${t('trainingDetails')}</summary><p>${local(saved.trainingSummary)}</p><h4>${t('evaluationDetails')}</h4><p>${local(saved.evaluationNote)}</p></details><p class="training-caption">${t('exampleOnly')} ${t('normalization')}</p></dialog>` : ''}` : `<p class="pending-result">${t('augmentationWaiting')}</p>`}`;
  }


  function synthesis() {
    return `${heading('synthesisTitle')}<div class="speech-showcase">${reconstructionPlayer()}<section class="showcase-row synthesis-row" aria-labelledby="synthesis-title"><header class="showcase-row-header"><h2 id="synthesis-title">${t('synthesisHeading')}</h2><div class="synthesis-methods" role="group" aria-label="${t('synthesisModes')}">${['rnv','styletts2'].map((method) => `<button data-action="synthesis-mode" data-value="${method}" aria-pressed="${state.synthesisMode === method}">${method === 'rnv' ? 'RnV' : 'StyleTTS 2'}</button>`).join('')}</div></header>${state.synthesisMode === 'styletts2' ? synthesisPlayer() : controlledSynthesis()}</section></div><details class="method-notes showcase-notes"><summary>${t('methodNotes')}</summary><p>${t('showcaseNotes')}</p></details>`;
  }

  function applicationsPage() {
    const projectURL = 'https://www.idiap.ch/en/projects/pass';
    const paperURL = 'https://www.isca-archive.org/interspeech_2025/elhajal25_interspeech.html';
    const challengeURL = 'https://speechaccessibilityproject.beckman.illinois.edu/conduct-research-through-the-project/speech-accessibility-project-challenge-competition';
    return `${heading('applications', 'usesLead')}<div class="application-overview">
      <section class="application-cards" aria-label="${t('applications')}">${['Data','Understanding','Care'].map((kind) => `<article class="application-card app-${kind.toLowerCase()}"><h2>${t('app'+kind+'Title')}</h2><p>${t('app'+kind+'Text')}</p></article>`).join('')}</section>
      <div class="application-contexts"><section class="context-panel clinical-context" aria-labelledby="clinical-title"><h2 id="clinical-title">${t('clinicalExamples')}</h2><ul>${['clinicalSpeechTherapy','clinicalParkinson','clinicalCancer','clinicalCP','clinicalALS','clinicalStroke','clinicalDown'].map((key) => `<li>${t(key)}</li>`).join('')}</ul></section>
      <section class="context-panel data-context" aria-labelledby="data-title"><h2 id="data-title">${t('dataExample')}</h2><div><a class="data-source" href="https://speechaccessibilityproject.beckman.illinois.edu/conduct-research-through-the-project/faq-on-using-our-data" target="_blank" rel="noreferrer">Speech Accessibility Project</a><p>${t('dataDescription')} <a href="${challengeURL}" target="_blank" rel="noreferrer">${t('dataChallengeLink')}</a></p></div><ul class="clinical-collaborations"><li><h3>${t('clinicalParkinson')}</h3><span class="clinical-partner">${t('clinicalParkinsonPartner')}<br>${t('clinicalParkinsonLocation')}</span></li><li><h3>${t('collaborationCancer')}</h3><span class="clinical-partner">${t('clinicalCancerPartner')}</span></li></ul></section></div>
      <section class="application-resources" aria-label="${t('further')}"><a class="application-resource" href="${projectURL}" target="_blank" rel="noreferrer"><img src="${assetURL('/media/pass-project-qr.svg')}" alt="QR · PaSS" width="64" height="64"><span>${t('overviewLink')}</span></a><a class="application-resource" href="${paperURL}" target="_blank" rel="noreferrer"><img src="${assetURL('/media/rnv-paper-qr.svg')}" alt="QR · Interspeech 2025" width="64" height="64"><span>${t('paperLink')}</span></a></section>
    </div>`;
  }

  return { recognition, synthesis, applicationsPage };
}
