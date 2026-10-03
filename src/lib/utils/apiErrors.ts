import { ApiError, getApiErrorMessage } from "@/lib/api/client";

function joinMessages(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value;
  if (Array.isArray(value) && value.length) return value.map(String).join(" ");
  return undefined;
}

/**
 * Splits a 400 `{ detail, errors: { field: [...], non_field_errors: [...] } }` body into
 * per-field messages (for `fields`) and a top-level message.
 */
export function parseFieldErrors<K extends string>(
  err: unknown,
  fields: readonly K[],
  fallback: string,
): { fields: Partial<Record<K, string>>; top: string | null } {
  const result: Partial<Record<K, string>> = {};
  if (!(err instanceof ApiError) || err.status !== 400) {
    return { fields: result, top: getApiErrorMessage(err, fallback) };
  }
  const data = (err.data ?? {}) as { detail?: unknown; errors?: Record<string, unknown> };
  const errors = data.errors ?? {};
  for (const key of fields) {
    const message = joinMessages(errors[key]);
    if (message) result[key] = message;
  }
  const top = [joinMessages(data.detail), joinMessages(errors.non_field_errors)]
    .filter(Boolean)
    .join(" ");
  if (top) return { fields: result, top };
  return {
    fields: result,
    top: Object.keys(result).length ? null : getApiErrorMessage(err, fallback),
  };
}
