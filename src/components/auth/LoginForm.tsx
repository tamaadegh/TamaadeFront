"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getApiErrorMessage } from "@/lib/api/client";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [usePhone, setUsePhone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({
        password,
        ...(usePhone ? { phone_number: phone } : { email }),
      });
      router.push("/profile");
      router.refresh();
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md px-4 py-8 pb-24 md:pb-8">
      <div className="rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm">
        <h1 className="text-center text-xl font-bold text-gray-900">Log In</h1>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          Connect with your Tamaade account
        </p>

        <div className="mt-4 flex rounded-md border border-gray-200 p-0.5 text-sm">
          <button
            type="button"
            onClick={() => setUsePhone(false)}
            className={`flex-1 rounded py-2 ${!usePhone ? "bg-[var(--ishtari-red)] text-white" : "text-gray-600"}`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setUsePhone(true)}
            className={`flex-1 rounded py-2 ${usePhone ? "bg-[var(--ishtari-red)] text-white" : "text-gray-600"}`}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {usePhone ? (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233..."
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[var(--ishtari-red)]"
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[var(--ishtari-red)]"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[var(--ishtari-red)]"
              required
            />
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-[var(--ishtari-red)] py-3 text-sm font-bold text-white hover:bg-[var(--ishtari-red-dark)] disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          No account?{" "}
          <Link href="/register" className="font-semibold text-[var(--ishtari-red)] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
