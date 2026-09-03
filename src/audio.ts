export class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.3;
  private isMuted: boolean = false;

  private castingGain: GainNode | null = null;
  private castingOscs: OscillatorNode[] = [];
  private castingLfo: OscillatorNode | null = null;

  constructor() {
    this.setupAutoplayUnlock();
  }

  private setupAutoplayUnlock() {
    const unlock = () => {
      if (!this.ctx) {
        this.init();
      } else if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  private init() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime
      );
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(level: number) {
    this.volume = Math.max(0, Math.min(1, level));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime
      );
    }
    return this.isMuted;
  }

  public playTextBeep() {
    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.ctx.state !== 'running') return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440 + Math.random() * 60, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playBlip() {
    this.playTextBeep();
  }

  public playSelect() {
    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.ctx.state !== 'running') return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
    osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  public playCast() {
    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.ctx.state !== 'running') return;

    const now = this.ctx.currentTime;
    const frequencies = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51];

    frequencies.forEach((freq, index) => {
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const noteStart = now + index * 0.04;
      const noteEnd = noteStart + 0.18;

      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.12, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(noteStart);
      osc.stop(noteEnd);
    });
  }

  // Continuous retro magical aura hum while prompt/streaming is active
  public startCastingLoop() {
    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.ctx.state !== 'running') return;
    if (this.castingGain) return;

    const now = this.ctx.currentTime;
    this.castingGain = this.ctx.createGain();

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(164.81, now);
    osc2.frequency.setValueAtTime(165.81, now);

    lfo.frequency.setValueAtTime(4, now);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(12, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);

    this.castingGain.gain.setValueAtTime(0.01, now);
    this.castingGain.gain.linearRampToValueAtTime(0.06, now + 0.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(this.castingGain);
    this.castingGain.connect(this.masterGain);

    lfo.start(now);
    osc1.start(now);
    osc2.start(now);

    this.castingOscs = [osc1, osc2];
    this.castingLfo = lfo;
  }

  public stopCastingLoop() {
    if (!this.ctx || !this.castingGain) return;

    const now = this.ctx.currentTime;
    this.castingGain.gain.setValueAtTime(this.castingGain.gain.value, now);
    this.castingGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

    const osstoStop = [...this.castingOscs];
    const lfoToStop = this.castingLfo;

    this.castingOscs = [];
    this.castingLfo = null;
    this.castingGain = null;

    setTimeout(() => {
      osstoStop.forEach((osc) => {
        try { osc.stop(); } catch {}
      });
      if (lfoToStop) {
        try { lfoToStop.stop(); } catch {}
      }
    }, 120);
  }

  public playSpellCast() {
    this.playCast();
  }

  public playFizzle() {
    this.stopCastingLoop();
    this.init();
    if (!this.ctx || !this.masterGain || this.isMuted || this.ctx.state !== 'running') return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
}

export const soundFX = new RetroAudioEngine();
export const audioEngine = soundFX;