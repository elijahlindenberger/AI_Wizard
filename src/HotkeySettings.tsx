import React, { useEffect } from 'react';

export const HotkeySettings = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Triggers when Ctrl+Shift+W or Cmd+Shift+W is pressed
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'w') {
        event.preventDefault();
        
        // Find and focus the prompt input field in JRPGCommandBar
        const inputElem = document.querySelector<HTMLInputElement>('input[type="text"]');
        if (inputElem) {
          inputElem.focus();
          inputElem.select();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex justify-between items-center text-gray-300 my-1">
      <span>HOTKEY:</span>
      <span className="px-2 py-0.5 bg-blue-950 border border-blue-400 text-yellow-300 font-mono text-[9px] rounded">
        Ctrl+Shift+W
      </span>
    </div>
  );
};