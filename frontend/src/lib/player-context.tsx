'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import usePlayerConfig from '@/components/usePlayerConfig';

type PlayerContextType = {
  playlistUrl: string;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

const DEFAULT_URL = 'https://soundcloud.com/philmarzic/sets/steppe-by-steppe';

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { config } = usePlayerConfig();
  const playlistUrl = (config as any)?.vinyl?.playlistUrl ?? config?.soundcloud?.playlistUrl ?? DEFAULT_URL;

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState<number>(() => {
    if (typeof window === 'undefined') return 80;
    const v = Number(localStorage.getItem('vinyl_volume'));
    return Number.isFinite(v) ? Math.min(100, Math.max(0, v)) : 80;
  });

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(100, Math.max(0, v));
    setVolumeState(clamped);
    localStorage.setItem('vinyl_volume', String(clamped));
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        playlistUrl,
        isPlaying,
        setIsPlaying,
        volume,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
