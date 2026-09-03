import React from 'react';
import { TitleBar } from './TitleBar';
import { WizardCanvas } from './WizardCanvas';
import { JRPGDialogue } from './JRPGDialogue';
import { JRPGCommandBar } from './JRPGCommandBar';
import { VolumeSlider } from './VolumeSlider';
import { HotkeySettings } from './HotkeySettings';
import { QuitButton } from './QuitButton';
import { SettingsModal } from './SettingsModal';
import { useChatStore } from './useChatStore';
import './jrpg.css';

export default function App() {
  const avatarState = useChatStore((state) => state.avatarState);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-2 sm:p-4 text-white">
      <div className="snes-app-container flex flex-col p-2 gap-2 select-none overflow-hidden bg-black border-2 border-slate-800 shadow-2xl rounded-sm">
        {/* Top Header */}
        <TitleBar />
        
        {/* Main 2-Column JRPG Interface */}
        <div className="flex-1 flex gap-2 min-h-0">
          {/* Left Column: Avatar (Top) + Status Details (Bottom) */}
          <div className="w-48 flex flex-col gap-2 shrink-0 min-h-0">
            <div className="snes-box h-44 p-2 flex items-center justify-center overflow-hidden bg-black shrink-0">
              <WizardCanvas />
            </div>
            <div className="snes-box p-2 flex-1 text-white text-[10px] flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-yellow-300 font-bold tracking-wider">MERLIN</span>
                  <QuitButton />
                </div>
                <p className="text-gray-200 text-[10px]">STATUS: {avatarState.toUpperCase()}</p>
              </div>
              <HotkeySettings />
              <VolumeSlider />
            </div>
          </div>

          {/* Right Column: Dialogue Chat Box filling the remaining space */}
          <div className="snes-box flex-1 min-h-0 p-3 flex flex-col overflow-hidden">
            <JRPGDialogue />
          </div>
        </div>

        {/* Bottom Command Bar */}
        <div className="shrink-0">
          <JRPGCommandBar />
        </div>

        <SettingsModal />
      </div>
    </div>
  );
}