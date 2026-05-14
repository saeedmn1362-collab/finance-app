import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let messages;

  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        
        <NextIntlClientProvider locale={locale} messages={messages}>
          
          {/* Top Actions */}
          <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {children}

        </NextIntlClientProvider>

      </body>
    </html>
  );
}