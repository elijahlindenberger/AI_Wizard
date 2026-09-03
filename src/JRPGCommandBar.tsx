import React, { useState } from 'react';
import { useChatStore } from './useChatStore';
import { soundFX } from './audio';

export const JRPGCommandBar = () => {
  const [input, setInput] = useState('');
  const sendMessage = useChatStore((state) => state.sendMessage);
  const clearSession = useChatStore((state) => state.clearSession);

  const handleCast = () => {
    if (!input.trim()) {
      soundFX.playFizzle();
      return;
    }
    
    soundFX.playCast();
    soundFX.startCastingLoop();
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCast();
    }
  };

  const handleClear = () => {
    soundFX.playFizzle();
    clearSession();
    setInput('');
  };

  return (
    <div className="snes-box p-2 flex items-center gap-2">
      <span className="text-yellow-300 font-bold text-xs select-none pl-1">▶</span>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="TYPE COMMAND..."
        className="flex-1 bg-transparent text-white text-xs md:text-sm font-mono focus:outline-none placeholder-gray-500 pr-2"
      />
      
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleClear}
          className="px-2.5 py-1 bg-red-900 hover:bg-red-800 text-white text-xs font-bold border border-white cursor-pointer active:translate-y-0.5"
        >
          [OBLIVIATE]
        </button>
        <button
          onClick={handleCast}
          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-xs border border-white cursor-pointer active:translate-y-0.5"
        >
          [CAST]
        </button>
      </div>
    </div>
  );
};