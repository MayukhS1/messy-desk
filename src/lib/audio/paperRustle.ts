/** Gentle paper-rustle using Web Audio — no external asset required */
export function playPaperRustle() {
  if (typeof window === "undefined") return;

  try {
    const ctx = new AudioContext();
    const duration = 0.35;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 8) * (1 - t / duration);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.12;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    filter.Q.value = 0.6;

    const gain = ctx.createGain();
    gain.gain.value = 0.5;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();

    source.onended = () => {
      void ctx.close();
    };
  } catch {
    /* audio optional */
  }
}
