"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    if (loading) return;

    if (user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) return null;

  if (user) return null;

  return <>{children}</>;
}
