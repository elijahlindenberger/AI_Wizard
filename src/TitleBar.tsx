import React from 'react';
import { useChatStore } from './useChatStore';
import { soundFX } from './audio';

export const TitleBar = () => {
  const selectedProvider = useChatStore((state) => state.selectedProvider);
  const setSettingsOpen = useChatStore((state) => state.setSettingsOpen);

  return (
    <div className="snes-box p-2 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-2 sm:gap-4 text-xs overflow-hidden">
        <span className="text-yellow-300 font-bold tracking-wider whitespace-nowrap">MERLIN ASSISTANT</span>
        <span className="text-gray-300 text-[10px] whitespace-nowrap">MODEL: {selectedProvider.toUpperCase()}</span>
      </div>
      
      <button
        onClick={() => {
          soundFX.playSelect();
          setSettingsOpen(true);
        }}
        className="px-2.5 py-1 bg-blue-900 hover:bg-blue-800 text-yellow-300 text-xs font-bold border border-white cursor-pointer active:translate-y-0.5 shrink-0"
        title="Open Settings"
      >
        ☰
      </button>
    </div>
  );
};