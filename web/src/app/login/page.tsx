"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      const token = res.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        router.replace("/");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      setError(message);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Finance App</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-300 text-white p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <button
            disabled={loading}
            className="w-full mt-4 bg-white text-emerald-700 font-semibold py-2 rounded-lg hover:bg-emerald-50 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <a href="/register" className="underline font-bold">
            Register
          </a>
        </p>
      </div>
    </main>
  );
}