import React, { useState } from 'react';
import { useChatStore } from './useChatStore';

export const JRPGCommandBar = () => {
  const [input, setInput] = useState('');
  const sendMessage = useChatStore((state) => state.sendMessage);
  const clearSession = useChatStore((state) => state.clearSession);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="snes-box p-2 flex gap-2 items-center">
      <span className="text-yellow-400 text-sm pl-2">►</span>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="TYPE COMMAND..."
        className="flex-1 bg-transparent text-yellow-200 placeholder-blue-400 focus:outline-none font-mono text-base px-2"
      />
      <button
        type="button"
        onClick={clearSession}
        className="px-3 py-1 bg-red-950 hover:bg-red-800 text-red-300 border border-red-600 font-mono text-xs font-bold rounded"
      >
        [OBLIVIATE]
      </button>
      <button
        type="submit"
        className="px-4 py-1 bg-blue-900 hover:bg-blue-700 text-yellow-300 border border-yellow-400 font-mono text-xs font-bold rounded"
      >
        [CAST]
      </button>
    </form>
  );
};