"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password1: "",
    password2: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const result = await register({
        first_name: form.first_name,
        last_name: form.last_name,
        password1: form.password1,
        password2: form.password2,
        ...(form.email ? { email: form.email } : {}),
        ...(form.phone_number ? { phone_number: form.phone_number } : {}),
      });
      setSuccess(result.detail ?? "Account created. Please verify your email or phone.");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed"));
    } finally {
      setSubmitting(false);
    }
  }

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <section className="mx-auto max-w-md px-4 py-8 pb-24 md:pb-8">
      <div className="rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm">
        <h1 className="text-center text-xl font-bold text-gray-900">Create Account</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {(["first_name", "last_name", "email", "phone_number"] as const).map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium capitalize text-gray-700">
                {field.replace("_", " ")}
              </label>
              <input
                id={field}
                value={form[field]}
                onChange={(e) => update(field, e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[var(--ishtari-red)]"
                required={field === "first_name" || field === "last_name"}
              />
            </div>
          ))}
          {(["password1", "password2"] as const).map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                {field === "password1" ? "Password" : "Confirm password"}
              </label>
              <input
                id={field}
                type="password"
                value={form[field]}
                onChange={(e) => update(field, e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[var(--ishtari-red)]"
                required
              />
            </div>
          ))}

          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {success && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-[var(--ishtari-red)] py-3 text-sm font-bold text-white hover:bg-[var(--ishtari-red-dark)] disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[var(--ishtari-red)] hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </section>
  );
}
