"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/auth.helper";

export function useAuth() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuth(auth.isAuthenticated());
  }, []);

  function login(token: string) {
    auth.setToken(token);
    setIsAuth(true);
  }

  function logout() {
    auth.removeToken();
    setIsAuth(false);
  }

  return {
    isAuth,
    login,
    logout,
  };
}