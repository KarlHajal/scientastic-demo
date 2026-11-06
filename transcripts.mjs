function words(text) {
  return (text.match(/\S+/gu) ?? []).map((raw) => ({
    raw,
    normalized: raw.normalize('NFKC').toLowerCase().replaceAll('’', "'")
      .replace(/[^\p{L}\p{N}']/gu, '').replace(/^'+|'+$/g, ''),
  })).filter((token) => token.normalized);
}

/** Align original-language words; punctuation and case do not create differences. */
export function alignWords(reference, hypothesis) {
  const expected = words(reference), observed = words(hypothesis);
  if (expected.length > 300 || observed.length > 300) throw new Error('Demo transcripts must be short.');
  const table = Array.from({ length: expected.length + 1 }, () => new Uint16Array(observed.length + 1));
  for (let i = 0; i <= expected.length; i++) table[i][0] = i;
  for (let j = 0; j <= observed.length; j++) table[0][j] = j;
  for (let i = 1; i <= expected.length; i++) {
    for (let j = 1; j <= observed.length; j++) {
      const equal = expected[i - 1].normalized === observed[j - 1].normalized;
      table[i][j] = Math.min(table[i - 1][j - 1] + (equal ? 0 : 1), table[i - 1][j] + 1, table[i][j - 1] + 1);
    }
  }
  const result = [];
  let i = expected.length, j = observed.length;
  while (i || j) {
    const equal = i && j && expected[i - 1].normalized === observed[j - 1].normalized;
    if (equal && table[i][j] === table[i - 1][j - 1]) {
      result.push({ type: 'correct', reference: expected[--i].raw, hypothesis: observed[--j].raw });
    } else if (i && table[i][j] === table[i - 1][j] + 1) {
      // Prefer an omission over shifted substitutions when edit paths tie.
      result.push({ type: 'deletion', reference: expected[--i].raw, hypothesis: null });
    } else if (i && j && table[i][j] === table[i - 1][j - 1] + 1) {
      result.push({ type: 'substitution', reference: expected[--i].raw, hypothesis: observed[--j].raw });
    } else {
      result.push({ type: 'insertion', reference: null, hypothesis: observed[--j].raw });
    }
  }
  return result.reverse();
}
