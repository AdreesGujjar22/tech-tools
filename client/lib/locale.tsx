"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { defaultLocale, messages, type Locale } from "../../messages";
import { stripLocalePrefix, withLocalePath, type RouteLocale } from "./router-compat";
import { NextIntlClientProvider } from "next-intl";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const [locale, setLocaleState] = useState<Locale>(
    isAdminPath ? defaultLocale : pathname.split("/")[1] === "es" ? "es" : pathname.split("/")[1] === "pt" ? "pt" : defaultLocale
  );

  useEffect(() => {
    if (isAdminPath) return;
    const saved = window.localStorage.getItem("techtools-locale");
    if (saved !== "en" && saved !== "es" && saved !== "pt") return;
    setLocaleState(saved);
    document.documentElement.lang = saved;
    if (saved !== (pathname.split("/")[1] as RouteLocale)) {
      router.replace(withLocalePath(stripLocalePrefix(pathname), saved));
    }
  }, [isAdminPath, pathname, router]);

  const value = useMemo(() => ({
    locale,
    setLocale: (nextLocale: Locale) => {
      window.localStorage.setItem("techtools-locale", nextLocale);
      setLocaleState(nextLocale);
      document.documentElement.lang = nextLocale;
      if (!isAdminPath) router.replace(withLocalePath(stripLocalePrefix(pathname), nextLocale));
    },
  }), [isAdminPath, locale, pathname, router]);

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
