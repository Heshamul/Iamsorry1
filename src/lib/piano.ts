// Tiny in-browser ambient piano. Plays soft sustained notes from a gentle progression.
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let timer: number | null = null;

const progression = [
  [261.63, 329.63, 392.0], // C major
  [220.0, 261.63, 329.63], // A minor
  [174.61, 220.0, 261.63], // F major
  [196.0, 246.94, 392.0], // G major
];

function playChord(freqs: number[], when: number, duration = 3.8) {
  if (!ctx || !master) return;
  freqs.forEach((f, idx) => {
    const osc = ctx!.createOscillator();
    const g = ctx!.createGain();
    osc.type = idx === 0 ? "triangle" : "sine";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(0.06, when + 0.4);
    g.gain.exponentialRampToValueAtTime(0.001, when + duration);
    osc.connect(g).connect(master!);
    osc.start(when);
    osc.stop(when + duration + 0.1);
  });
}

export function startPiano() {
  if (ctx) return;
  ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  master = ctx.createGain();
  master.gain.value = 0.35;
  const reverb = ctx.createBiquadFilter();
  reverb.type = "lowpass";
  reverb.frequency.value = 1800;
  master.connect(reverb).connect(ctx.destination);

  let step = 0;
  const schedule = () => {
    if (!ctx) return;
    const t = ctx.currentTime + 0.05;
    playChord(progression[step % progression.length], t);
    step++;
  };
  schedule();
  timer = window.setInterval(schedule, 3600);
}

export function stopPiano() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  if (ctx) {
    ctx.close();
    ctx = null;
    master = null;
  }
}

export function isPianoOn() {
  return ctx !== null;
}
