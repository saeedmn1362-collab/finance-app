"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth.helper";

export function useGuestGuard(redirectTo: string) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "guest" | "auth">("checking");

  useEffect(() => {
    const token = auth.getToken();

    if (token) {
      setStatus("auth");
      router.replace(redirectTo);
    } else {
      setStatus("guest");
    }
  }, [router, redirectTo]);

  return status === "guest";
}
