"use client";

import Link from "next/link";
import { CircleHelp } from "lucide-react";
import { siteConfig } from "@/config/site";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <path
        fill="#25D366"
        d="M12.04 2C6.58 2 2.15 6.43 2.15 11.89c0 1.95.51 3.86 1.48 5.54L2 22l4.7-1.54a9.86 9.86 0 0 0 5.34 1.55h.01c5.46 0 9.89-4.43 9.89-9.89C21.94 6.43 17.5 2 12.04 2Zm5.73 14.01c-.24.67-1.4 1.24-1.93 1.32-.49.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.6-2.89-1.25-4.77-4.16-4.92-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36h.56c.18 0 .42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.32.02.51-.1.19-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.56.16.28.72 1.19 1.55 1.93 1.07.95 1.97 1.25 2.25 1.39.28.14.44.12.61-.07.16-.19.7-.81.89-1.09.19-.28.37-.23.63-.14.26.1 1.64.77 1.92.91.28.14.47.21.54.32.07.12.07.67-.17 1.34Z"
      />
    </svg>
  );
}

/** Ishtari-style stacked help + WhatsApp buttons */
export function FloatingActions() {
  return (
    <div className="fixed bottom-20 right-3 z-50 flex flex-col items-center gap-2 md:bottom-6 md:right-4">
      <Link
        href="/help"
        className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f3d6d8] shadow-md transition hover:bg-[#ecc4c7]"
        aria-label="Help center"
      >
        <CircleHelp className="h-5 w-5 text-gray-800" strokeWidth={1.75} />
      </Link>
      <a
        href={`https://wa.me/${siteConfig.whatsapp.replace("+", "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-11 items-center justify-center rounded-md bg-white shadow-md transition hover:bg-gray-50"
        aria-label="WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
