"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function RequireInfoBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("require-info-dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="mx-auto flex max-w-7xl items-start justify-between gap-4 px-4 py-3">
        <div>
          <h2 className="text-sm font-bold text-amber-900">Require Info</h2>
          <p className="mt-1 text-xs text-amber-800 md:text-sm">
            You should update and complete your account information for better
            experience.
          </p>
          <Link
            href="/profile"
            className="mt-2 inline-block rounded-md bg-[var(--ishtari-red)] px-4 py-1.5 text-xs font-bold text-white hover:bg-[var(--ishtari-red-dark)]"
          >
            Continue
          </Link>
        </div>
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem("require-info-dismissed", "1");
            setVisible(false);
          }}
          className="shrink-0 text-amber-700 hover:text-amber-900"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
