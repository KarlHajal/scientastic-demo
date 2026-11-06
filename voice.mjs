import { vowelSettings } from './model.mjs';

/** Start and stop a local source-filter sound with no recording or network access. */
export class EducationalVoice {
  constructor(onStop) { this.onStop = onStop; this.nodes = []; this.context = null; this.generation = 0; }

  /** Cancel the start if the visitor leaves while the audio context resumes. */
  async start(settings) {
    const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContext) throw new Error('Audio is unavailable.');
    this.stop(false);
    const generation = this.generation;
    this.context ??= new AudioContext();
    await this.context.resume();
    if (generation !== this.generation) return;
    const context = this.context;
    const oscillator = context.createOscillator();
    oscillator.type = 'sawtooth';
    this.voiced = context.createGain();
    oscillator.connect(this.voiced);
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    const noise = context.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    this.breath = context.createGain();
    noise.connect(this.breath);
    const mix = context.createGain();
    this.voiced.connect(mix);
    this.breath.connect(mix);
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -20;
    compressor.ratio.value = 6;
    this.output = context.createGain();
    this.output.gain.value = 0;
    compressor.connect(this.output);
    this.output.connect(context.destination);
    this.filters = [0, 1, 2].map((index) => {
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = [7, 10, 12][index];
      const gain = context.createGain();
      gain.gain.value = [1, 0.7, 0.3][index];
      mix.connect(filter); filter.connect(gain); gain.connect(compressor);
      this.nodes.push(filter, gain);
      return filter;
    });
    this.oscillator = oscillator;
    this.sources = [oscillator, noise];
    this.nodes.push(oscillator, noise, mix, this.voiced, this.breath, compressor, this.output);
    this.update(settings);
    this.output.gain.setTargetAtTime(0.22, context.currentTime, 0.03);
    oscillator.start(); noise.start();
  }

  /** Apply controls to an active voice; remain silent if no graph exists. */
  update(settings) {
    if (!this.oscillator) return;
    const time = this.context.currentTime;
    const { formants } = vowelSettings(settings.front, settings.height, settings.limited);
    this.oscillator.frequency.setTargetAtTime(settings.pitch, time, 0.04);
    this.voiced.gain.setTargetAtTime(settings.voiced ? 0.65 : 0, time, 0.04);
    this.breath.gain.setTargetAtTime(settings.voiced ? 0.012 : 0.45, time, 0.04);
    this.filters.forEach((filter, i) => filter.frequency.setTargetAtTime(formants[i], time, 0.04));
  }

  /** Release sources and cancel any start still waiting for user activation. */
  stop(notify = true) {
    this.generation += 1;
    for (const source of this.sources ?? []) { try { source.stop(); } catch {} }
    for (const node of this.nodes) node.disconnect();
    this.sources = []; this.nodes = []; this.oscillator = null;
    if (notify) this.onStop?.();
  }
}
