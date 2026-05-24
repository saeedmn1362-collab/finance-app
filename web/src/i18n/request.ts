import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // در next-intl جدید، locale از requestLocale می‌آید
  const locale = await requestLocale ?? 'fa';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});