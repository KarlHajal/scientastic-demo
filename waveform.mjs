import { assetURL } from './urls.mjs';

const envelopes = new Map();

async function envelope(clip) {
  const response = await fetch(assetURL(clip.src));
  if (!response.ok) throw new Error('Audio unavailable.');
  const context = new OfflineAudioContext(1, 1, 16000);
  const buffer = await context.decodeAudioData(await response.arrayBuffer());
  const peaks = Array(80).fill(0);
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const samples = buffer.getChannelData(channel);
    for (let i = 0; i < samples.length; i++) {
      const bin = Math.min(79, Math.floor(i * 80 / samples.length));
      peaks[bin] = Math.max(peaks[bin], Math.abs(samples[i]));
    }
  }
  return peaks;
}

/** Draw decoded audio peaks without playing sound; report missing audio as text. */
export async function drawOutputWaveform(svg, clip, unavailable) {
  if (!svg || !clip?.src) return;
  const key = `${clip.src}:${clip.sha256}`;
  try {
    if (!envelopes.has(key)) envelopes.set(key, envelope(clip));
    const peaks = await envelopes.get(key);
    if (!svg.isConnected) return;
    const scale = Math.max(...peaks) || 1;
    const path = peaks.map((peak, i) => {
      const x = 4 + i * 3.2, height = peak / scale * 32;
      return `M${x.toFixed(1)} ${(40 - height).toFixed(1)}V${(40 + height).toFixed(1)}`;
    }).join('');
    svg.querySelector('path').setAttribute('d', path);
    svg.dataset.status = 'ready';
  } catch {
    envelopes.delete(key);
    if (!svg.isConnected) return;
    svg.dataset.status = 'unavailable';
    svg.setAttribute('aria-label', unavailable);
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', '130'); label.setAttribute('y', '45'); label.setAttribute('text-anchor', 'middle');
    label.textContent = unavailable;
    svg.append(label);
  }
}
