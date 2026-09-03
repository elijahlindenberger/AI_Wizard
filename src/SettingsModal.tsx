import React, { useEffect } from 'react';
import { useChatStore, LLMProvider } from './useChatStore';
import { soundFX } from './audio';

const PROVIDER_LABELS: Record<LLMProvider, string> = {
  gemini: 'GEMINI',
  openai: 'OPEN AI',
  claude: 'CLAUDE',
  grok: 'GROK',
};

export const SettingsModal = () => {
  const isSettingsOpen = useChatStore((state) => state.isSettingsOpen);
  const setSettingsOpen = useChatStore((state) => state.setSettingsOpen);
  const selectedProvider = useChatStore((state) => state.selectedProvider);
  const setSelectedProvider = useChatStore((state) => state.setSelectedProvider);
  const apiKeys = useChatStore((state) => state.apiKeys);
  const setApiKey = useChatStore((state) => state.setApiKey);
  const purgeApiKeys = useChatStore((state) => state.purgeApiKeys);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSettingsOpen) {
        soundFX.playSelect();
        setSettingsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, setSettingsOpen]);

  if (!isSettingsOpen) return null;

  const handleClose = () => {
    soundFX.playSelect();
    setSettingsOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleClose}
    >
      <div 
        className="snes-box w-full max-w-md p-4 flex flex-col gap-4 text-white relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-white pb-2">
          <span className="text-yellow-300 font-bold text-xs sm:text-sm tracking-wider">SPELLBOOK SETTINGS</span>
          <button
            onClick={handleClose}
            className="px-2 py-1 bg-red-800 hover:bg-red-700 text-white font-bold text-xs border border-white cursor-pointer active:translate-y-0.5"
            aria-label="Close settings"
          >
            [X]
          </button>
        </div>

        {/* Provider Selector Grid */}
        <div className="flex flex-col gap-3 text-xs">
          <label className="text-gray-300 font-bold">SELECT PROVIDER:</label>

          <div className="snes-provider-grid">
            {(['gemini', 'openai', 'claude', 'grok'] as LLMProvider[]).map((provider) => {
              const isSelected = selectedProvider === provider;
              return (
                <button
                  key={provider}
                  type="button"
                  onClick={() => {
                    soundFX.playSelect();
                    setSelectedProvider(provider);
                  }}
                  className={`snes-provider-btn ${
                    isSelected ? 'snes-provider-btn-active' : 'snes-provider-btn-inactive'
                  }`}
                >
                  {PROVIDER_LABELS[provider]}
                </button>
              );
            })}
          </div>

          <label className="text-gray-300 font-bold mt-2">
            {PROVIDER_LABELS[selectedProvider]} API KEY:
          </label>
          <input
            type="password"
            value={apiKeys[selectedProvider] || ''}
            onChange={(e) => setApiKey(selectedProvider, e.target.value)}
            placeholder="Enter API Key..."
            className="w-full p-2 bg-black border border-white text-white text-xs focus:outline-none focus:border-yellow-300"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-700">
          <button
            onClick={() => {
              soundFX.playFizzle();
              purgeApiKeys();
            }}
            className="px-2 py-1 bg-red-950 hover:bg-red-900 text-red-300 border border-red-700 text-[10px] cursor-pointer"
          >
            PURGE KEYS
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white font-bold text-xs border border-white cursor-pointer active:translate-y-0.5"
          >
            [ SAVE & CLOSE ]
          </button>
        </div>
      </div>
    </div>
  );
};