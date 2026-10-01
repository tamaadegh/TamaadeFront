"use client";

import { Music } from "lucide-react";
import { MUSIC_TOGGLE_ATTR, useBackgroundMusic } from "@/contexts/BackgroundMusicContext";

/** Profile "Settings" card. Hidden entirely when there is nothing to configure. */
export function SettingsSection() {
  const { available, enabled, setEnabled, track } = useBackgroundMusic();

  if (!available) return null;

  return (
    <div className="mt-4 rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-gray-900">Settings</h2>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Music className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ishtari-red)]" />
          <div className="min-w-0">
            <p id="bg-music-label" className="text-sm font-medium text-gray-900">
              Background music
            </p>
            <p className="truncate text-xs text-[var(--muted)]">
              {enabled ? `On${track?.title ? ` · ${track.title}` : ""}` : "Off"}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-labelledby="bg-music-label"
          {...{ [MUSIC_TOGGLE_ATTR]: "" }}
          onClick={() => setEnabled(!enabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
            enabled ? "bg-[var(--ishtari-red)]" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
