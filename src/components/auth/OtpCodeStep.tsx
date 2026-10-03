"use client";

import { useEffect, useRef, useState } from "react";
import { ApiError, getApiErrorMessage } from "@/lib/api/client";
import type { OtpRequestResponse } from "@/types";

/** Seconds counter that ticks down to 0 once per second. */
export function useCountdown(initial = 0) {
  const [remaining, setRemaining] = useState(initial);
  useEffect(() => {
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearTimeout(t);
  }, [remaining]);
  return [remaining, setRemaining] as const;
}

/** `retry_after` seconds from a 429 response, if present. */
export function getRetryAfter(err: unknown): number | null {
  if (!(err instanceof ApiError) || err.status !== 429) return null;
  const data = err.data as { retry_after?: unknown } | null;
  const value = Number(data?.retry_after);
  return Number.isFinite(value) && value > 0 ? Math.ceil(value) : null;
}

/** Machine-readable `code` from an API error body (e.g. "not_registered"). */
export function getApiErrorCode(err: unknown): string | null {
  if (!(err instanceof ApiError)) return null;
  const data = err.data as { code?: unknown } | null;
  return typeof data?.code === "string" ? data.code : null;
}

type OtpCodeStepProps = {
  /** Normalised number the code was sent to. */
  phoneNumber: string;
  /** Seconds before a new code may be requested (from `resend_in`). */
  initialResendIn: number;
  /** Verifies the code; throw to show an error. */
  onVerify: (code: string) => Promise<void>;
  /** Requests a fresh code; throw to show an error. */
  onResend: () => Promise<OtpRequestResponse>;
  onChangeNumber: () => void;
  submitLabel?: string;
};

/** Step 2 of phone sign-in / sign-up: 6-digit code entry with resend countdown. */
export function OtpCodeStep({
  phoneNumber,
  initialResendIn,
  onVerify,
  onResend,
  onChangeNumber,
  submitLabel = "Verify",
}: OtpCodeStepProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendIn, setResendIn] = useCountdown(initialResendIn);
  const inputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);

  async function verify(value: string) {
    if (submittingRef.current || value.length !== 6) return;
    submittingRef.current = true;
    setError(null);
    setInfo(null);
    setSubmitting(true);
    try {
      await onVerify(value);
    } catch (err) {
      const retryAfter = getRetryAfter(err);
      if (retryAfter) setResendIn(retryAfter);
      setError(getApiErrorMessage(err, "Incorrect or expired code. Please try again."));
      setCode("");
      inputRef.current?.focus();
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function handleChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setCode(digits);
    if (digits.length === 6) void verify(digits);
  }

  async function handleResend() {
    if (resendIn > 0 || resending) return;
    setError(null);
    setInfo(null);
    setResending(true);
    try {
      const data = await onResend();
      setResendIn(data.resend_in ?? 60);
      setInfo(data.detail || "A new code has been sent.");
      setCode("");
      inputRef.current?.focus();
    } catch (err) {
      const retryAfter = getRetryAfter(err);
      if (retryAfter) setResendIn(retryAfter);
      setError(getApiErrorMessage(err, "Could not resend the code. Please try again."));
    } finally {
      setResending(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void verify(code);
      }}
      className="mt-6 space-y-4"
    >
      <p className="text-sm text-gray-700">
        Enter the 6-digit code sent to <span className="font-semibold">{phoneNumber}</span>.{" "}
        <button
          type="button"
          onClick={onChangeNumber}
          disabled={submitting}
          className="font-semibold text-[var(--ishtari-red)] hover:underline disabled:opacity-60"
        >
          Change number
        </button>
      </p>

      <div>
        <label htmlFor="otp-code" className="block text-sm font-medium text-gray-700">
          Verification code
        </label>
        <input
          ref={inputRef}
          id="otp-code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          value={code}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="123456"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 text-center text-lg tracking-[0.5em] outline-none focus:border-[var(--ishtari-red)]"
          readOnly={submitting}
          aria-describedby={error ? "otp-error" : undefined}
          required
          autoFocus
        />
      </div>

      {error && (
        <p id="otp-error" role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {info && (
        <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || code.length !== 6}
        className="w-full rounded-md bg-[var(--ishtari-red)] py-3 text-sm font-bold text-white hover:bg-[var(--ishtari-red-dark)] disabled:opacity-60"
      >
        {submitting ? "Verifying…" : submitLabel}
      </button>

      <p className="text-center text-sm text-[var(--muted)]">
        Didn&apos;t get it?{" "}
        <button
          type="button"
          onClick={() => void handleResend()}
          disabled={resendIn > 0 || resending || submitting}
          className="font-semibold text-[var(--ishtari-red)] hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
        >
          {resending ? "Sending…" : resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
        </button>
      </p>
    </form>
  );
}
