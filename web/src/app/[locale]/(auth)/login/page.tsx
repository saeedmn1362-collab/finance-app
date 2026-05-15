"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import api from "@/lib/api";

import { auth } from "@/lib/auth.helper";

import { useGuestGuard } from "@/hooks/useGuestGuard";

import { Input } from "@/components/ui/Input";

import { Button } from "@/components/ui/Button";

import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();

  const locale = useLocale();

  const t = useTranslations();

  const checked = useGuestGuard(`/${locale}`);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  if (!checked) return null;

  async function handleLogin() {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">
          {t("login")}
        </h1>

        <Input
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
          {loading ? "Loading..." : t("login")}
        </Button>
      </Card>
    </div>
  );
}