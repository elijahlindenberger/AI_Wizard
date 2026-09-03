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

    // Switch avatar state to speaking while typing text
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
        // Return to idle state when dialogue finishes typing
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
    <div className="snes-box w-full h-full p-3 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto snes-scroll pr-1 flex flex-col gap-2 font-mono text-xs leading-relaxed text-white">
        {messages.length === 0 ? (
          <p className="text-gray-300">
            <span className="text-yellow-300 font-bold mr-1">▶</span>
            Greetings Elijah. The wizard awaits your prompt.
          </p>
        ) : (
          messages.map((msg, index) => {
            const isLatestWizard = msg.sender === 'gemini' && index === messages.length - 1;
            return (
              <div key={index} className="flex gap-1.5">
                <span
                  className={
                    msg.sender === 'user' ? 'text-cyan-300 font-bold shrink-0' : 'text-yellow-300 font-bold shrink-0'
                  }
                >
                  {msg.sender === 'user' ? 'HERO:' : 'WIZARD:'}
                </span>
                <span className="text-white">
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
    </div>
  );
};