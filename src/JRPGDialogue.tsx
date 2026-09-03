import React, { useEffect, useState, useRef } from 'react';
import { useChatStore } from './useChatStore';
import { soundFX } from './audio';

interface TypewriterProps {
  text: string;
  isLatest: boolean;
}

const TypewriterText: React.FC<TypewriterProps> = ({ text, isLatest }) => {
  const [displayedText, setDisplayedText] = useState(isLatest ? '' : text);
  const setAvatarState = useChatStore((state) => state.setAvatarState);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isLatest) {
      setDisplayedText(text);
      return;
    }

    // Only switch avatar to 'speaking' once response text actually starts arriving
    if (text.length > 0 && indexRef.current < text.length) {
      setAvatarState('speaking');
    }

    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        indexRef.current += 1;
        const nextIndex = indexRef.current;
        setDisplayedText(text.slice(0, nextIndex));

        if (nextIndex % 2 === 0) {
          soundFX.playBlip();
        }
      } else if (text.length > 0 && indexRef.current >= text.length) {
        // Return to idle state when typing finishes
        setAvatarState('idle');
      }
    }, 18);

    return () => clearInterval(timer);
  }, [text, isLatest, setAvatarState]);

  return <span>{displayedText}</span>;
};

export const JRPGDialogue = () => {
  const messages = useChatStore((state) => state.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="snes-box h-full p-4 overflow-y-auto flex flex-col gap-3 font-mono text-base leading-relaxed text-white">
      {messages.length === 0 ? (
        <p className="text-gray-400 italic">► Greetings Elijah. The wizard awaits your prompt.</p>
      ) : (
        messages.map((msg, index) => {
          const isLatestWizard = msg.sender === 'gemini' && index === messages.length - 1;
          return (
            <div key={index} className="flex gap-2">
              <span
                className={
                  msg.sender === 'user' ? 'text-yellow-400 font-bold shrink-0' : 'text-cyan-400 font-bold shrink-0'
                }
              >
                {msg.sender === 'user' ? 'HERO:' : 'WIZARD:'}
              </span>
              <span className="text-gray-100">
                {msg.sender === 'gemini' ? (
                  <TypewriterText text={msg.text} isLatest={isLatestWizard} />
                ) : (
                  msg.text
                )}
              </span>
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
};