"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  useResolvedCommands,
  useCommandRegistry,
  resolveDisabled,
} from "@/context/CommandRegistry";

import type { Command } from "@/context/CommandRegistry";

const COMBO_TIMEOUT = 450;
const MAX_COMBO_LENGTH = 3;

// Normalize keys (US + non-US keyboards)
function normalizeKey(e: KeyboardEvent) {
  const parts: string[] = [];

  if (e.metaKey || e.ctrlKey) parts.push("mod");
  if (e.shiftKey) parts.push("shift");
  if (e.altKey) parts.push("alt");

  parts.push(e.key.toLowerCase().normalize("NFKC"));
  return parts.join("+");
}

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;

  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.isContentEditable
  );
}

export default function ShortcutEngine() {
  const commands = useResolvedCommands();

  const { context } = useCommandRegistry();
  const contextRef = useRef(context);

  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  const { singleMap, comboMap } = useMemo(() => {
    const singleMap = new Map<string, Command>();
    const comboMap = new Map<string, Command>();

    for (const cmd of commands) {
      if (!cmd.shortcut) continue;

      for (const sc of cmd.shortcut) {
        const key = sc.toLowerCase();

        if (key.includes(" ")) comboMap.set(key, cmd);
        else singleMap.set(key, cmd);
      }
    }

    return { singleMap, comboMap };
  }, [commands]);

  const bufferRef = useRef<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningRef = useRef(false);

  const resetBuffer = () => {
    bufferRef.current = [];
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;

      if (isTypingTarget(e.target) || isTypingTarget(active)) {
        resetBuffer();
        return;
      }

      if (runningRef.current) return;
      runningRef.current = true;

      requestAnimationFrame(() => {
        queueMicrotask(async () => {
          try {
            const key = normalizeKey(e);
            const ctx = contextRef.current;

            // DIRECT SHORTCUTS
            const direct = singleMap.get(key);

            if (direct) {
              if (!resolveDisabled(direct, ctx) && (!direct.when || direct.when(ctx))) {
                e.preventDefault();
                await direct.action?.(ctx);
              }
              return;
            }

            // COMBO SHORTCUTS
            bufferRef.current.push(key);

            if (bufferRef.current.length > MAX_COMBO_LENGTH) {
              bufferRef.current = bufferRef.current.slice(-MAX_COMBO_LENGTH);
            }

            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(resetBuffer, COMBO_TIMEOUT);

            const combo = bufferRef.current.join(" ");
            const comboCmd = comboMap.get(combo);

            if (comboCmd) {
              if (!resolveDisabled(comboCmd, ctx) && (!comboCmd.when || comboCmd.when(ctx))) {
                e.preventDefault();
                try {
                  await comboCmd.action?.(ctx);
                } finally {
                  resetBuffer();
                }
              } else {
                resetBuffer();
              }
            }
          } finally {
            queueMicrotask(() => {
              runningRef.current = false;
            });
          }
        });
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [singleMap, comboMap]);

  return null;
}
