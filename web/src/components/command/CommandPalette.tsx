"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Fuse from "fuse.js";

import { Portal } from "@/components/ui/Portal";

import {
  useResolvedCommands,
  useCommandRegistry,
  type Command,
} from "@/context/CommandRegistry";

type Props = {
  open: boolean;
  onClose: () => void;
};

type PageCommand = Command & {
  type?: "page";
  href?: string;
};

type ActionCommand = Command & {
  type?: "action";
};

export default function CommandPalette({ open, onClose }: Props) {
  const locale = useLocale();
  const router = useRouter();

  const commands = useResolvedCommands();
  const { context } = useCommandRegistry();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────
  // FUSE ENGINE (memo-safe)
  // ─────────────────────────────
  const fuse = useMemo(
    () =>
      new Fuse(commands, {
        keys: [
          { name: "label", weight: 0.6 },
          { name: "keywords", weight: 0.3 },
          { name: "group", weight: 0.1 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [commands]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse, commands]);

  // ─────────────────────────────
  // RESET STATE
  // ─────────────────────────────
  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  useEffect(() => {
    if (activeIndex >= filtered.length) {
      setActiveIndex(0);
    }
  }, [filtered, activeIndex]);

  useEffect(() => {
    const el = listRef.current?.querySelector(
      `[data-index="${activeIndex}"]`
    ) as HTMLElement | null;

    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  // ─────────────────────────────
  // EXECUTION ENGINE (FINAL FIXED)
  // ─────────────────────────────
  const execute = async (cmd: Command) => {
    try {
      await cmd.action(context);
    } finally {
      if (cmd.closeOnRun !== false) onClose();
    }
  };

  const navigate = (href?: string) => {
    if (!href) return;
    router.push(`/${locale}${href}`);
    onClose();
  };

  // ─────────────────────────────
  // KEYBOARD HANDLING
  // ─────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((p) => Math.min(p + 1, filtered.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((p) => Math.max(p - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const item = filtered[activeIndex];
      if (!item) return;

      const typed = item as PageCommand | ActionCommand;

      if (typed.type === "page") {
        navigate(typed.href);
      } else {
        execute(item);
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  // ─────────────────────────────
  // UI
  // ─────────────────────────────
  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="fixed left-1/2 top-[12%] z-[100] w-full max-w-xl -translate-x-1/2 rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 overflow-hidden"
              role="dialog"
              aria-modal="true"
            >
              {/* INPUT */}
              <div className="flex items-center gap-3 border-b px-4 h-14">
                <Search className="w-4 h-4 text-gray-400" />

                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>

              {/* LIST */}
              <div
                ref={listRef}
                className="max-h-[320px] overflow-y-auto p-2"
              >
                {filtered.length === 0 ? (
                  <div className="text-center text-sm text-gray-500 py-8">
                    No results
                  </div>
                ) : (
                  filtered.map((item, index) => {
                    const isActive = index === activeIndex;
                    const typed = item as PageCommand | ActionCommand;

                    return (
                      <button
                        key={item.id}
                        data-index={index}
                        onClick={() =>
                          typed.type === "page"
                            ? navigate(typed.href)
                            : execute(item)
                        }
                        className={`w-full flex justify-between rounded-xl px-3 py-3 text-sm transition
                          ${
                            isActive
                              ? "bg-gray-100 dark:bg-gray-800"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                      >
                        <span>{item.label}</span>

                        {typed.type === "action" && (
                          <span className="text-xs text-blue-500">
                            action
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* FOOTER */}
              <div className="border-t px-4 py-2 text-xs text-gray-500 flex justify-between">
                <span>↑↓ Navigate</span>
                <span>Enter Select</span>
                <span>Esc Close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Portal>
  );
}
