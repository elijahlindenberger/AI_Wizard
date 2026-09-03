import { create } from 'zustand';
import { GoogleGenAI } from '@google/genai';
import { soundFX } from './audio';

export type LLMProvider = 'gemini' | 'openai' | 'claude' | 'grok';
export type AvatarAction = 'idle' | 'thinking' | 'speaking' | 'nodding' | 'casting';

interface Message {
  sender: 'user' | 'gemini';
  text: string;
}

interface ChatStore {
  messages: Message[];
  avatarState: AvatarAction;
  setAvatarState: (state: AvatarAction) => void;
  volume: number;
  setVolume: (volume: number) => void;
  
  // Multi-LLM State
  selectedProvider: LLMProvider;
  setSelectedProvider: (provider: LLMProvider) => void;
  apiKeys: Record<LLMProvider, string>;
  setApiKey: (provider: LLMProvider, key: string) => void;
  purgeApiKeys: () => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;

  sendMessage: (prompt: string) => Promise<void>;
  clearSession: () => void;
}

const STORAGE_KEY = 'merlin_api_keys';

const loadSavedKeys = (): Record<LLMProvider, string> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { gemini: '', openai: '', claude: '', grok: '' };
  } catch {
    return { gemini: '', openai: '', claude: '', grok: '' };
  }
};

let ai: GoogleGenAI | null = null;

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  avatarState: 'idle',
  setAvatarState: (avatarState) => set({ avatarState }),
  volume: 0.7,
  setVolume: (volume: number) => {
    set({ volume });
    if (typeof (soundFX as any).setVolume === 'function') {
      (soundFX as any).setVolume(volume);
    }
  },

  selectedProvider: 'gemini',
  setSelectedProvider: (provider) => set({ selectedProvider: provider }),
  apiKeys: loadSavedKeys(),
  setApiKey: (provider, key) => {
    const updated = { ...get().apiKeys, [provider]: key };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ apiKeys: updated });
  },
  purgeApiKeys: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ apiKeys: { gemini: '', openai: '', claude: '', grok: '' } });
  },
  isSettingsOpen: false,
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),

  sendMessage: async (prompt: string) => {
    const { selectedProvider, apiKeys } = get();
    // Fall back to VITE env key if local key isn't entered for Gemini
    const key = apiKeys[selectedProvider] || (selectedProvider === 'gemini' ? import.meta.env.VITE_GEMINI_API_KEY : '');

    if (!key) {
      soundFX.playFizzle();
      set({ isSettingsOpen: true }); // Automatically open settings if key is missing
      set((state) => ({
        messages: [
          ...state.messages,
          { sender: 'user', text: prompt },
          { sender: 'gemini', text: `Missing API key for ${selectedProvider.toUpperCase()}! Please enter it in Settings.` },
        ],
        avatarState: 'idle',
      }));
      return;
    }

    soundFX.playSpellCast();
    const currentMessages = get().messages;
    const updatedMessages: Message[] = [
      ...currentMessages,
      { sender: 'user', text: prompt },
      { sender: 'gemini', text: '' },
    ];

    set({ messages: updatedMessages, avatarState: 'casting' });

    try {
      let fullText = '';

      // --- Provider Routing ---
      if (selectedProvider === 'gemini') {
        if (!ai) ai = new GoogleGenAI({ apiKey: key });
        const contents = updatedMessages.slice(0, -1).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));
        const responseStream = await ai.models.generateContentStream({
          model: 'gemini-3.6-flash',
          contents,
          config: { systemInstruction: 'You are Merlin, a wise pixel-art wizard assistant. Keep responses concise (under 3 sentences).' },
        });

        for await (const chunk of responseStream) {
          if (chunk.text) {
            fullText += chunk.text;
            set((state) => {
              const newMsgs = [...state.messages];
              newMsgs[newMsgs.length - 1] = { sender: 'gemini', text: fullText };
              return { messages: newMsgs };
            });
          }
        }
      } else if (selectedProvider === 'openai' || selectedProvider === 'grok') {
        const endpoint = selectedProvider === 'grok' 
          ? 'https://api.x.ai/v1/chat/completions' 
          : 'https://api.openai.com/v1/chat/completions';
        const model = selectedProvider === 'grok' ? 'grok-2-latest' : 'gpt-4o-mini';

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: 'You are Merlin, a wise pixel-art wizard assistant. Keep responses under 3 sentences.' },
              ...updatedMessages.slice(0, -1).map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
            ],
          }),
        });
        const data = await res.json();
        fullText = data.choices?.[0]?.message?.content || 'Spell failed.';
        set((state) => {
          const newMsgs = [...state.messages];
          newMsgs[newMsgs.length - 1] = { sender: 'gemini', text: fullText };
          return { messages: newMsgs };
        });
      } else if (selectedProvider === 'claude') {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-3-5-haiku-20241022',
            max_tokens: 150,
            system: 'You are Merlin, a wise pixel-art wizard assistant. Keep responses under 3 sentences.',
            messages: updatedMessages.slice(0, -1).map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
          }),
        });
        const data = await res.json();
        fullText = data.content?.[0]?.text || 'Spell failed.';
        set((state) => {
          const newMsgs = [...state.messages];
          newMsgs[newMsgs.length - 1] = { sender: 'gemini', text: fullText };
          return { messages: newMsgs };
        });
      }
    } catch (err: any) {
      console.error('LLM API Error:', err);
      soundFX.playFizzle();
      set((state) => {
        const newMsgs = [...state.messages];
        newMsgs[newMsgs.length - 1] = { sender: 'gemini', text: `Spell failed: ${err.message || 'Check API key or network connection.'}` };
        return { messages: newMsgs, avatarState: 'idle' };
      });
    }
  },

  clearSession: () => {
    ai = null;
    set({ messages: [], avatarState: 'idle' });
  },
}));