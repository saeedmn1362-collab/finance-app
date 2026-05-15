"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1]
      : "fa";

  async function handleRegister() {
    try {
      await api.post("/auth/register", {
        email,
        password,
      });

      router.push(`/${locale}/login`);
    } catch (err: any) {
      console.error(err);
      alert(t("register_failed") || "error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card>
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          {t("register")}
        </h1>

        <Input
          placeholder={t("email")}
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
        />

        <div className="h-3" />

        <Input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />

        <div className="h-5" />

        <Button onClick={handleRegister}>
          {t("register")}
        </Button>
      </Card>
    </div>
  );
}