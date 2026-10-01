"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getBackgroundMusic } from "@/lib/api/content";
import type { BackgroundMusicTrack } from "@/types";

const STORAGE_KEY = "tamaade:background-music";
/** Elements carrying this attribute don't count as the "first interaction" that unlocks autoplay. */
export const MUSIC_TOGGLE_ATTR = "data-music-toggle";

type BackgroundMusicContextValue = {
  /** True when the API reports an enabled track — controls are hidden otherwise. */
  available: boolean;
  /** User preference (default ON). */
  enabled: boolean;
  playing: boolean;
  track: BackgroundMusicTrack | null;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
};

const BackgroundMusicContext = createContext<BackgroundMusicContextValue | null>(null);

function readPreference(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

function writePreference(enabled: boolean) {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Storage blocked (private mode etc.) — preference just won't persist.
  }
}

function clampVolume(volume: number | undefined): number {
  if (typeof volume !== "number" || Number.isNaN(volume)) return 0.5;
  return Math.min(1, Math.max(0, volume));
}

export function BackgroundMusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<BackgroundMusicTrack | null>(null);
  const [enabled, setEnabledState] = useState(true);
  const [playing, setPlaying] = useState(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  // Load preference + config once on mount.
  useEffect(() => {
    setEnabledState(readPreference());
    let cancelled = false;
    getBackgroundMusic()
      .then((config) => {
        if (cancelled) return;
        setTrack(config.enabled && config.track?.url ? config.track : null);
      })
      .catch(() => {
        if (!cancelled) setTrack(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep other tabs in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setEnabledState(e.newValue !== "off");
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const tryPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src || !enabledRef.current || document.hidden) return;
    if (!audio.paused) return;
    // Rejected when the browser blocks autoplay — we retry on the next user interaction.
    void audio.play().catch(() => undefined);
  }, []);

  // React to track / preference changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (track && enabled) {
      tryPlay();
    } else {
      audio.pause();
    }
  }, [track, enabled, tryPlay]);

  // Volume follows the admin setting.
  useEffect(() => {
    if (audioRef.current && track) audioRef.current.volume = clampVolume(track.volume);
  }, [track]);

  // Autoplay unlock: start on the first pointerdown / keydown anywhere on the page.
  useEffect(() => {
    if (!track || !enabled || playing) return;
    function onInteract(e: Event) {
      const target = e.target as Element | null;
      if (target?.closest?.(`[${MUSIC_TOGGLE_ATTR}]`)) return;
      tryPlay();
    }
    window.addEventListener("pointerdown", onInteract, true);
    window.addEventListener("keydown", onInteract, true);
    return () => {
      window.removeEventListener("pointerdown", onInteract, true);
      window.removeEventListener("keydown", onInteract, true);
    };
  }, [track, enabled, playing, tryPlay]);

  // Pause when the tab is hidden, resume when visible again.
  useEffect(() => {
    function onVisibility() {
      if (document.hidden) {
        audioRef.current?.pause();
      } else {
        tryPlay();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [tryPlay]);

  const setEnabled = useCallback(
    (next: boolean) => {
      enabledRef.current = next;
      setEnabledState(next);
      writePreference(next);
      // Called from a click handler — a valid user gesture, so play() is allowed here.
      if (next) tryPlay();
      else audioRef.current?.pause();
    },
    [tryPlay],
  );

  const toggle = useCallback(() => setEnabled(!enabledRef.current), [setEnabled]);

  const value = useMemo<BackgroundMusicContextValue>(
    () => ({ available: track !== null, enabled, playing, track, setEnabled, toggle }),
    [track, enabled, playing, setEnabled, toggle],
  );

  return (
    <BackgroundMusicContext.Provider value={value}>
      {children}
      {track ? (
        <audio
          ref={audioRef}
          src={track.url}
          loop
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={() => setPlaying(false)}
          className="hidden"
          aria-hidden="true"
        />
      ) : null}
    </BackgroundMusicContext.Provider>
  );
}

export function useBackgroundMusic(): BackgroundMusicContextValue {
  const ctx = useContext(BackgroundMusicContext);
  if (!ctx) throw new Error("useBackgroundMusic must be used within BackgroundMusicProvider");
  return ctx;
}
