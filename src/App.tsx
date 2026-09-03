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
      {/* Locked 4:3 SNES container class */}
      <div className="snes-app-container flex flex-col p-2 gap-2 select-none overflow-hidden bg-black border-2 border-slate-800 shadow-2xl rounded-sm">
        <TitleBar />
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          <div className="flex gap-2 h-52 shrink-0">
            {/* Fixed 200x200 portrait box class */}
            <div className="snes-box snes-wizard-box p-2 flex items-center justify-center overflow-hidden bg-black">
              <WizardCanvas />
            </div>
            <div className="snes-box p-3 flex-1 text-white text-xs md:text-sm flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-300 font-bold tracking-wider">MERLIN</span>
                  <QuitButton />
                </div>
                <p className="mt-1 text-gray-200">STATUS: {avatarState.toUpperCase()}</p>
              </div>
              <HotkeySettings />
              <VolumeSlider />
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <JRPGDialogue />
          </div>
          <div className="shrink-0">
            <JRPGCommandBar />
          </div>
        </div>

        <SettingsModal />
      </div>
    </div>
  );
}