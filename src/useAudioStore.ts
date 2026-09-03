import { create } from 'zustand';

interface AudioStore {
  volume: number;
  isMuted: boolean;
  setVolume: (val: number) => void;
  toggleMute: () => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  volume: 0.5,
  isMuted: false,
  setVolume: (volume) => set({ volume }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}));

let audioCtx: AudioContext | null = null;

export const playRetroSound = (freq = 440, duration = 0.04, type: OscillatorType = 'square') => {
  const { volume, isMuted } = useAudioStore.getState();
  if (isMuted || volume === 0) return;

  if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  
  const effectiveVolume = volume * 0.05; 
  gain.gain.setValueAtTime(effectiveVolume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};