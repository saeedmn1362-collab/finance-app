"use client";

import type { ReactNode } from "react";

import { Sidebar } from "@/components/layout/Sidebar";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuthContext } from "@/context/AuthContext";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const router = useRouter();
  const { logout } = useAuthContext();

  const [collapsed, setCollapsed] = useState(false);

  const isRtl = locale === "fa";

  const handleLogout = async () => {
    await logout(); // ← کوکی پاک می‌شود
    router.replace(`/${locale}/login`);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        collapsed={collapsed}
        isRtl={isRtl}
        onToggleCollapse={() => setCollapsed((p) => !p)}
        onLogout={handleLogout}
      />

      <main className="flex-1">{children}</main>
    </div>
  );
}
