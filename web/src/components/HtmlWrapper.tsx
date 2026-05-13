"use client";

import { useEffect } from "react";

export default function HtmlWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return <>{children}</>;
}
