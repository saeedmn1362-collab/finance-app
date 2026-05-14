"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {

  const router = useRouter();

  // =========================
  // 🎯 States
  // =========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // 🔐 Check Existing Login
  // =========================
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/");
    } else {
      setCheckingAuth(false);
    }

  }, [router]);

  // =========================
  // ⏳ Prevent Flicker
  // =========================
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="text-lg font-bold text-emerald-600 animate-pulse">
          در حال بررسی ورود...
        </div>
      </div>
    );
  }

  // =========================
  // 🚀 Login Handler
  // =========================
  async function handleLogin(e: React.FormEvent) {

    e.preventDefault();

    if (loading) return;

    // =========================
    // ✅ Empty Validation
    // =========================
    if (!email.trim() || !password.trim()) {
      setError("لطفاً همه فیلدها را پر کنید");
      return;
    }

    // =========================
    // ✅ Email Validation
    // =========================
    if (
      !email.includes("@") ||
      !email.includes(".")
    ) {
      setError("ایمیل معتبر نیست");
      return;
    }

    try {

      setLoading(true);
      setError("");

      // =========================
      // 🚀 Login Request
      // =========================
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      // =========================
      // 🔐 Extract Token
      // =========================
      const token =
        res.data?.data?.token ||
        res.data?.token;

      if (!token) {
        throw new Error("توکن دریافت نشد");
      }

      // =========================
      // 💾 Save Token
      // =========================
      localStorage.setItem("token", token);

      // =========================
      // 🚀 Redirect
      // =========================
      router.replace("/");

    } catch (err: any) {

      // =========================
      // ❌ Error Handling
      // =========================
      setError(
        err?.message ||
        err?.data?.message ||
        "ورود ناموفق بود"
      );

    } finally {

      setLoading(false);

    }
  }

  // =========================
  // 🎨 UI
  // =========================
  return (
    <main
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-100 p-4"
    >

      <div className="w-full max-w-md rounded-3xl border border-emerald-100 bg-white p-8 shadow-2xl">

        {/* ========================= */}
        {/* 🏷 Header */}
        {/* ========================= */}
        <div className="mb-8 text-center">

          <div className="mb-3 text-6xl">
            💰
          </div>

          <h1 className="text-3xl font-black text-gray-800">
            حساب من
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            مدیریت مالی حرفه‌ای
          </p>

        </div>

        {/* ========================= */}
        {/* ❌ Error */}
        {/* ========================= */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ========================= */}
        {/* 📝 Form */}
        {/* ========================= */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* ========================= */}
          {/* 📧 Email */}
          {/* ========================= */}
          <div>

            <label className="mb-2 block text-sm font-bold text-gray-600">
              ایمیل
            </label>

            <input
              type="email"
              value={email}
              autoComplete="email"
              placeholder="example@mail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 p-3 text-gray-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />

          </div>

          {/* ========================= */}
          {/* 🔑 Password */}
          {/* ========================= */}
          <div>

            <label className="mb-2 block text-sm font-bold text-gray-600">
              رمز عبور
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                autoComplete="current-password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 p-3 text-gray-800 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition hover:text-gray-700"
              >
                {showPassword ? "مخفی" : "نمایش"}
              </button>

            </div>

          </div>

          {/* ========================= */}
          {/* 🚀 Submit */}
          {/* ========================= */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-500 py-3 text-lg font-black text-white shadow-lg transition hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>

        </form>

        {/* ========================= */}
        {/* 🔗 Register */}
        {/* ========================= */}
        <div className="mt-6 text-center text-sm text-gray-500">

          حساب ندارید؟

          <Link
            href="/register"
            className="mr-1 font-bold text-emerald-600 hover:underline"
          >
            ثبت‌نام
          </Link>

        </div>

      </div>
    </main>
  );
}