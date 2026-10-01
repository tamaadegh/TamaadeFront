"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, X } from "lucide-react";
import { FLASH_EVENT, takeFlashMessage } from "@/lib/utils/flash";

/** Shows one-time messages queued with `setFlashMessage` (e.g. after account deletion). */
export function FlashNotice() {
  const pathname = usePathname();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const pending = takeFlashMessage();
    if (pending) setMessage(pending);
  }, [pathname]);

  useEffect(() => {
    function onFlash() {
      const pending = takeFlashMessage();
      if (pending) setMessage(pending);
    }
    window.addEventListener(FLASH_EVENT, onFlash);
    return () => window.removeEventListener(FLASH_EVENT, onFlash);
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 8000);
    return () => window.clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed left-1/2 top-4 z-[80] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-start gap-3 rounded-lg border border-green-200 bg-white px-4 py-3 shadow-lg"
    >
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
      <p className="flex-1 text-sm text-gray-800">{message}</p>
      <button type="button" onClick={() => setMessage(null)} aria-label="Dismiss" className="text-gray-400 hover:text-gray-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
