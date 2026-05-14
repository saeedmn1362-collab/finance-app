import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";

type Params = {
  locale: string;
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { locale } = await params;

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div
        lang={locale}
        dir={locale === "fa" ? "rtl" : "ltr"}
        className="min-h-screen bg-white dark:bg-gray-900 transition-colors"
      >
        <div className="fixed top-4 left-4 z-50 flex gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        {children}
      </div>
    </NextIntlClientProvider>
  );
}
