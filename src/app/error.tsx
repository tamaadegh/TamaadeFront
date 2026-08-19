"use client";

// Without this boundary a client-side exception renders Next's bare
// "Application error: a client-side exception has occurred" on a blank page -
// which is what a customer saw when the cart crashed, with no way forward and
// nothing in the logs. A shopper should always get a way out of a broken page.

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Production builds minify the message, but the digest ties it back to the
    // server-side log entry.
    console.error("Storefront error:", error.message, error.digest ?? "");
  }, [error]);

  return (
    <section className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-xl font-bold text-gray-900">Something went wrong</h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        This page could not be displayed. Your basket has not been changed.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-[var(--ishtari-red)] px-6 py-2.5 text-sm font-bold text-white hover:bg-[var(--ishtari-red-dark)]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Back to shop
        </Link>
      </div>
      {error.digest ? (
        <p className="mt-6 text-[11px] text-gray-400">Reference: {error.digest}</p>
      ) : null}
    </section>
  );
}
