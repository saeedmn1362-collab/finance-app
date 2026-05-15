"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export function useLogout() {
  const locale = useLocale();
  const router = useRouter();

  return () => {
    localStorage.removeItem("token");
    router.replace(`/${locale}/login`);
    router.refresh();
  };
}
