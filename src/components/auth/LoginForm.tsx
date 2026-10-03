"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { requestOtp } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/client";
import { cleanPhoneInput, isValidGhanaPhone } from "@/lib/utils/phone";
import { OtpCodeStep, getApiErrorCode, getRetryAfter, useCountdown } from "./OtpCodeStep";

type LoginFormProps = {
  /** Prefills the phone number (e.g. from `/login?phone=…`). */
  initialPhone?: string;
};

export function LoginForm({ initialPhone = "" }: LoginFormProps) {
  const { login, loginWithOtp } = useAuth();
  const router = useRouter();
  const [useEmail, setUseEmail] = useState(false);

  // Phone + OTP (default)
  const [phone, setPhone] = useState(initialPhone);
  const [sentTo, setSentTo] = useState<{ phone: string; resendIn: number } | null>(null);
  const [notRegistered, setNotRegistered] = useState<string | null>(null);
  const [sendCooldown, setSendCooldown] = useCountdown();

  // Email + password (secondary)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function onSignedIn() {
    router.push("/profile");
    router.refresh();
  }

  function switchMethod(toEmail: boolean) {
    setUseEmail(toEmail);
    setError(null);
    setNotRegistered(null);
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotRegistered(null);
    const cleaned = cleanPhoneInput(phone);
    if (!isValidGhanaPhone(cleaned)) {
      setError("Enter a valid Ghana mobile number, e.g. 024 123 4567.");
      return;
    }
    setSubmitting(true);
    try {
      const data = await requestOtp({ phone_number: cleaned, purpose: "login" });
      setSentTo({ phone: data.phone_number || cleaned, resendIn: data.resend_in ?? 60 });
    } catch (err) {
      const retryAfter = getRetryAfter(err);
      if (retryAfter) setSendCooldown(retryAfter);
      if (getApiErrorCode(err) === "not_registered") setNotRegistered(cleaned);
      setError(getApiErrorMessage(err, "Could not send the code. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      onSignedIn();
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed"));
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[var(--ishtari-red)]";

  return (
    <section className="mx-auto max-w-md px-4 py-8 pb-24 md:pb-8">
      <div className="rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm">
        <h1 className="text-center text-xl font-bold text-gray-900">Log In</h1>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">
          {useEmail
            ? "Sign in with your email and password"
            : "We'll text a one-time code to your phone"}
        </p>

        {useEmail ? (
          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {error && (
              <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-[var(--ishtari-red)] py-3 text-sm font-bold text-white hover:bg-[var(--ishtari-red-dark)] disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Log In"}
            </button>
          </form>
        ) : sentTo ? (
          <OtpCodeStep
            key={sentTo.phone}
            phoneNumber={sentTo.phone}
            initialResendIn={sentTo.resendIn}
            submitLabel="Log In"
            onVerify={async (code) => {
              await loginWithOtp({ phone_number: sentTo.phone, code, purpose: "login" });
              onSignedIn();
            }}
            onResend={() => requestOtp({ phone_number: sentTo.phone, purpose: "login" })}
            onChangeNumber={() => {
              setSentTo(null);
              setError(null);
            }}
          />
        ) : (
          <form onSubmit={handleSendCode} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="024 123 4567"
                className={inputClass}
                aria-describedby={error ? "login-error" : undefined}
                required
              />
            </div>

            {error && (
              <div
                id="login-error"
                role="alert"
                className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                <p>{error}</p>
                {notRegistered && (
                  <p className="mt-1">
                    <Link
                      href={`/register?phone=${encodeURIComponent(notRegistered)}`}
                      className="font-semibold text-[var(--ishtari-red)] hover:underline"
                    >
                      Create an account with this number
                    </Link>
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || sendCooldown > 0}
              className="w-full rounded-md bg-[var(--ishtari-red)] py-3 text-sm font-bold text-white hover:bg-[var(--ishtari-red-dark)] disabled:opacity-60"
            >
              {submitting
                ? "Sending…"
                : sendCooldown > 0
                  ? `Try again in ${sendCooldown}s`
                  : "Send code"}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm">
          <button
            type="button"
            onClick={() => switchMethod(!useEmail)}
            className="font-medium text-[var(--ishtari-red)] hover:underline"
          >
            {useEmail ? "Sign in with your phone number instead" : "Sign in with email instead"}
          </button>
        </p>

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
