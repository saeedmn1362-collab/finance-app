"use client";

import { useMemo } from "react";

import { useRegisterCommands } from "@/hooks/useRegisterCommands";

import type {
  Command,
  CommandContext,
} from "@/context/CommandRegistry";

export default function GlobalCommands() {
  const commands = useMemo<Command[]>(
    () => [
      // ─────────────────────────────
      // NAVIGATION
      // ─────────────────────────────

      {
        id: "go-dashboard",

        label: "Dashboard",

        keywords: ["home", "main"],

        group: "Navigation",

        priority: 100,

        shortcut: ["g d"],

        action: (ctx: CommandContext) => {
          window.location.href = `/${ctx.locale}`;
        },
      },

      {
        id: "go-login",

        label: "Login",

        keywords: ["auth", "signin"],

        group: "Navigation",

        priority: 90,

        shortcut: ["g l"],

        when: (ctx: CommandContext) =>
          !ctx.auth.userId,

        action: (ctx: CommandContext) => {
          window.location.href = `/${ctx.locale}/login`;
        },
      },

      {
        id: "logout",

        label: "Logout",

        keywords: ["exit", "signout"],

        group: "Account",

        priority: 100,

        shortcut: ["shift+q"],

        when: (ctx: CommandContext) =>
          !!ctx.auth.userId,

        action: () => {
          localStorage.removeItem(
            "token"
          );

          window.location.href =
            "/login";
        },
      },

      // ─────────────────────────────
      // UI
      // ─────────────────────────────

      {
        id: "toggle-theme",

        label: "Toggle Theme",

        keywords: ["dark", "light"],

        group: "UI",

        priority: 80,

        shortcut: ["mod+t"],

        action: () => {
          document.documentElement.classList.toggle(
            "dark"
          );
        },
      },

      {
        id: "reload-app",

        label: "Reload App",

        keywords: ["refresh", "reload"],

        group: "System",

        priority: 70,

        shortcut: ["r"],

        action: () => {
          window.location.reload();
        },
      },

      // ─────────────────────────────
      // COMMAND PALETTE
      // ─────────────────────────────

      {
        id: "open-palette",

        label: "Open Command Palette",

        keywords: ["cmdk", "search"],

        group: "System",

        priority: 200,

        shortcut: ["mod+k"],

        action: () => {
          window.dispatchEvent(
            new CustomEvent(
              "open-command-palette"
            )
          );
        },
      },
    ],
    []
  );

  useRegisterCommands(commands);

  return null;
}