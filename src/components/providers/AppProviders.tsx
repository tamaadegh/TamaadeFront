"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { BackgroundMusicProvider } from "@/contexts/BackgroundMusicContext";
import { CartProvider } from "@/contexts/CartContext";
import { FlashNotice } from "@/components/layout/FlashNotice";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <BackgroundMusicProvider>
          {children}
          <FlashNotice />
        </BackgroundMusicProvider>
      </CartProvider>
    </AuthProvider>
  );
}
