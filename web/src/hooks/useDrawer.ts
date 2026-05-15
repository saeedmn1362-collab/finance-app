"use client";

import { useEffect } from "react";

export function useDrawer(isOpen: boolean, close: () => void) {
  // ESC close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    if (isOpen) {
      window.addEventListener("keydown", handler);
    }

    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);
}
