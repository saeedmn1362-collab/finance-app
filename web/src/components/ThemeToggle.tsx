"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    const isDark = saved === "dark";

    document.documentElement.classList.toggle("dark", isDark);

    setDark(isDark);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const newDark = !dark;

    document.documentElement.classList.toggle("dark", newDark);

    localStorage.setItem(
      "theme",
      newDark ? "dark" : "light"
    );

    setDark(newDark);
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl border border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-800
                 text-gray-700 dark:text-white
                 hover:bg-gray-100 dark:hover:bg-gray-700
                 transition"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}