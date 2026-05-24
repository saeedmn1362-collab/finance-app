"use client";

import type { ReactNode } from "react";
import "./globals.css";

import Providers from "./providers";

import GlobalCommands from "@/components/command/GlobalCommands";
import ShortcutEngine from "@/components/command/ShortcutEngine";

import { CommandRegistryProvider } from "@/context/CommandRegistry";

import AuthTester from "@/components/debug/AuthTester";
import RouteTester from "@/components/debug/RouteTester";
import RouteSync from "@/components/route/RouteSync";

import { AuthProvider } from "@/context/AuthContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <CommandRegistryProvider>
            <AuthTester />
            <RouteTester />
            <RouteSync />

            <GlobalCommands />
            <ShortcutEngine />

            <Providers>{children}</Providers>
          </CommandRegistryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
