import { apiClient } from "./client";
import type { BackgroundMusicConfig, PrivacyPolicy } from "@/types";

/** Public privacy policy text (admin-edited plain text). */
export async function getPrivacyPolicy(): Promise<PrivacyPolicy> {
  return apiClient<PrivacyPolicy>("/api/content/privacy/", {
    next: { revalidate: 60 },
  });
}

/** Public background-music config. `enabled=false` or `track=null` means no music. */
export async function getBackgroundMusic(): Promise<BackgroundMusicConfig> {
  return apiClient<BackgroundMusicConfig>("/api/content/background-music/", {
    cache: "no-store",
  });
}
