import type { Metadata } from "next";
import Link from "next/link";
import { getWhatsAppUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Help Center",
};

const links = [
  { title: "My basket & checkout", href: "/cart" },
  { title: "My account", href: "/profile" },
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Delete my account", href: "/account/delete" },
];

export default function HelpPage() {
  const whatsappUrl = getWhatsAppUrl();

  return (
    <section className="mx-auto max-w-2xl px-4 py-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
      <p className="mt-2 text-[var(--muted)]">How can we help you today?</p>

      <div className="mt-8 space-y-3">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:border-[var(--ishtari-red)]"
          >
            {item.title}
          </Link>
        ))}
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 hover:border-[var(--ishtari-red)]"
          >
            Contact us on WhatsApp
          </a>
        ) : null}
      </div>

      <Link href="/" className="mt-8 inline-block text-sm font-medium text-[var(--ishtari-red)] hover:underline">
        ← Back to Home
      </Link>
    </section>
  );
}
