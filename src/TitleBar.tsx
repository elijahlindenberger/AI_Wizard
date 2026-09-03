import React from 'react';
import { useChatStore } from './useChatStore';
import { soundFX } from './audio';
import { VolumeSlider } from './VolumeSlider';

export const TitleBar = () => {
  const selectedProvider = useChatStore((state) => state.selectedProvider);
  const setSettingsOpen = useChatStore((state) => state.setSettingsOpen);

  return (
    <div className="snes-box p-2 flex justify-between items-center gap-2 shrink-0">
      <div className="flex items-center gap-3 text-xs overflow-hidden">
        <span className="text-yellow-300 font-bold tracking-wider whitespace-nowrap">
          MERLIN ASSISTANT
        </span>
        <span className="text-gray-300 text-[10px] whitespace-nowrap">
          MODEL: {selectedProvider.toUpperCase()}
        </span>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <VolumeSlider />
        <button
          onClick={() => {
            soundFX.playSelect();
            setSettingsOpen(true);
          }}
          className="px-2 py-1 bg-blue-900 hover:bg-blue-800 text-yellow-300 text-[10px] font-bold border border-white cursor-pointer active:translate-y-0.5 shrink-0"
          title="Open Settings"
        >
          [MENU]
        </button>
      </div>
    </div>
  );
};