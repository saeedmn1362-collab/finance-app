"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // استخراج locale از URL (استاندارد next-intl)
  const locale = typeof window !== "undefined"
    ? window.location.pathname.split("/")[1]
    : "fa";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace(`/${locale}`);
    } else {
      setCheckingAuth(false);
    }
  }, [router, locale]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
          {t("checking")}
        </div>
      </div>
    );
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    if (!email.trim() || !password.trim()) {
      setError(t("fill_all_fields"));
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError(t("invalid_email"));
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const token = res.data?.data?.token || res.data?.token;

      if (!token) throw new Error("no token");

      localStorage.setItem("token", token);

      router.replace(`/${locale}`);
    } catch (err: any) {
      setError(
        err?.data?.message ||
        err?.message ||
        t("login_failed")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen flex items-center justify-center 
                 bg-gradient-to-br from-emerald-50 via-white to-green-100 
                 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 
                 p-4 transition-colors"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-emerald-100 
                   dark:border-gray-700 bg-white dark:bg-gray-800 
                   p-8 shadow-2xl transition-colors"
      >
        <div className="mb-8 text-center">
          <div className="mb-3 text-6xl">💰</div>

          <h1 className="text-3xl font-black text-gray-800 dark:text-white">
            {t("login_title")}
          </h1>

          <p className="mt-2 text-sm text-gray-400 dark:text-gray-300">
            {t("login_subtitle")}
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-3 text-center text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-600 dark:text-gray-300">
              {t("email")}
            </label>

            <input
              type="email"
              value={email}
              autoComplete="email"
              placeholder="example@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 
                         bg-white dark:bg-gray-700 
                         text-gray-800 dark:text-white 
                         p-3 outline-none transition focus:ring-4 focus:ring-emerald-100 dark:focus:ring-gray-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-600 dark:text-gray-300">
              {t("password")}
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                autoComplete="current-password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-600 
                           bg-white dark:bg-gray-700 
                           text-gray-800 dark:text-white 
                           p-3 outline-none transition focus:ring-4 focus:ring-emerald-100 dark:focus:ring-gray-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm 
                           text-gray-400 dark:text-gray-300 
                           hover:text-gray-700 dark:hover:text-gray-200"
              >
                {showPassword ? "مخفی" : "نمایش"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-500 dark:bg-emerald-600 
                       py-3 text-lg font-black text-white shadow-lg 
                       transition hover:bg-emerald-600 active:scale-[0.98] 
                       disabled:opacity-50"
          >
            {loading ? t("loading") : t("login")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
          {t("no_account")}
          <Link
            href={`/${locale}/register`}
            className="mr-1 font-bold text-emerald-600 hover:underline"
          >
            {t("register")}
          </Link>
        </div>
      </div>
    </main>
  );
}