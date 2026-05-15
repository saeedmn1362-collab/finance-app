"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Fuse from "fuse.js";

import { Portal } from "@/components/ui/Portal";
import { commandMenu } from "@/config/commandMenu";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CommandPalette({ open, onClose }: Props) {
  const locale = useLocale();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // =========================
  // Fuse.js Fuzzy Search
  // =========================
  const fuse = useMemo(() => {
    return new Fuse(commandMenu, {
      keys: [
        { name: "label", weight: 0.6 },
        { name: "keywords", weight: 0.3 },
        { name: "href", weight: 0.1 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
      minMatchCharLength: 2,
      includeScore: true,
    });
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return commandMenu;

    return fuse
      .search(query)
      .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
      .map((r) => r.item);
  }, [query, fuse]);

  // =========================
  // Effects
  // =========================

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  // Auto-focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Reset activeIndex on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Clamp activeIndex
  useEffect(() => {
    if (activeIndex >= filtered.length && filtered.length > 0) {
      setActiveIndex(0);
    }
  }, [filtered, activeIndex]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;

    const el = listRef.current.querySelector(
      `[data-index="${activeIndex}"]`
    ) as HTMLElement | null;

    if (el) {
      el.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  const navigate = (href: string) => {
    router.push(`/${locale}${href}`);
    onClose();
  };

  // Keyboard navigation + focus trap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Focus trap
    if (e.key === "Tab") {
      const focusable = containerRef.current?.querySelectorAll(
        "input, button"
      ) as NodeListOf<HTMLElement>;

      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    // Navigation
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev + 1 < filtered.length ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : prev
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) navigate(item.href);
    }

    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Panel */}
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="fixed left-1/2 top-[12%] z-[100] w-full max-w-xl -translate-x-1/2 rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="command-palette-title"
            >
              {/* Search */}
              <div className="flex items-center gap-3 border-b border-gray-200 px-4 h-14 dark:border-gray-800">
                <Search className="w-4 h-4 text-gray-400" />

                <input
                  ref={inputRef}
                  id="command-palette-input"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="جستجو..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  role="combobox"
                  aria-controls="command-palette-list"
                  aria-expanded="true"
                  aria-activedescendant={
                    filtered.length > 0
                      ? `command-item-${activeIndex}`
                      : undefined
                  }
                />
              </div>

              {/* Results */}
              <div
                ref={listRef}
                id="command-palette-list"
                role="listbox"
                className="max-h-[320px] overflow-y-auto p-2"
              >
                {filtered.length === 0 ? (
                  <div className="px-3 py-8 text-center text-sm text-gray-500">
                    نتیجه‌ای پیدا نشد
                  </div>
                ) : (
                  filtered.map((item, index) => {
                    const isActive = index === activeIndex;

                    return (
                      <button
                        key={item.id}
                        id={`command-item-${index}`}
                        data-index={index}
                        onClick={() => navigate(item.href)}
                        onKeyDown={handleKeyDown}
                        role="option"
                        aria-selected={isActive}
                        tabIndex={-1}
                        className={`w-full flex items-center rounded-xl px-3 py-3 text-sm transition text-right
                          ${
                            isActive
                              ? "bg-gray-100 dark:bg-gray-800 font-medium"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }
                        `}
                      >
                        {item.label}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Hint footer */}
              <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
                <span>↑↓ حرکت</span>
                <span>Enter انتخاب</span>
                <span>Esc بستن</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
