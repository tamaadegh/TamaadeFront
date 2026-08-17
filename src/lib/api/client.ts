import { siteConfig } from "@/config/site";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiErrorMessage(err: unknown, fallback = "Request failed"): string {
  if (err instanceof ApiError) {
    return messageFromApiBody(err.data, err.message || fallback);
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

function messageFromApiBody(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback;
  const body = data as Record<string, unknown>;
  if (typeof body.detail === "string" && body.detail.trim()) return body.detail;
  if (Array.isArray(body.detail) && typeof body.detail[0] === "string") {
    return body.detail[0];
  }
  for (const value of Object.values(body)) {
    if (typeof value === "string" && value.trim()) return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  }
  return fallback;
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, token, headers, cache, next, credentials, ...rest } = options;

  const response = await fetch(`${siteConfig.apiUrl}${endpoint}`, {
    ...rest,
    cache,
    next,
    credentials: credentials ?? "omit",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    throw new ApiError(
      messageFromApiBody(data, `API error: ${response.statusText}`),
      response.status,
      data,
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
