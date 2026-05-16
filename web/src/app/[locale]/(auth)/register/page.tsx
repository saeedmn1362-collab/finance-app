"use client";

import {
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  useLocale,
  useTranslations,
} from "next-intl";

import api from "@/lib/api";

import { useRegisterCommands } from "@/hooks/useRegisterCommands";

import type { Command } from "@/context/CommandRegistry";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();

  const locale = useLocale();

  const t = useTranslations();

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
        id: "focus-email-register",

        label: "Focus Register Email",

        keywords: ["register", "email"],

        group: "Register",

        priority: 50,

        action: () => {
          document
            .querySelector<HTMLInputElement>(
              'input[type="email"], input[type="text"]'
            )
            ?.focus();
        },
      },

      {
        id: "focus-password-register",

        label: "Focus Register Password",

        keywords: ["register", "password"],

        group: "Register",

        priority: 40,

        action: () => {
          document
            .querySelector<HTMLInputElement>(
              'input[type="password"]'
            )
            ?.focus();
        },
      },

      {
        id: "go-login-register-page",

        label: "Go To Login",

        keywords: ["login", "signin"],

        group: "Navigation",

        priority: 60,

        action: () => {
          router.push(`/${locale}/login`);
        },
      },
    ],
    [locale, router]
  );

  useRegisterCommands(commands);

  // ─────────────────────────────
  // REGISTER
  // ─────────────────────────────

  async function handleRegister() {
    try {
      setLoading(true);

      await api.post("/auth/register", {
        email,
        password,
      });

      router.push(`/${locale}/login`);
    } catch (err: any) {
      console.error(err);

      alert(
        t("register_failed") || "error"
      );
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
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          {t("register")}
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
          onClick={handleRegister}
          disabled={loading}
        >
          {loading
            ? "Loading..."
            : t("register")}
        </Button>
      </Card>
    </div>
  );
}