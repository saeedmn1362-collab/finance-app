"use client";

import { useEffect } from "react";

import { useAuthUser } from "@/hooks/useAuthUser";

import { useCommandRegistry } from "@/context/CommandRegistry";

export default function AuthBootstrap() {
  const { user, loading } =
    useAuthUser();

  const { setContext } =
    useCommandRegistry();

  useEffect(() => {
    // تا auth resolve نشده context را reset نکن
    if (loading) return;

    if (user) {
      setContext({
        auth: {
          user: {
            userId: user.id,
            role: "user",
            permissions: [],
          },
        },
      });
    } else {
      setContext({
        auth: {
          user: null,
        },
      });
    }
  }, [user, loading, setContext]);

  return null;
}