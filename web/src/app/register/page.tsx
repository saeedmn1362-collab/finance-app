"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      router.replace("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";

      setError(message);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center 
      bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4">

      <ThemeToggle />

      <div className="
        bg-gradient-to-br 
        from-green-200 to-green-400 
        dark:from-green-900 dark:to-green-700
        shadow-lg rounded-3xl p-10 w-full max-w-md
        text-gray-800 dark:text-gray-100
        transition-colors duration-300
      ">
        <h1 className="text-4xl font-extrabold text-center mb-8 tracking-wide">
          Create Account
        </h1>

        {error && (
          <div className="
            bg-red-500/20 border border-red-300 
            dark:border-red-400 dark:text-red-200 
            text-red-700 p-3 rounded-md mb-4 text-center
          ">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block mb-1 text-lg">Full Name</label>
            <input
              className="
                w-full p-3 rounded-xl text-black dark:text-white text-lg
                bg-white dark:bg-gray-800
                border border-gray-300 dark:border-gray-600
                focus:border-green-500 focus:ring-2 focus:ring-green-300
                transition
              "
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-lg">Email</label>
            <input
              className="
                w-full p-3 rounded-xl text-black dark:text-white text-lg
                bg-white dark:bg-gray-800
                border border-gray-300 dark:border-gray-600
                focus:border-green-500 focus:ring-2 focus:ring-green-300
                transition
              "
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-lg">Password</label>
            <input
              type="password"
              className="
                w-full p-3 rounded-xl text-black dark:text-white text-lg
                bg-white dark:bg-gray-800
                border border-gray-300 dark:border-gray-600
                focus:border-green-500 focus:ring-2 focus:ring-green-300
                transition
              "
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="
              w-full py-3 rounded-xl font-bold text-xl
              bg-white text-green-700
              shadow-md active:shadow-inner
              active:scale-95 transition-transform
              disabled:opacity-50
            "
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </main>
  );
}
