import { parseClip, parseRecordings } from './model.mjs';
import { alignWords } from './transcripts.mjs';

function text(value, name, allowEmpty = false) {
  if (typeof value !== 'string' || (!allowEmpty && !value.trim()) || value.length > 4000) throw new Error(`Invalid ${name}.`);
  return value;
}

function bilingual(value, name) {
  return { fr: text(value?.fr, `${name}.fr`), en: text(value?.en, `${name}.en`) };
}

function language(value) {
  if (typeof value !== 'string' || !/^[a-z]{2}(-[A-Za-z0-9]+)*$/.test(value)) throw new Error('Invalid spoken language.');
  return value;
}

function model(value) {
  return { label: text(value?.label, 'model label'), id: text(value?.id, 'model ID'), revision: text(value?.revision, 'model revision') };
}

function hypothesis(value, source) {
  if (value == null) return null;
  const result = { hypothesis: text(value.hypothesis, 'recognition hypothesis', true), inputSha256: value.inputSha256 ?? null };
  if (result.inputSha256 != null && !/^[a-f0-9]{64}$/i.test(result.inputSha256)) throw new Error('Invalid recognizer input hash.');
  result.inputSha256 = result.inputSha256?.toLowerCase() ?? null;
  if (source.sha256 && result.inputSha256 !== source.sha256) throw new Error('Recognition output does not match the source audio hash.');
  if (!source.src) throw new Error('Recognition output has no corresponding input audio.');
  return result;
}

function reference(pairs, id, clip) {
  const pair = pairs.find((item) => item.id === id);
  if (!pair || (clip && !['typical', 'atypical'].includes(clip))) throw new Error('Unknown pair or clip reference.');
  return pair;
}

function unique(items, label) {
  if (new Set(items).size !== items.length) throw new Error(`Duplicate ${label}.`);
}

function recognitionSystem(value, pairs) {
  if (!value?.examples?.length) return { model: null, examples: [] };
  const examples = value.examples.map((item) => {
    const pair = reference(pairs, item.pairId);
    const result = { pairId: pair.id, typical: hypothesis(item.typical, pair.typical), atypical: hypothesis(item.atypical, pair.atypical) };
    for (const clip of ['typical', 'atypical']) if (result[clip]) alignWords(pair.sentence, result[clip].hypothesis);
    return result;
  });
  unique(examples.map((item) => item.pairId), 'recognition pair');
  return { model: model(value.model), examples };
}

/** Parse the demo data package while keeping older listening-only packages valid. */
export function parseDemo(data) {
  const pairs = parseRecordings(data);
  const recognition = recognitionSystem(data.recognition, pairs);
  recognition.alternatives = (data.recognition?.alternatives ?? []).map((item) => recognitionSystem(item, pairs));
  if (recognition.alternatives.some((item) => !item.model)) throw new Error('Alternative recognizers need a model and saved outputs.');
  unique([recognition, ...recognition.alternatives].filter((item) => item.model).map((item) => `${item.model.id}:${item.model.revision}`), 'recognition system');
  const synthesis = { examples: (data.synthesis?.examples ?? []).map((item) => {
    const id = text(item.id, 'synthesis ID');
    if (!['tts', 'conversion'].includes(item.method)) throw new Error('Unknown synthesis method.');
    if (item.method === 'tts' && item.input != null) throw new Error('Text-to-speech input must be text, without an input recording.');
    const sentence = text(item.sentence, 'synthesis sentence');
    if (!Array.isArray(item.variants) || !item.variants.length) throw new Error('Synthesis needs at least one output.');
    const variants = item.variants.map((variant) => {
      const clip = parseClip({ ...variant, kind: item.method === 'tts' ? 'synthesized' : 'converted' });
      return {
        id: text(variant.id, 'variant ID'), label: bilingual(variant.label, 'variant label'),
        description: bilingual(variant.description, 'variant description'), ...clip,
        transcript: variant.transcript == null ? null : text(variant.transcript, 'output transcript', true),
      };
    });
    unique(variants.map((variant) => variant.id), 'synthesis variant');
    return {
      id, method: item.method, language: language(item.language), sentence,
      translations: { fr: String(item.translations?.fr ?? ''), en: String(item.translations?.en ?? '') },
      model: model(item.model), input: item.input == null ? null : parseClip(item.input), variants,
    };
  }) };
  unique(synthesis.examples.map((item) => item.id), 'synthesis example');
  const reconstruction = { examples: (data.reconstruction?.examples ?? []).map((item) => {
    const pair = reference(pairs, item.pairId);
    if (!pair.atypical.src || pair.atypical.kind !== 'human' || !pair.atypical.sha256) {
      throw new Error('Reconstruction needs a hashed human source recording.');
    }
    const output = parseClip({ ...item.output, kind: 'converted' });
    if (!output.src || !output.sha256) throw new Error('Reconstruction needs a hashed output recording.');
    const converter = model(item.model);
    if (!/^rnv(?:-|$)/i.test(converter.id)) throw new Error('The RnV view requires an RnV model identifier.');
    const source = hypothesis(item.recognition?.source, pair.atypical);
    const reconstructed = hypothesis(item.recognition?.reconstructed, output);
    return {
      id: text(item.id, 'reconstruction ID'), pairId: pair.id,
      model: converter, output,
      transcript: item.transcript == null ? null : text(item.transcript, 'reconstructed transcript', true),
      description: bilingual(item.description, 'reconstruction description'),
      recognition: { model: model(item.recognition?.model), source, reconstructed },
    };
  }) };
  unique(reconstruction.examples.map((item) => item.id), 'reconstruction example');
  const augmentation = { examples: (data.augmentation?.examples ?? []).map((item) => {
    if (!['typical', 'atypical'].includes(item.clip)) throw new Error('Augmentation needs an explicit source clip.');
    const pair = reference(pairs, item.pairId, item.clip);
    if (pair[item.clip].kind !== 'human') throw new Error('Augmentation evaluation needs a real human recording.');
    const baseline = hypothesis(item.baseline, pair[item.clip]);
    const augmented = hypothesis(item.augmented, pair[item.clip]);
    if (!baseline || !augmented || !baseline.inputSha256 || baseline.inputSha256 !== augmented.inputSha256) {
      throw new Error('Augmentation comparisons need two outputs on the same hashed input.');
    }
    alignWords(pair.sentence, baseline.hypothesis); alignWords(pair.sentence, augmented.hypothesis);
    return {
      pairId: pair.id, clip: item.clip,
      baseline: { ...baseline, model: model(item.baseline.model) },
      augmented: { ...augmented, model: model(item.augmented.model) },
      trainingSummary: bilingual(item.trainingSummary, 'training summary'),
      evaluationNote: bilingual(item.evaluationNote, 'evaluation note'),
    };
  }) };
  unique(augmentation.examples.map((item) => `${item.pairId}:${item.clip}`), 'augmentation comparison');
  return { version: 1, pairs, recognition, synthesis, reconstruction, augmentation, showcase: parseRnVShowcase(data.showcase) };
}

