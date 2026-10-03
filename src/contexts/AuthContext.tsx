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
  deleteAccount as apiDeleteAccount,
  verifyOtp as apiVerifyOtp,
  register as apiRegister,
  updateUser as apiUpdateUser,
  clearStoredToken,
  getStoredToken,
} from "@/lib/api/auth";
import type {
  LoginCredentials,
  OtpVerifyPayload,
  RegisterPayload,
  UpdateUserPayload,
  User,
} from "@/types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Verifies an SMS login code, stores the token and loads the user. */
  loginWithOtp: (payload: OtpVerifyPayload) => Promise<void>;
  /** Creates the account and signs in (token stored like login). */
  register: (payload: RegisterPayload) => Promise<void>;
  /** Saves name / contact details and replaces the user with the server's copy. */
  updateUser: (payload: UpdateUserPayload) => Promise<User>;
  logout: () => Promise<void>;
  /** Permanently deletes the account; on success the session is cleared (cart resets with it). */
  deleteAccount: (password: string) => Promise<string | undefined>;
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

  const loginWithOtp = useCallback(
    async (payload: OtpVerifyPayload) => {
      const data = await apiVerifyOtp(payload);
      if (data.user) setUser(data.user);
      await refreshUser();
    },
    [refreshUser],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const data = await apiRegister(payload);
      if (data.user) setUser(data.user);
      await refreshUser();
    },
    [refreshUser],
  );

  const updateUser = useCallback(async (payload: UpdateUserPayload) => {
    const updated = await apiUpdateUser(payload);
    setUser(updated);
    return updated;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const deleteAccount = useCallback(async (password: string) => {
    const result = await apiDeleteAccount(password);
    setUser(null);
    return result?.detail;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      loginWithOtp,
      register,
      updateUser,
      logout,
      deleteAccount,
      refreshUser,
    }),
    [user, loading, login, loginWithOtp, register, updateUser, logout, deleteAccount, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
