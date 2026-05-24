"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { auth } from "@/lib/auth.helper";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
};

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = auth.getToken();

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        auth.removeToken();
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { user, loading };
}