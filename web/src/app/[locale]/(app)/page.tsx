"use client";

import { useMemo } from "react";

import { useTranslations, useLocale } from "next-intl";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useDashboard } from "@/hooks/useDashboard";
import { useRegisterCommands } from "@/hooks/useRegisterCommands";

import type { Command } from "@/context/CommandRegistry";

export default function HomePage() {
  const locale = useLocale();

  const checked = useAuthGuard(`/${locale}/login`);

  const t = useTranslations();

  const { data, isLoading, error } = useDashboard();

  // ✅ COMMANDS MEMOIZED
  const commands = useMemo<Command[]>(
    () => [
      {
        id: "refresh-dashboard",
        label: "Refresh Dashboard",
        keywords: ["reload", "refresh"],
        group: "Dashboard",
        priority: 90,
        action: () => {
          window.location.reload();
        },
      },
    ],
    []
  );

  useRegisterCommands(commands);

  if (!checked) return null;

  if (isLoading) {
    return (
      <main className="p-10">
        <h1>{t("loading")}</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-10">
        <h1 className="text-red-500">
          Error loading dashboard
        </h1>
      </main>
    );
  }

  return (
    <main className="p-10 space-y-6">
      <h1 className="text-4xl font-bold">
        Finance Dashboard 🚀
      </h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-xl p-5">
          <h2 className="text-gray-500">
            {t("total_balance")}
          </h2>

          <p className="text-3xl font-bold">
            ${data?.totalBalance}
          </p>
        </div>

        <div className="border rounded-xl p-5">
          <h2 className="text-gray-500">
            {t("income")}
          </h2>

          <p className="text-3xl font-bold">
            ${data?.incomeThisMonth}
          </p>
        </div>

        <div className="border rounded-xl p-5">
          <h2 className="text-gray-500">
            {t("expense")}
          </h2>

          <p className="text-3xl font-bold">
            ${data?.expenseThisMonth}
          </p>
        </div>

        <div className="border rounded-xl p-5">
          <h2 className="text-gray-500">
            {t("accounts")}
          </h2>

          <p className="text-3xl font-bold">
            {data?.accounts?.length || 0}
          </p>
        </div>
      </div>
    </main>
  );
}