"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/services/dashboard.service";

// =========================
// 📊 Dashboard Hook (Enterprise Version)
// =========================
export function useDashboard(params = {}) {
  return useQuery({
    queryKey: ["dashboard", params],
    queryFn: () => getDashboard(params),
    staleTime: 1000 * 60, // 1 minute cache
  });
}
