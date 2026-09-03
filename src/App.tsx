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
    <div className="h-screen w-screen bg-slate-950 flex flex-col p-2 gap-2 select-none overflow-hidden">
      <TitleBar />
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        <div className="flex gap-2 h-60 shrink-0">
          <div className="snes-box p-2 flex items-center justify-center w-60 shrink-0 overflow-hidden bg-black">
            <WizardCanvas />
          </div>
          <div className="snes-box p-3 flex-1 text-white text-xs md:text-sm flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-yellow-300 font-bold tracking-wider">MERLIN</span>
                <QuitButton />
              </div>
              <p className="mt-1 text-gray-300">STATUS: {avatarState.toUpperCase()}</p>
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

      {/* Global Settings Modal */}
      <SettingsModal />
    </div>
  );
}