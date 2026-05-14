"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  ReactNode,
  useState,
} from "react";

export default function QueryProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [queryClient] = useState(
    () =>
      new QueryClient({

        defaultOptions: {

          queries: {

            // =========================
            // 🔁 Retry Logic
            // =========================
            retry(failureCount, error: any) {

              // ❌ Don't retry auth errors
              if (error?.status === 401) {
                return false;
              }

              return failureCount < 2;
            },

            // =========================
            // ⚡ Cache
            // =========================
            staleTime: 1000 * 60,

            // =========================
            // 🚫 Refetch
            // =========================
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}