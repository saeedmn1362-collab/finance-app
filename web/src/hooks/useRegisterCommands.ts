"use client";

import { useEffect, useRef } from "react";
import { type Command, useCommandRegistry } from "@/context/CommandRegistry";

/**
 * هر feature با این hook command های خودش را register می‌کند
 * - بدون loop
 * - بدون re-register غیرضروری
 * - cleanup-safe
 */
export function useRegisterCommands(commands: Command[]) {
  const { register } = useCommandRegistry();

  // نگه‌داری آخرین commands برای جلوگیری از dependency loop
  const commandsRef = useRef(commands);
  commandsRef.current = commands;

  // جلوگیری از re-run شدن effect به خاطر تغییر reference
  const hasRegistered = useRef(false);

  useEffect(() => {
    // فقط یک بار register کن (mount)
    if (hasRegistered.current) return;
    hasRegistered.current = true;

    const cleanups = commandsRef.current.map((cmd) => register(cmd));

    // cleanup هنگام unmount
    return () => {
      cleanups.forEach((fn) => fn?.());
      hasRegistered.current = false;
    };
  }, [register]);
}