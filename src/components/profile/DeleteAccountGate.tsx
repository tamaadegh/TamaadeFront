"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { DeleteAccountSection } from "./DeleteAccountSection";

/** Shows the deletion form for signed-in users, otherwise a sign-in prompt. */
export function DeleteAccountGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="mt-6 text-sm text-[var(--muted)]">Checking your session…</p>;
  }

  if (!user) {
    return (
      <div className="mt-6 rounded-lg border border-[var(--border)] bg-gray-50 p-4 text-sm text-gray-700">
        You are not signed in.{" "}
        <Link href="/login" className="font-semibold text-[var(--ishtari-red)] hover:underline">
          Log in
        </Link>{" "}
        and come back to this page (or open Profile) to delete your account.
      </div>
    );
  }

  return (
    <div className="mt-2">
      <p className="mt-6 text-sm text-gray-700">
        Signed in as <span className="font-semibold">{user.email || user.phone_number}</span>.
      </p>
      <DeleteAccountSection />
    </div>
  );
}
