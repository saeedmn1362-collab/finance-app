"use client";

import { useEffect, useState, Suspense } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import MobileDrawer from "@/components/layout/MobileDrawer";
import PageTransition from "@/components/transition/PageTransition";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { useLogout } from "@/hooks/useLogout";
import { useDrawer } from "@/hooks/useDrawer";
import { isRTL } from "@/lib/isRTL";

import CommandPalette from "@/components/command/CommandPalette";
import { useCommandPalette } from "@/hooks/useCommandPalette";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const logout = useLogout();

  const [status, setStatus] =
    useState<"loading" | "auth" | "unauth">("loading");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const rtl = isRTL(locale);

  // AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus("unauth");
      router.replace(`/${locale}/login`);
      return;
    }

    setStatus("auth");
  }, [locale, router]);

  // CLOSE DRAWER ON ROUTE CHANGE
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // CLOSE COMMAND PALETTE ON ROUTE CHANGE
  useEffect(() => {
    setCommandOpen(false);
  }, [pathname]);

  // Drawer Pro Hook (ESC + scroll lock)
  useDrawer(drawerOpen, () => setDrawerOpen(false));

  // Command Palette Hotkey (Ctrl + K)
  useCommandPalette(() => {
    setDrawerOpen(false);
    setCommandOpen(true);
  });

  if (status === "unauth") return null;

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      className={`flex min-h-screen ${rtl ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          isRtl={rtl}
          onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
          onLogout={logout}
        />
      </div>

      {/* Mobile Drawer Pro */}
      <MobileDrawer
        open={drawerOpen}
        rtl={rtl}
        onClose={() => setDrawerOpen(false)}
        logout={logout}
      />

      {/* MAIN */}
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((p) => !p)}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        <CommandPalette
          open={commandOpen}
          onClose={() => setCommandOpen(false)}
        />

        <main className="flex-1 min-w-0 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6 md:p-8">
          {status === "loading" ? (
            <DashboardSkeleton />
          ) : (
            <Suspense fallback={<DashboardSkeleton />}>
              <PageTransition>{children}</PageTransition>
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
}
