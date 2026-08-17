import type { Metadata } from "next";
import Link from "next/link";
import { Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Visual Search",
};

export default function VisualSearchPage() {
  return (
    <section className="mx-auto max-w-lg px-4 py-12 pb-24 text-center md:pb-8">
      <Camera className="mx-auto h-16 w-16 text-[var(--ishtari-red)]" />
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Visual Search</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Upload or take a photo to find similar products — like Ishtari camera search.
      </p>
      <div className="mt-8 space-y-3">
        <button
          type="button"
          className="w-full rounded-md bg-[var(--ishtari-red)] py-3 text-sm font-bold text-white hover:bg-[var(--ishtari-red-dark)]"
        >
          Upload a Photo
        </button>
        <button
          type="button"
          className="w-full rounded-md border border-gray-300 bg-white py-3 text-sm font-bold text-gray-800 hover:bg-gray-50"
        >
          Take a Photo
        </button>
      </div>
      <Link href="/" className="mt-6 inline-block text-sm text-[var(--ishtari-red)] hover:underline">
        Back to Home
      </Link>
    </section>
  );
}
