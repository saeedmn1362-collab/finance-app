"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
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
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            .querySelector<HTMLInputElement>('input[type="password"]')
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
  // REGISTER LOGIC
  // ─────────────────────────────

  async function handleRegister() {
    if (loading) return;

    setError(null);

    if (!email || !password) {
      setError(t("fields_required"));
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: email.split("@")[0],
        email,
        password,
      });

      router.push(`/${locale}/login`);
    } catch {
      setError(t("register_failed"));
    } finally {
      setLoading(false);
    }
  }

  // ✅ shared handler (FIX اصلی اینجاست)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  // ─────────────────────────────
  // UI
  // ─────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          {t("register")}
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <Input
          disabled={loading}
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <div className="h-3" />

        <Input
          disabled={loading}
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <div className="h-5" />

        <Button onClick={handleRegister} disabled={loading}>
          {loading ? t("loading") : t("register")}
        </Button>
      </Card>
    </div>
  );
}