import React, { useState } from 'react';
import { soundFX } from './audio';

export const AudioControls = () => {
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());

  const handleToggle = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFX.playBlip();
  };

  return (
    <div className="flex justify-between items-center text-gray-300 my-1">
      <span>VOL:</span>
      <button
        onClick={handleToggle}
        className={`px-2 py-0.5 font-mono text-[9px] rounded border ${
          isMuted
            ? 'bg-gray-800 text-gray-400 border-gray-600'
            : 'bg-emerald-950 text-emerald-300 border-emerald-500'
        }`}
      >
        {isMuted ? '[MUTED]' : '[SOUND ON]'}
      </button>
    </div>
  );
};