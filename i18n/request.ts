import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import { loadMessages, supportedLocales, type Locale } from "../messages";

export default getRequestConfig(async () => {
  const requestedLocale = (await headers()).get("x-locale");
  const locale = supportedLocales.includes(requestedLocale as Locale) ? requestedLocale as Locale : "en";

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
