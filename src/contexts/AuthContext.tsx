"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError } from "@/lib/api/client";
import {
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  clearStoredToken,
  getStoredToken,
} from "@/lib/api/auth";
import type { LoginCredentials, User } from "@/types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const current = await getCurrentUser();
      setUser(current);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearStoredToken();
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    async function init() {
      if (!getStoredToken()) {
        setLoading(false);
        return;
      }
      await refreshUser();
      setLoading(false);
    }
    void init();
  }, [refreshUser]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      await apiLogin(credentials);
      await refreshUser();
    },
    [refreshUser],
  );

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, refreshUser }),
    [user, loading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
