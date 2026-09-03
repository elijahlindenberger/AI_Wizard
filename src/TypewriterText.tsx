import React, { useState, useEffect } from 'react';
import { useChatStore } from './useChatStore';
import { playRetroSound } from './useAudioStore';

export const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const setAvatarState = useChatStore((state) => state.setAvatarState);

  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    setAvatarState('speaking');

    const interval = setInterval(() => {
      if (index < text.length) {
        const char = text.charAt(index);
        setDisplayedText((prev) => prev + char);
        if (char !== ' ') playRetroSound(440, 0.03, 'square');
        index++;
      } else {
        clearInterval(interval);
        setAvatarState('idle');
      }
    }, 25);

    return () => {
      clearInterval(interval);
      setAvatarState('idle');
    };
  }, [text, setAvatarState]);

  return <span>{displayedText}</span>;
};