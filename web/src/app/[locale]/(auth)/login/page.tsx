"use client";

import { Suspense, useMemo, useState } from "react";
import GuestGuard from "@/components/guard/GuestGuard";
import { useLocale, useTranslations } from "next-intl";
import api from "@/lib/api";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useRegisterCommands } from "@/hooks/useRegisterCommands";
import type { Command } from "@/context/CommandRegistry";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function LoginPageContent() {
  const locale = useLocale();
  const t = useTranslations();
  const { refetch } = useAuthContext();

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
            .querySelector<HTMLInputElement>('input[type="password"]')
            ?.focus();
        },
      },
    ],
    []
  );

  useRegisterCommands(commands);

  // ─────────────────────────────
  // LOGIN
  // ─────────────────────────────

  async function handleLogin() {
    if (loading) return;

    setError(null);

    if (!email || !password) {
      setError(t("fields_required"));
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/login", {
        email,
        password,
      });

      await refetch();
    } catch {
      setError(t("login_failed"));
    } finally {
      setLoading(false);
    }
  }

  // shared handler (🔥 FIX اصلی اینجاست)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // ─────────────────────────────
  // UI
  // ─────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">
          {t("login")}
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

        <Button onClick={handleLogin} disabled={loading}>
          {loading ? t("logging_in") : t("login")}
        </Button>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GuestGuard>
        <LoginPageContent />
      </GuestGuard>
    </Suspense>
  );
}