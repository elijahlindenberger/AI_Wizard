import React, { useEffect, useRef } from 'react';
import { useChatStore, AvatarAction, LLMProvider } from './useChatStore';

// Helper to prepend Vite's base path cleanly without double slashes
const getAssetUrl = (path: string) => {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

// Sprite sheets for each LLM provider across idle, speaking, and casting states
const PROVIDER_SPRITE_MAPS: Record<LLMProvider, Record<AvatarAction, string>> = {
  gemini: {
    idle: 'sprites/merlin_idle.png',
    speaking: 'sprites/merlin_speaking.png',
    thinking: 'sprites/merlin_casting.png',
    casting: 'sprites/merlin_casting.png',
    nodding: 'sprites/merlin_idle.png',
  },
  openai: {
    idle: 'sprites/openai_idle.png',
    speaking: 'sprites/openai_speaking.png',
    thinking: 'sprites/openai_casting.png',
    casting: 'sprites/openai_casting.png',
    nodding: 'sprites/openai_idle.png',
  },
  claude: {
    idle: 'sprites/claude_idle.png',
    speaking: 'sprites/claude_speaking.png',
    thinking: 'sprites/claude_casting.png',
    casting: 'sprites/claude_casting.png',
    nodding: 'sprites/claude_idle.png',
  },
  grok: {
    idle: 'sprites/grok_idle.png',
    speaking: 'sprites/grok_speaking.png',
    thinking: 'sprites/grok_casting.png',
    casting: 'sprites/grok_casting.png',
    nodding: 'sprites/grok_idle.png',
  },
};

const FPS_MAP: Record<AvatarAction, number> = {
  idle: 5,
  speaking: 7,
  thinking: 8,
  casting: 8,
  nodding: 5,
};

const COLUMNS = 8;
const ROWS = 4;
const TOTAL_FRAMES = 32;
const BASE_INSET = 5;

const COL_CROP_SHIFTS = [0, 0, 1, 1, 2, 2, 2, 1];
const ROW_CROP_SHIFTS = [0, 1, 1, 0];

export const WizardCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const avatarState = useChatStore((state) => state.avatarState);
  const selectedProvider = useChatStore((state) => state.selectedProvider);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  // Preload all provider assets using getAssetUrl
  useEffect(() => {
    Object.entries(PROVIDER_SPRITE_MAPS).forEach(([provider, actionMap]) => {
      Object.entries(actionMap).forEach(([action, src]) => {
        const cacheKey = `${provider}_${action}`;
        const img = new Image();
        img.src = getAssetUrl(src);

        img.onerror = () => {
          img.onerror = null; // Instantly breaks potential infinite error loops
          const fallbackPath = PROVIDER_SPRITE_MAPS.gemini[action as AvatarAction];
          img.src = getAssetUrl(fallbackPath);
        };

        imagesRef.current[cacheKey] = img;
      });
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    let frameIndex = 0;
    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (now: number) => {
      const currentFps = FPS_MAP[avatarState] || 6;
      const frameDuration = 1000 / currentFps;
      const delta = now - lastTime;

      if (delta >= frameDuration) {
        frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
        lastTime = now - (delta % frameDuration);
      }

      // Fetch image key matching selected provider and active action
      const activeKey = `${selectedProvider}_${avatarState}`;
      const fallbackKey = `gemini_${avatarState}`;
      const activeImg = imagesRef.current[activeKey] || imagesRef.current[fallbackKey];

      if (activeImg && activeImg.complete && activeImg.naturalWidth > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const imgWidth = activeImg.naturalWidth;
        const imgHeight = activeImg.naturalHeight;

        const col = frameIndex % COLUMNS;
        const row = Math.floor(frameIndex / COLUMNS);

        const cellW = imgWidth / COLUMNS;
        const cellH = imgHeight / ROWS;

        const shiftX = COL_CROP_SHIFTS[col] || 0;
        const shiftY = ROW_CROP_SHIFTS[row] || 0;

        const srcX = Math.floor(col * cellW) + BASE_INSET + shiftX;
        const srcY = Math.floor(row * cellH) + BASE_INSET + shiftY;
        const srcW = Math.floor(cellW) - BASE_INSET * 2;
        const srcH = Math.floor(cellH) - BASE_INSET * 2;

        ctx.drawImage(
          activeImg,
          srcX,
          srcY,
          srcW,
          srcH,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [avatarState, selectedProvider]);

  return (
    <canvas
      ref={canvasRef}
      width={128}
      height={128}
      className="w-full h-full object-contain [image-rendering:pixelated]"
    />
  );
};