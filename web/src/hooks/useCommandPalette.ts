"use client";

import { useEffect } from "react";

export function useCommandPalette(open: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      const isCmdK =
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "k";

      if (isCmdK) {
        e.preventDefault();
        open();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);
}
