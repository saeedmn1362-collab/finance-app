"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export function useGuestGuard(redirectTo: string) {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (loading) return; // تا وقتی auth معلوم نشده، هیچ redirect نکن

    if (user) {
      router.replace(redirectTo);
    }
  }, [user, loading, redirectTo, router]);

  return !loading && !user;
}
