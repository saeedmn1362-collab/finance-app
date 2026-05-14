import {getRequestConfig} from "next-intl/server";

export default getRequestConfig(async ({locale}) => {
  if (!locale) {
    return {
      locale: "fa",
      messages: (await import(`@/messages/fa.json`)).default
    };
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default
  };
});