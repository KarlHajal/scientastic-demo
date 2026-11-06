const KINDS = new Set(['human', 'synthesized', 'converted']);

/** Choose a display label without presenting a synthetic reference as a human control. */
export function clipLabelKey(type, clip) {
  if (type === 'typical' && clip?.kind === 'synthesized') return 'syntheticReference';
  if (type === 'typical' && clip?.kind === 'converted') return 'convertedReference';
  return clip?.kind && clip.kind !== 'human' ? clip.kind : type;
}

/** Validate an audio reference and retain its optional input-integrity hash. */
export function parseClip(clip) {
  if (!clip || !KINDS.has(clip.kind)) throw new Error('Invalid audio provenance.');
  if (clip.src !== null && (typeof clip.src !== 'string' ||
      !/^\/media\/recordings\/[A-Za-z0-9_/-]+\.(wav|mp3|ogg|flac)$/.test(clip.src) ||
      clip.src.split('/').some((part) => part === '..'))) {
    throw new Error('Recording URLs must be local files under /media/recordings/.');
  }
  if (clip.sha256 != null && !/^[a-f0-9]{64}$/i.test(clip.sha256)) throw new Error('Invalid audio hash.');
  return { src: clip.src, kind: clip.kind, sha256: clip.sha256?.toLowerCase() ?? null };
}

/** Validate local recording references without importing private corpus metadata. */
export function parseRecordings(data) {
  if (data?.version !== 1 || !Array.isArray(data.pairs)) throw new Error('Invalid recording manifest.');
  const ids = new Set();
  return data.pairs.map((pair) => {
    if (typeof pair.id !== 'string' || !pair.id || ids.has(pair.id)) throw new Error('Pair IDs must be unique strings.');
    ids.add(pair.id);
    if (typeof pair.sentence !== 'string' || !/^[a-z]{2}(-[A-Za-z0-9]+)*$/.test(pair.language)) {
      throw new Error('Each pair needs a sentence and a language.');
    }
    const clips = {};
    for (const type of ['typical', 'atypical']) {
      const clip = parseClip(pair[type]);
      if (clip.src && !pair.sentence.trim()) throw new Error('A recording needs its actual transcript.');
      clips[type] = clip;
    }
    return {
      id: String(pair.id), language: pair.language, sentence: pair.sentence,
      translations: Object.fromEntries(['fr', 'en'].map((lang) => [lang, String(pair.translations?.[lang] ?? '')])),
      ...clips,
      observations: Array.isArray(pair.observations) ? pair.observations.filter((item) =>
        ['voice', 'articulation', 'prosody', 'rhythm'].includes(item)) : [],
    };
  });
}

/** Return illustrative resonance settings, not measured or diagnostic parameters. */
export function vowelSettings(front, height, limited = false) {
  const clamp = (value, low, high) => Math.max(low, Math.min(high, Number(value) || 0));
  const x = clamp(front, limited ? 0.3 : 0, limited ? 0.7 : 1);
  const y = clamp(height, limited ? 0.3 : 0, limited ? 0.7 : 1);
  return { x, y, formants: [760 - 470 * y, 1250 * (1 - y) + (870 + 1380 * x) * y, 2500 + 400 * x * y] };
}