/** Validate the staged conversion and prepared rhythm sweeps without inferring transcripts. */
export function parseRnVShowcase(value = {}) {
  value ??= {};
  const clip = (value, kind) => {
    if (value?.kind !== kind) throw new Error('RnV sample provenance does not match its stage.');
    const parsed = parseClip(value);
    if (!parsed.src || !parsed.sha256) throw new Error('RnV samples need local audio and a hash.');
    return parsed;
  };
  const reconstruction = value.reconstruction == null ? null : {
    sentence: text(value.reconstruction.sentence, 'RnV source words'),
    language: language(value.reconstruction.language),
    original: clip(value.reconstruction.original, 'human'),
    rhythm: clip(value.reconstruction.rhythm, 'converted'),
    voice: clip(value.reconstruction.voice, 'converted'),
  };
  let controls = null;
  if (value.controls != null) {
    const sweeps = value.controls.sweeps.map((sweep) => {
      if (!['vowels', 'consonants', 'pauses'].includes(sweep.id)) throw new Error('Unknown RnV rhythm control.');
      const values = sweep.values.map((item) => {
        if (!Number.isFinite(item.factor) || item.factor <= 0) throw new Error('Invalid RnV duration factor.');
        return { factor: item.factor, ...clip(item, 'converted') };
      });
      if (values.length < 2) throw new Error('A rhythm sweep needs multiple saved outputs.');
      unique(values.map((item) => item.factor), 'RnV factor');
      return { id: sweep.id, values: values.sort((a, b) => a.factor-b.factor) };
    });
    if (!sweeps.length) throw new Error('RnV controls need a prepared sweep.');
    unique(sweeps.map((item) => item.id), 'RnV control');
    controls = { task: text(value.controls.task, 'RnV task'), source: clip(value.controls.source, 'human'), sweeps };
  }
  return { reconstruction, controls };
}

/** List audio files referenced by a normalized package for local validation. */
export function audioReferences(demo) {
  return [
    ...demo.pairs.flatMap((pair) => [pair.typical, pair.atypical]),
    ...demo.synthesis.examples.flatMap((item) => [item.input, ...item.variants]),
    ...demo.reconstruction.examples.map((item) => item.output),
    ...Object.values(demo.showcase?.reconstruction ?? {}).filter((value) => value?.src),
    demo.showcase?.controls?.source,
    ...(demo.showcase?.controls?.sweeps ?? []).flatMap((sweep) => sweep.values),
  ].filter((clip) => clip?.src);
}

/** Return the StyleTTS 2 examples selected for the current exhibit. */
export function styleSynthesisExamples(demo) {
  return demo.synthesis.examples.filter((item) => item.method === 'tts' && /^styletts2(?:-|$)/.test(item.model.id))
    .filter((item) => ['synthesis-choice-03', 'synthesis-choice-06'].includes(item.id))
    .map((item) => ({ ...item, variants: item.variants.filter((variant) => variant.id.endsWith('-st2v1_ref_rm')) }))
    .filter((item) => item.variants.length);
}
