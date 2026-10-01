import type { Metadata } from "next";
import Link from "next/link";
import { DeleteAccountGate } from "@/components/profile/DeleteAccountGate";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Delete Your Account",
  description: `How to delete your ${siteConfig.name} account and personal data.`,
};

export default function DeleteAccountPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-8 pb-24 md:pb-8">
      <div className="rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Delete your {siteConfig.name} account</h1>
        <p className="mt-2 text-sm text-gray-700">
          You can delete your {siteConfig.name} account at any time, from the website or the app.
        </p>

        <h2 className="mt-6 text-base font-bold text-gray-900">How to delete your account</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-800">
          <li>
            Sign in to your account (<Link href="/login" className="text-[var(--ishtari-red)] hover:underline">Log in</Link>).
          </li>
          <li>
            Open <Link href="/profile" className="text-[var(--ishtari-red)] hover:underline">Profile</Link>{" "}
            (&ldquo;Me&rdquo; in the app).
          </li>
          <li>Tap <strong>Delete account</strong>, enter your password and confirm.</li>
        </ol>
        <p className="mt-2 text-sm text-gray-700">If you are already signed in, you can use the form below.</p>

        <h2 className="mt-6 text-base font-bold text-gray-900">What happens to your data</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-800">
          <li>Deleted: your name, email address, phone number, saved addresses and basket / cart.</li>
          <li>
            Kept, anonymised: paid orders, which we must retain for accounting and legal purposes. They are no
            longer linked to you.
          </li>
          <li>Deletion is immediate and can&apos;t be undone.</li>
        </ul>
        <p className="mt-3 text-sm text-gray-700">
          See our <Link href="/privacy" className="text-[var(--ishtari-red)] hover:underline">Privacy Policy</Link>{" "}
          for more details.
        </p>

        <DeleteAccountGate />
      </div>
    </section>
  );
}
