import React from 'react';
import { useChatStore } from './useChatStore';

export const QuitButton = () => {
  const clearSession = useChatStore((state) => state.clearSession);

  const handleQuit = () => {
    clearSession();
    // Reboots the session; attempts tab closure if browser permits
    window.close();
  };

  return (
    <button
      onClick={handleQuit}
      className="px-2 py-0.5 bg-red-900/80 hover:bg-red-700 text-red-200 border border-red-500 text-[9px] font-mono rounded"
    >
      [RESET]
    </button>
  );
};