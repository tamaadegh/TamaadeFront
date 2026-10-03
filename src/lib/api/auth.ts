import { apiClient } from "./client";
import type {
  AuthTokens,
  LoginCredentials,
  OtpRequestPayload,
  OtpRequestResponse,
  OtpVerifyPayload,
  OtpVerifyResponse,
  RegisterPayload,
  RegisterResponse,
  UpdateUserPayload,
  User,
} from "@/types";

const TOKEN_KEY = "tamaade-access-token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function storeToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function login(credentials: LoginCredentials): Promise<AuthTokens> {
  const data = await apiClient<AuthTokens & { user?: User }>("/api/user/login/", {
    method: "POST",
    body: credentials,
    credentials: "include",
  });
  const token = data.access ?? data.access_token;
  if (token) storeToken(token);
  return data;
}

/**
 * Send a one-time login code by SMS. 400 → invalid number, 404 `code: "not_registered"`,
 * 429 `{ retry_after }`, 503 → SMS unavailable.
 */
export async function requestOtp(payload: OtpRequestPayload): Promise<OtpRequestResponse> {
  return apiClient<OtpRequestResponse>("/api/user/otp/request/", {
    method: "POST",
    body: payload,
    credentials: "include",
  });
}

/** Verify a phone login code (200 `{ access, refresh, user }`); the access token is stored like the email login. */
export async function verifyOtp(payload: OtpVerifyPayload): Promise<OtpVerifyResponse> {
  const data = await apiClient<OtpVerifyResponse>("/api/user/otp/verify/", {
    method: "POST",
    body: payload,
    credentials: "include",
  });
  if (data.access) storeToken(data.access);
  return data;
}

/**
 * Create an account and sign in (201 `{ access, refresh, user }`); the token is stored like login.
 * Empty optional fields are omitted. 400 → `{ detail, errors: { email, phone_number, password, non_field_errors } }`.
 */
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const email = payload.email?.trim();
  const phone = payload.phone_number?.trim();
  const data = await apiClient<RegisterResponse>("/api/user/register/", {
    method: "POST",
    body: {
      first_name: payload.first_name,
      last_name: payload.last_name,
      password: payload.password,
      ...(email ? { email } : {}),
      ...(phone ? { phone_number: phone } : {}),
    },
    credentials: "include",
  });
  if (data.access) storeToken(data.access);
  return data;
}

export async function getCurrentUser(): Promise<User> {
  const token = getStoredToken();
  return apiClient<User>("/api/user/", {
    token: token ?? undefined,
    credentials: "include",
  });
}

export async function logout(): Promise<void> {
  try {
    await apiClient<void>("/logout/", {
      method: "POST",
      credentials: "include",
      token: getStoredToken() ?? undefined,
    });
  } finally {
    clearStoredToken();
  }
}

/**
 * Update name / contact details (`PATCH /api/user/`); returns the updated user.
 * 400 → `{ detail, errors: { email, phone_number, first_name, ... } }`.
 */
export async function updateUser(payload: UpdateUserPayload): Promise<User> {
  return apiClient<User>("/api/user/", {
    method: "PATCH",
    body: payload,
    credentials: "include",
    token: getStoredToken() ?? undefined,
  });
}

/** Avatar / bio (`/api/user/profile/`). For name and contact details use `updateUser`. */
export async function updateProfile(payload: Partial<User>): Promise<User> {
  const token = getStoredToken();
  return apiClient<User>("/api/user/profile/", {
    method: "PATCH",
    body: payload,
    credentials: "include",
    token: token ?? undefined,
  });
}

/**
 * Permanently delete the signed-in account (password confirmation required).
 * 200 → `{ detail }`, 400 → incorrect password, 403 → staff accounts can't self-delete.
 * The stored token is cleared on success.
 */
export async function deleteAccount(password: string): Promise<{ detail?: string }> {
  const data = await apiClient<{ detail?: string }>("/api/user/delete-account/", {
    method: "POST",
    body: { password },
    credentials: "include",
    token: getStoredToken() ?? undefined,
  });
  clearStoredToken();
  return data;
}
