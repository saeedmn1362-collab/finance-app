"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth.helper";

export function useAuthGuard(redirectTo: string) {
  const router = useRouter();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = auth.getToken();

    if (!token) {
      router.replace(redirectTo);
      return;
    }

    const timeout = setTimeout(() => {
      setChecked(true);
    }, 50);

    return () => clearTimeout(timeout);
  }, [router, redirectTo]);

  return checked;
}