"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { parseFieldErrors } from "@/lib/utils/apiErrors";
import { cleanPhoneInput, isValidGhanaPhone } from "@/lib/utils/phone";

type RegisterFormProps = {
  /** Prefills the phone number (e.g. from `/register?phone=…`). */
  initialPhone?: string;
};

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  password2: string;
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

const MIN_PASSWORD_LENGTH = 8;
const NEED_CONTACT = "Enter an email or a phone number.";

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[var(--ishtari-red)]";

export function RegisterForm({ initialPhone = "" }: RegisterFormProps) {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: initialPhone,
    password: "",
    password2: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!form.first_name.trim()) errors.first_name = "Enter your first name.";
    if (!form.last_name.trim()) errors.last_name = "Enter your last name.";
    const email = form.email.trim();
    const phone = cleanPhoneInput(form.phone_number);
    if (!email && !phone) {
      errors.email = NEED_CONTACT;
    }
    if (phone && !isValidGhanaPhone(phone)) {
      errors.phone_number = "Enter a valid Ghana mobile number, e.g. 024 123 4567.";
    }
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    } else if (form.password !== form.password2) {
      errors.password2 = "Passwords do not match.";
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      const email = form.email.trim();
      const phone = cleanPhoneInput(form.phone_number);
      await register({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        password: form.password,
        ...(email ? { email } : {}),
        ...(phone ? { phone_number: phone } : {}),
      });
      router.push("/profile");
      router.refresh();
    } catch (err) {
      const { fields, top } = parseFieldErrors(
        err,
        ["first_name", "last_name", "email", "phone_number", "password"] as const,
        "Registration failed",
      );
      setFieldErrors(fields);
      setError(top);
    } finally {
      setSubmitting(false);
    }
  }

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      // The "email or phone" message sits under email but is fixed by either field.
      if (field === "phone_number" && next.email === NEED_CONTACT) delete next.email;
      return next;
    });
  }

  function renderField(
    name: keyof FormState,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement>,
    help?: string,
  ) {
    const fieldError = fieldErrors[name];
    const describedBy = [help ? `${name}-help` : null, fieldError ? `${name}-error` : null]
      .filter(Boolean)
      .join(" ");
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          id={name}
          name={name}
          value={form[name]}
          onChange={(e) => update(name, e.target.value)}
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={inputClass}
          {...props}
        />
        {help && (
          <p id={`${name}-help`} className="mt-1 text-xs text-[var(--muted)]">
            {help}
          </p>
        )}
        {fieldError && (
          <p id={`${name}-error`} className="mt-1 text-sm text-red-700">
            {fieldError}
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-8 pb-24 md:pb-8">
      <div className="rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm">
        <h1 className="text-center text-xl font-bold text-gray-900">Create Account</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {error && (
            <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {renderField("first_name", "First name", { autoComplete: "given-name", required: true })}
          {renderField("last_name", "Last name", { autoComplete: "family-name", required: true })}

          <p className="text-xs text-[var(--muted)]">
            Add an email to sign in with your password, or a phone number to sign in with an SMS
            code — or both.
          </p>

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
          {renderField(
            "password",
            "Password",
            { type: "password", autoComplete: "new-password", minLength: MIN_PASSWORD_LENGTH, required: true },
            `At least ${MIN_PASSWORD_LENGTH} characters.`,
          )}
          {renderField("password2", "Confirm password", {
            type: "password",
            autoComplete: "new-password",
            required: true,
          })}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-[var(--ishtari-red)] py-3 text-sm font-bold text-white hover:bg-[var(--ishtari-red-dark)] disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
          <p className="text-center text-xs text-[var(--muted)]">
            By creating an account you agree to our{" "}
            <Link href="/privacy" className="font-medium text-[var(--ishtari-red)] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
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
