"use client";

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useContext,
} from "react";

export type UserRole = "admin" | "manager" | "user";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  permissions: string[];
  loading: boolean;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAuth = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        signal,
      });

      if (!res.ok) throw new Error("Not authenticated");

      const data = await res.json();

      setUser(data.user);
      setRole(data.user.role);
      setPermissions(data.permissions ?? []);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;

      setUser(null);
      setRole(null);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchAuth(controller.signal);
    return () => controller.abort();
  }, [fetchAuth]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
      setRole(null);
      setPermissions([]);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        permissions,
        loading,
        logout,
        refetch: () => fetchAuth(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// 🔥 این بخش مهم بود و نداشتی
// =========================
export function useAuthContext() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  }

  return ctx;
}
