"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  Wallet,
  Repeat,
  Tags,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "", label: "داشبورد", icon: Home },
  { href: "/accounts", label: "حساب‌ها", icon: Wallet },
  { href: "/transactions", label: "تراکنش‌ها", icon: Repeat },
  { href: "/categories", label: "دسته‌بندی‌ها", icon: Tags },
  { href: "/settings", label: "تنظیمات", icon: Settings },
];

type SidebarProps = {
  collapsed: boolean;
  isRtl: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
};

export function Sidebar({
  collapsed,
  isRtl,
  onToggleCollapse,
  onLogout,
}: SidebarProps) {
  const locale = useLocale();
  const pathname = usePathname();

  const normalizedPath = useMemo(
    () => pathname.replace(/\/$/, ""),
    [pathname]
  );

  const CollapseIcon =
    isRtl
      ? collapsed
        ? ChevronLeft
        : ChevronRight
      : collapsed
        ? ChevronRight
        : ChevronLeft;

  return (
    <aside
      className={`shrink-0 bg-emerald-700 text-white flex flex-col p-3 gap-3 transition-all duration-300
      ${collapsed ? "w-16" : "w-64"}`}
    >
      <div className="flex items-center justify-between mb-1">
        {!collapsed && (
          <h2 className="text-lg font-extrabold whitespace-nowrap">
            💰 حساب من
          </h2>
        )}

        <button
          aria-label="Toggle sidebar"
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-500 transition"
        >
          <CollapseIcon className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const href = `/${locale}${item.href}`;
          const isRoot = item.href === "";

          const normalizedHref = href.replace(/\/$/, "");

          const isActive = isRoot
            ? normalizedPath === normalizedHref
            : normalizedPath === normalizedHref ||
              normalizedPath.startsWith(normalizedHref + "/");

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 transition text-sm font-medium group ${
                isActive
                  ? "bg-white text-emerald-700 font-bold"
                  : "hover:bg-emerald-600"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-2 border-t border-emerald-600">
        <button
          onClick={onLogout}
          aria-label="Logout"
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 transition text-sm font-bold bg-red-500 hover:bg-red-600"
          title={collapsed ? "خروج" : undefined}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>خروج</span>}
        </button>
      </div>
    </aside>
  );
}
