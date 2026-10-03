"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { parseFieldErrors } from "@/lib/utils/apiErrors";
import { cleanPhoneInput, isValidGhanaPhone } from "@/lib/utils/phone";
import type { UpdateUserPayload, User } from "@/types";

type FormState = Required<UpdateUserPayload>;
type FieldErrors = Partial<Record<keyof FormState, string>>;

const FIELD_NAMES = ["first_name", "last_name", "email", "phone_number"] as const;
const NEED_CONTACT = "Enter an email or a phone number.";

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[var(--ishtari-red)]";

function formFromUser(user: User): FormState {
  return {
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
    email: user.email ?? "",
    phone_number: user.phone_number ?? "",
  };
}

function SignInMethod({ on, label, hint }: { on: boolean; label: string; hint: string }) {
  return (
    <li className="flex items-start justify-between gap-3">
      <span>
        {label}
        {!on && <span className="block text-xs text-[var(--muted)]">{hint}</span>}
      </span>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
          on ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
        }`}
      >
        {on ? "On" : "Off"}
      </span>
    </li>
  );
}

/** Name and contact details, plus which sign-in methods they enable. Render only for signed-in users. */
export function EditDetailsSection({ user }: { user: User }) {
  const { updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState>(() => formFromUser(user));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEditing() {
    setForm(formFromUser(user));
    setFieldErrors({});
    setError(null);
    setSuccess(null);
    setEditing(true);
  }

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      if (field === "phone_number" && next.email === NEED_CONTACT) delete next.email;
      return next;
    });
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!form.first_name.trim()) errors.first_name = "Enter your first name.";
    if (!form.last_name.trim()) errors.last_name = "Enter your last name.";
    const phone = cleanPhoneInput(form.phone_number);
    if (!form.email.trim() && !phone) errors.email = NEED_CONTACT;
    if (phone && !isValidGhanaPhone(phone)) {
      errors.phone_number = "Enter a valid Ghana mobile number, e.g. 024 123 4567.";
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    const next: FormState = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone_number: cleanPhoneInput(form.phone_number),
    };
    const current = formFromUser(user);
    // Only send what changed; "" removes an email or phone.
    const payload: UpdateUserPayload = {};
    for (const key of FIELD_NAMES) {
      const changed =
        key === "phone_number"
          ? next.phone_number !== cleanPhoneInput(current.phone_number)
          : next[key] !== current[key];
      if (changed) payload[key] = next[key];
    }
    if (!Object.keys(payload).length) {
      setEditing(false);
      return;
    }

    setSaving(true);
    try {
      await updateUser(payload);
      setEditing(false);
      setSuccess("Your details have been saved.");
    } catch (err) {
      const { fields, top } = parseFieldErrors(err, FIELD_NAMES, "Could not save your details.");
      setFieldErrors(fields);
      setError(top);
    } finally {
      setSaving(false);
    }
  }

  function renderField(
    name: keyof FormState,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
  ) {
    const fieldError = fieldErrors[name];
    return (
      <div>
        <label htmlFor={`edit-${name}`} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          id={`edit-${name}`}
          name={name}
          value={form[name]}
          onChange={(e) => update(name, e.target.value)}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={fieldError ? `edit-${name}-error` : undefined}
          className={inputClass}
          {...props}
        />
        {fieldError && (
          <p id={`edit-${name}-error`} className="mt-1 text-sm text-red-700">
            {fieldError}
          </p>
        )}
      </div>
    );
  }

  const hasPhone = Boolean(user.phone_number);
  const hasEmail = Boolean(user.email);

  return (
    <div className="mt-4 rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-gray-900">My details</h2>
        {!editing && (
          <button
            type="button"
            onClick={startEditing}
            className="text-sm font-semibold text-[var(--ishtari-red)] hover:underline"
          >
            Edit my details
          </button>
        )}
      </div>

      {success && (
        <p role="status" className="mt-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {success}
        </p>
      )}

      {editing ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          {renderField("first_name", "First name", { autoComplete: "given-name", required: true })}
          {renderField("last_name", "Last name", { autoComplete: "family-name", required: true })}
          {renderField("email", "Email", {
            type: "email",
            autoComplete: "email",
            placeholder: "you@example.com",
          })}
          {renderField("phone_number", "Phone number", {
            type: "tel",
            inputMode: "tel",
            autoComplete: "tel",
            placeholder: "024 123 4567",
          })}
          <p className="text-xs text-[var(--muted)]">
            Leave a field empty to remove it. You need at least an email or a phone number.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={saving}
              className="flex-1 rounded-md border border-gray-300 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-md bg-[var(--ishtari-red)] py-3 text-sm font-bold text-white hover:bg-[var(--ishtari-red-dark)] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      ) : (
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--muted)]">Name</dt>
            <dd className="text-right text-gray-900">
              {user.first_name} {user.last_name}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--muted)]">Email</dt>
            <dd className="break-all text-right text-gray-900">{user.email || "Not set"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--muted)]">Phone</dt>
            <dd className="text-right text-gray-900">{user.phone_number || "Not set"}</dd>
          </div>
        </dl>
      )}

      <div className="mt-5 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-semibold text-gray-900">Sign-in methods</h3>
        <ul className="mt-2 space-y-2 text-sm text-gray-700">
          <SignInMethod on={hasPhone} label="Sign in with SMS code" hint="Add a phone number" />
          <SignInMethod on={hasEmail} label="Sign in with email + password" hint="Add an email" />
        </ul>
      </div>
    </div>
  );
}
