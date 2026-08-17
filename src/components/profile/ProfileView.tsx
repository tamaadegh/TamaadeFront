"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export function ProfileView() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <section className="mx-auto max-w-md px-4 py-8">
        <p className="text-center text-sm text-[var(--muted)]">Loading account…</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-md px-4 py-8 pb-24 md:pb-8">
        <div className="rounded-lg border border-[var(--border)] bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">My Account</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">Log in to manage your profile and orders.</p>
          <Link
            href="/login"
            className="mt-6 inline-block w-full rounded-md bg-[var(--ishtari-red)] py-3 text-sm font-bold text-white hover:bg-[var(--ishtari-red-dark)]"
          >
            Log In
          </Link>
          <p className="mt-4 text-sm text-[var(--muted)]">
            No account?{" "}
            <Link href="/register" className="font-semibold text-[var(--ishtari-red)] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-8 pb-24 md:pb-8">
      <div className="rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">
          {user.first_name} {user.last_name}
        </h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>
        {user.phone_number && (
          <p className="text-sm text-[var(--muted)]">{user.phone_number}</p>
        )}

        {user.profile?.bio && (
          <p className="mt-4 text-sm text-gray-700">{user.profile.bio}</p>
        )}

        <div className="mt-6 space-y-2">
          <Link href="/cart" className="block rounded-md border border-gray-200 px-4 py-3 text-sm hover:border-[var(--ishtari-red)]">
            Orders / Basket
          </Link>
          <Link href="/profile?tab=addresses" className="block rounded-md border border-gray-200 px-4 py-3 text-sm hover:border-[var(--ishtari-red)]">
            Addresses ({user.addresses?.length ?? 0})
          </Link>
        </div>

        <button
          type="button"
          onClick={() => void logout()}
          className="mt-6 w-full rounded-md border border-[var(--ishtari-red)] py-3 text-sm font-bold text-[var(--ishtari-red)] hover:bg-[#eef3ef]"
        >
          Sign Out
        </button>
      </div>
    </section>
  );
}
