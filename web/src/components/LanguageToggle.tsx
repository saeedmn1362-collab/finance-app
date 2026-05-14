"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();

  const newLocale = locale === "fa" ? "en" : "fa";

  const newPath = `/${newLocale}${pathname.replace(/^\/(fa|en)/, "")}`;

  return (
    <Link
      href={newPath}
      className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-800
                 text-sm font-bold
                 text-gray-700 dark:text-white
                 hover:bg-gray-100 dark:hover:bg-gray-700
                 transition"
    >
      {locale === "fa" ? "EN" : "FA"}
    </Link>
  );
}