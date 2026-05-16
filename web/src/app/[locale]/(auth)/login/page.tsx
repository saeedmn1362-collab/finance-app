"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  useLocale,
  useTranslations,
} from "next-intl";

import api from "@/lib/api";

import { auth } from "@/lib/auth.helper";

import { useGuestGuard } from "@/hooks/useGuestGuard";
import { useRegisterCommands } from "@/hooks/useRegisterCommands";

import type { Command } from "@/context/CommandRegistry";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();

  const locale = useLocale();

  const t = useTranslations();

  const checked = useGuestGuard(
    `/${locale}`
  );

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ─────────────────────────────
  // COMMANDS
  // ─────────────────────────────

  const commands = useMemo<Command[]>(
    () => [
      {
        id: "focus-email-login",

        label: "Focus Email",

        keywords: ["email", "login"],

        group: "Login",

        priority: 50,

        action: () => {
          document
            .querySelector<HTMLInputElement>(
              'input[type="text"], input[type="email"]'
            )
            ?.focus();
        },
      },

      {
        id: "focus-password-login",

        label: "Focus Password",

        keywords: ["password", "login"],

        group: "Login",

        priority: 40,

        action: () => {
          document
            .querySelector<HTMLInputElement>(
              'input[type="password"]'
            )
            ?.focus();
        },
      },
    ],
    []
  );

  useRegisterCommands(commands);

  if (!checked) return null;

  // ─────────────────────────────
  // LOGIN
  // ─────────────────────────────

  async function handleLogin() {
    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token;

      auth.setToken(token);

      router.replace(`/${locale}`);
    } catch (error) {
      console.error(error);

      alert(t("login_failed"));
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────
  // UI
  // ─────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">
          {t("login")}
        </h1>

        <Input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e: any) =>
            setEmail(e.target.value)
          }
        />

        <div className="h-3" />

        <Input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e: any) =>
            setPassword(e.target.value)
          }
        />

        <div className="h-5" />

        <Button
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : t("login")}
        </Button>
      </Card>
    </div>
  );
}