import React, { useEffect } from 'react';
import { useChatStore, LLMProvider } from './useChatStore';
import { soundFX } from './audio';

export const SettingsModal = () => {
  const isSettingsOpen = useChatStore((state) => state.isSettingsOpen);
  const setSettingsOpen = useChatStore((state) => state.setSettingsOpen);
  const selectedProvider = useChatStore((state) => state.selectedProvider);
  const setSelectedProvider = useChatStore((state) => state.setSelectedProvider);
  const apiKeys = useChatStore((state) => state.apiKeys);
  const setApiKey = useChatStore((state) => state.setApiKey);
  const purgeApiKeys = useChatStore((state) => state.purgeApiKeys);

  // Close modal when pressing the Escape key
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
    // Dark Backdrop: Clicking outside the box closes the modal
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={handleClose}
    >
      {/* Inner Box: stopPropagation prevents inner clicks from closing modal */}
      <div 
        className="snes-box w-full max-w-md p-4 flex flex-col gap-4 text-white relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title and Close [X] Button */}
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

        {/* Provider Selection & API Keys */}
        <div className="flex flex-col gap-3 text-xs">
          <label className="text-gray-300 font-bold">SELECT PROVIDER:</label>
          <div className="grid grid-cols-2 gap-2">
            {(['gemini', 'openai', 'claude', 'grok'] as LLMProvider[]).map((provider) => (
              <button
                key={provider}
                onClick={() => {
                  soundFX.playSelect();
                  setSelectedProvider(provider);
                }}
                className={`p-2 uppercase border text-center transition-colors cursor-pointer ${
                  selectedProvider === provider
                    ? 'bg-yellow-500 text-black border-yellow-300 font-bold'
                    : 'bg-slate-900 border-slate-700 hover:bg-slate-800'
                }`}
              >
                {provider}
              </button>
            ))}
          </div>

          <label className="text-gray-300 font-bold mt-2">
            {selectedProvider.toUpperCase()} API KEY:
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