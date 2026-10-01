"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError, getApiErrorMessage } from "@/lib/api/client";
import { setFlashMessage } from "@/lib/utils/flash";

/** "Danger zone" card with a password-confirmed account deletion dialog. Render only for signed-in users. */
export function DeleteAccountSection() {
  const { deleteAccount } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, submitting]);

  function close() {
    if (submitting) return;
    setOpen(false);
    setPassword("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const detail = await deleteAccount(password);
      setFlashMessage(detail || "Your account has been deleted.");
      router.push("/");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError(getApiErrorMessage(err, "This account can't be deleted here. Please contact support."));
      } else if (err instanceof ApiError && err.status === 401) {
        setError("Your session has expired. Please log in again and retry.");
      } else {
        setError(getApiErrorMessage(err, "Could not delete your account. Please try again."));
      }
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="mt-4 rounded-lg border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-red-700">Delete account</h2>
        <p className="mt-2 text-sm text-gray-700">
          Permanently delete your Tamaade account and personal data. This can&apos;t be undone.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 w-full rounded-md bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700"
        >
          Delete account
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <button type="button" className="absolute inset-0 cursor-default" onClick={close} aria-label="Close dialog" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h2 id="delete-account-title" className="text-lg font-bold text-gray-900">
                Delete your account?
              </h2>
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <p>This permanently erases your personal data:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Your name, email address and phone number</li>
                <li>Your saved addresses</li>
                <li>Your basket / cart</li>
              </ul>
              <p>
                Paid orders are kept for accounting and legal reasons, but they are anonymised and no
                longer linked to you. This action can&apos;t be undone.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label htmlFor="delete-password" className="block text-sm font-medium text-gray-700">
                  Enter your password to confirm
                </label>
                <input
                  id="delete-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-red-500"
                  required
                  autoFocus
                />
              </div>

              {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={close}
                  disabled={submitting}
                  className="flex-1 rounded-md border border-gray-300 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !password}
                  className="flex-1 rounded-md bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {submitting ? "Deleting…" : "Delete my account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
