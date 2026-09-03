import React from 'react';
import { useChatStore, LLMProvider } from './useChatStore';

const PROVIDERS: { id: LLMProvider; name: string }[] = [
  { id: 'gemini', name: 'Google Gemini' },
  { id: 'openai', name: 'OpenAI (GPT)' },
  { id: 'claude', name: 'Anthropic Claude' },
  { id: 'grok', name: 'xAI Grok' },
];

export const SettingsModal = () => {
  const isSettingsOpen = useChatStore((state) => state.isSettingsOpen);
  const setSettingsOpen = useChatStore((state) => state.setSettingsOpen);
  const selectedProvider = useChatStore((state) => state.selectedProvider);
  const setSelectedProvider = useChatStore((state) => state.setSelectedProvider);
  const apiKeys = useChatStore((state) => state.apiKeys);
  const setApiKey = useChatStore((state) => state.setApiKey);
  const purgeApiKeys = useChatStore((state) => state.purgeApiKeys);

  if (!isSettingsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="snes-box w-full max-w-md bg-slate-900 text-white font-mono p-4 flex flex-col gap-4 border-2 border-yellow-500 shadow-2xl">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
          <span className="text-yellow-400 font-bold tracking-wider">⚙ SPELLBOOK SETTINGS</span>
          <button
            onClick={() => setSettingsOpen(false)}
            className="text-red-400 hover:text-red-300 font-bold"
          >
            [X]
          </button>
        </div>

        {/* Active Model Switcher */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400">ACTIVE LLM ARCHMAGE:</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as LLMProvider)}
            className="bg-black border border-blue-500 text-green-400 p-2 text-sm focus:outline-none"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {apiKeys[p.id] ? '✓' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* API Key Inputs */}
        <div className="flex flex-col gap-3 my-1 max-h-56 overflow-y-auto pr-1">
          <span className="text-xs text-yellow-300">API KEYS (SAVED LOCALLY):</span>
          {PROVIDERS.map((p) => (
            <div key={p.id} className="flex flex-col gap-1">
              <span className="text-xs text-slate-300">{p.name}:</span>
              <input
                type="password"
                placeholder={`Enter ${p.name} Key...`}
                value={apiKeys[p.id] || ''}
                onChange={(e) => setApiKey(p.id, e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-green-400 p-2 focus:border-yellow-400 focus:outline-none"
              />
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              if (confirm('Purge all saved API keys from browser memory?')) {
                purgeApiKeys();
              }
            }}
            className="border border-red-600 bg-red-950/50 text-red-400 hover:bg-red-900 text-xs px-2 py-1"
          >
            🔥 PURGE KEYS
          </button>
          <button
            onClick={() => setSettingsOpen(false)}
            className="border border-green-500 bg-green-950/50 text-green-400 hover:bg-green-900 text-xs px-4 py-1 font-bold"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};