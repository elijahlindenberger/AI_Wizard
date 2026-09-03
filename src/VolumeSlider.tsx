import React from 'react';
import { useChatStore } from './useChatStore';

export const VolumeSlider = () => {
  const volume = useChatStore((state) => state.volume);
  const setVolume = useChatStore((state) => state.setVolume);

  const percentage = Math.round(volume * 100);

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-green-400 select-none bg-slate-950/80 px-2 py-1 border border-green-500/50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <span className="tracking-wider text-green-500 font-bold">VOL:</span>
      
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-20 h-2 bg-slate-900 border border-green-500 rounded-none appearance-none cursor-pointer accent-green-400 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-green-400 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black"
      />

      <span className="w-10 text-right font-bold tracking-wider">
        {volume === 0 ? 'MUTED' : `${percentage}%`}
      </span>
    </div>
  );
};