"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function ProfileMenu({
  onLogout,
  onClose,
}: {
  onLogout: () => void;
  onClose: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations("navbar");

  return (
    <div
      role="menu"
      className={`absolute top-11 ${
        locale === "fa" ? "left-0" : "right-0"
      } w-52 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden`}
    >
      {/* User info */}
      <div className="px-4 py-3 border-b dark:border-gray-700">
        <p className="text-sm font-bold text-gray-800 dark:text-white">
          {t("user")}
        </p>
        <p className="text-xs text-gray-400 truncate">
          user@example.com
        </p>
      </div>

      {/* Profile */}
      <Link
        href={`/${locale}/settings`}
        role="menuitem"
        onClick={onClose}
        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        👤 <span>{t("profile")}</span>
      </Link>

      {/* Settings */}
      <Link
        href={`/${locale}/settings`}
        role="menuitem"
        onClick={onClose}
        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        ⚙️ <span>{t("settings")}</span>
      </Link>

      {/* Logout */}
      <button
        onClick={onLogout}
        role="menuitem"
        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition"
      >
        🚪 <span>{t("logout")}</span>
      </button>
    </div>
  );
}