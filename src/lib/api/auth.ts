import { apiClient } from "./client";
import type { AuthTokens, LoginCredentials, RegisterPayload, User } from "@/types";

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

export async function register(payload: RegisterPayload): Promise<{ detail?: string }> {
  return apiClient<{ detail?: string }>("/api/user/register/", {
    method: "POST",
    body: payload,
    credentials: "include",
  });
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

export async function updateProfile(payload: Partial<User>): Promise<User> {
  const token = getStoredToken();
  return apiClient<User>("/api/user/profile/", {
    method: "PATCH",
    body: payload,
    credentials: "include",
    token: token ?? undefined,
  });
}
