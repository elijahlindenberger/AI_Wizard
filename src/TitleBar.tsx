import React from 'react';
import { useChatStore } from './useChatStore';

export const TitleBar = () => {
  const setSettingsOpen = useChatStore((state) => state.setSettingsOpen);
  const selectedProvider = useChatStore((state) => state.selectedProvider);

  return (
    <div className="snes-box p-2 bg-slate-900 flex justify-between items-center text-xs font-mono">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSettingsOpen(true)}
          className="px-2 py-0.5 border border-yellow-500 text-yellow-400 hover:bg-yellow-950 font-bold"
          title="Open Settings"
        >
          ☰
        </button>
        <span className="text-blue-400 font-bold tracking-wider">MERLIN ASSISTANT</span>
      </div>
      <span className="text-slate-400">
        MODEL: <span className="text-green-400">{selectedProvider.toUpperCase()}</span>
      </span>
    </div>
  );
};