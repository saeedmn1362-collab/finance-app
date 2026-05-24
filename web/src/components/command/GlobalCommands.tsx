"use client";

import { useEffect } from "react";

import {
  useCommandRegistry,
  type CommandContext,
} from "@/context/CommandRegistry";

export default function GlobalCommands() {
  const { register } =
    useCommandRegistry();

  useEffect(() => {
    const unregister = [
      // ─────────────────────────────
      // LOGIN
      // ─────────────────────────────

      register({
        id: "go-login",

        label: "Go To Login",

        keywords: ["login", "signin"],

        group: "Navigation",

        priority: 100,

        when: (ctx: CommandContext) =>
          !ctx.auth.user,

        action: (ctx: CommandContext) => {
          window.location.href = `/${ctx.locale}/login`;
        },
      }),

      // ─────────────────────────────
      // REGISTER
      // ─────────────────────────────

      register({
        id: "go-register",

        label: "Go To Register",

        keywords: ["register", "signup"],

        group: "Navigation",

        priority: 90,

        when: (ctx: CommandContext) =>
          !ctx.auth.user,

        action: (ctx: CommandContext) => {
          window.location.href = `/${ctx.locale}/register`;
        },
      }),

      // ─────────────────────────────
      // HOME
      // ─────────────────────────────

      register({
        id: "go-home",

        label: "Go Home",

        keywords: ["home", "dashboard"],

        group: "Navigation",

        priority: 80,

        when: (ctx: CommandContext) =>
          !!ctx.auth.user,

        action: (ctx: CommandContext) => {
          window.location.href = `/${ctx.locale}`;
        },
      }),
    ];

    return () => {
      unregister.forEach((fn) => fn());
    };
  }, [register]);

  return null;
}