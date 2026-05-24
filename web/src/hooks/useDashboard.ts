"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/services/dashboard.service";
import { useAuthContext } from "@/context/AuthContext";

export function useDashboard() {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboard(),
    enabled: !!user,
    staleTime: 1000 * 60,
  });
}
