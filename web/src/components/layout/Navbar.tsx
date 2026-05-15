"use client";

import { Menu } from "lucide-react";

type NavbarProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenDrawer: () => void;
};

export default function Navbar({
  sidebarCollapsed,
  onToggleSidebar,
  onOpenDrawer,
}: NavbarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white/80 backdrop-blur dark:bg-gray-900/80 transition-all">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={onOpenDrawer}
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="font-semibold text-sm md:text-base">
          داشبورد
        </span>
      </div>

      <div className="text-xs text-gray-500">
        {sidebarCollapsed ? "Sidebar: Collapsed" : "Sidebar: Expanded"}
      </div>
    </header>
  );
}
