"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { loginUser, registerUser, updateUser, type SessionUser } from "@/lib/api";
import { SESSION_STORAGE_KEY } from "@/lib/auth";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

type UpdatePayload = {
  name: string;
  phone?: string;
  password?: string;
};

type AuthResult = {
  ok: boolean;
  message: string;
};

type AuthContextValue = {
  user: SessionUser | null;
  hydrated: boolean;
  login: (payload: LoginPayload) => Promise<AuthResult>;
  register: (payload: RegisterPayload) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (payload: UpdatePayload) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readSessionUser(): SessionUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(readSessionUser());
    setHydrated(true);
  }, []);

  function persistUser(nextUser: SessionUser | null) {
    setUser(nextUser);
    if (nextUser) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      hydrated,
      login: async ({ email, password }) => {
        try {
          const result = await loginUser({ email, password });
          persistUser(result.user);
          return { ok: true, message: result.message };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Не удалось выполнить вход.",
          };
        }
      },
      register: async ({ name, email, phone, password }) => {
        try {
          const result = await registerUser({ name, email, phone, password });
          persistUser(result.user);
          return { ok: true, message: result.message };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Не удалось создать аккаунт.",
          };
        }
      },
      logout: () => {
        persistUser(null);
      },
      updateProfile: async ({ name, phone, password }) => {
        if (!user) {
          return { ok: false, message: "Сначала войдите в аккаунт." };
        }

        try {
          const result = await updateUser(user.id, { name, phone, password });
          persistUser(result.user);
          return { ok: true, message: result.message };
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : "Не удалось обновить профиль.",
          };
        }
      },
    }),
    [hydrated, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
