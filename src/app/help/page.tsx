import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center",
};

export default function HelpPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
      <p className="mt-2 text-[var(--muted)]">
        How can we help you today?
      </p>

      <div className="mt-8 space-y-3">
        {[
          { title: "Track my order", href: "/profile" },
          { title: "Returns & refunds", href: "/help" },
          { title: "Payment methods", href: "/help" },
          { title: "Shipping & delivery", href: "/help" },
          { title: "Account & profile", href: "/profile" },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:border-[var(--ishtari-red)]"
          >
            {item.title}
          </Link>
        ))}
      </div>

      <Link href="/" className="mt-8 inline-block text-sm font-medium text-[var(--ishtari-red)] hover:underline">
        ← Back to Home
      </Link>
    </section>
  );
}
