import React from 'react';
import { TitleBar } from './TitleBar';
import { WizardCanvas } from './WizardCanvas';
import { JRPGDialogue } from './JRPGDialogue';
import { JRPGCommandBar } from './JRPGCommandBar';
import { SettingsModal } from './SettingsModal';
import './jrpg.css';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-2 sm:p-4 text-white">
      <div className="snes-app-container flex flex-col p-2 gap-2 select-none overflow-hidden bg-black border-2 border-slate-800 shadow-2xl rounded-sm">
        {/* Header Bar */}
        <TitleBar />

        {/* Main Interface: Wizard Portrait (Left) + JRPG Dialogue Box (Right) */}
        <div className="flex gap-2 flex-1 min-h-0 overflow-hidden">
          <div className="snes-box w-40 sm:w-48 shrink-0 p-2 flex items-center justify-center overflow-hidden bg-black">
            <WizardCanvas />
          </div>
          <div className="flex-1 min-w-0 h-full overflow-hidden">
            <JRPGDialogue />
          </div>
        </div>

        {/* Bottom Command Input Bar */}
        <div className="shrink-0">
          <JRPGCommandBar />
        </div>

        <SettingsModal />
      </div>
    </div>
  );
}