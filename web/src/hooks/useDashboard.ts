"use client";

import { useQuery } from "@tanstack/react-query";

import { getDashboard } from "@/services/dashboard.service";
import { auth } from "@/lib/auth.helper";

export function useDashboard() {
  const token = auth.getToken();

  return useQuery({
    queryKey: ["dashboard"],

    queryFn: () => getDashboard(),

    enabled: !!token,

    staleTime: 1000 * 60,
  });
}