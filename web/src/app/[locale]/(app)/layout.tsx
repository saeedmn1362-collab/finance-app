"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const navItems = [
  { href: "", label: "داشبورد" },
  { href: "/accounts", label: "حساب‌ها" },
  { href: "/transactions", label: "تراکنش‌ها" },
  { href: "/categories", label: "دسته‌بندی‌ها" },
  { href: "/settings", label: "تنظیمات" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const checked = useAuthGuard(`/${locale}/login`);

  if (checked === null) {
    return <div className="p-10">Loading...</div>;
  }

  if (checked === false) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace(`/${locale}/login`);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen" dir={locale === "fa" ? "rtl" : "ltr"}>
      <aside className="w-64 bg-emerald-700 text-white flex flex-col p-6 gap-4">
        <h2 className="text-2xl font-extrabold mb-6">💰 حساب من</h2>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const href = `/${locale}${item.href}`;
            const isActive =
              pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={item.href}
                href={href}
                className={`rounded-xl px-4 py-2 transition font-medium ${
                  isActive
                    ? "bg-white text-emerald-700 font-bold"
                    : "hover:bg-emerald-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 rounded-xl px-4 py-2 transition text-white font-bold"
          >
            خروج
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-8">
        {children}
      </main>
    </div>
  );
}