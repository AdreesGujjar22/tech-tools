"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { defaultLocale, loadMessages, supportedLocales, supportedToolNamespaces, type Locale, type MessageNamespace } from "../../messages";
import { stripLocalePrefix, withLocalePath, type RouteLocale } from "./router-compat";
import { NextIntlClientProvider } from "next-intl";
import enCommon from "../../messages/en/common.json";
import enMeta from "../../messages/en/meta.json";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getRouteNamespaces(pathname: string): MessageNamespace[] {
  const route = stripLocalePrefix(pathname);
  const namespaces: MessageNamespace[] = ["common"];
  const add = (...names: string[]) => {
    for (const name of names) {
      if (supportedToolNamespaces.includes(name as (typeof supportedToolNamespaces)[number])) {
        namespaces.push(name as MessageNamespace);
      }
    }
  };

  if (route === "/qr-generator") add("QrGenerator");
  else if (route === "/barcode-generator") add("BarcodeGenerator");
  else if (route === "/barcode-reader") add("BarcodeReader");
  else if (route === "/password-generator") add("PasswordGenerator");
  else if (route === "/lorem-ipsum-generator") add("LoremGenerator");
  else if (route === "/emoji-picker") add("EmojiPicker");
  else if (route === "/notepad") add("Notepad");
  else if (route === "/color-picker") add("ColorPicker");
  else if (route === "/speed-test") add("SpeedTest");
  else if (route === "/typing-speed") add("TypingSpeed");
  else if (route.startsWith("/ilovepdf")) add("PdfDashboard", ...supportedToolNamespaces.filter((name) => ["shared", "Loading", "PdfToPowerpoint", "PdfToWord", "UnlockPdf"].includes(name)));
  else if (route.startsWith("/iloveimg")) add("ImageDashboard", ...supportedToolNamespaces.filter((name) => ["shared", "Loading", "UpscaleImage", "CropImage", "BackgroundRemover", "WatermarkImage", "ImageConverter"].includes(name)));

  return [...new Set(namespaces)];
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
  const [locale, setLocaleState] = useState<Locale>(() => {
    const pathLocale = pathname.split("/")[1] as Locale;
    return isAdminPath || !supportedLocales.includes(pathLocale) ? defaultLocale : pathLocale;
  });
  const [messages, setMessages] = useState<Record<string, any>>({ ...enCommon, ...enMeta });

  useEffect(() => {
    let active = true;
    const namespaces = getRouteNamespaces(pathname);
    loadMessages(locale, namespaces).then((loaded) => {
      if (active) setMessages(loaded);
    });
    return () => { active = false; };
  }, [locale, pathname]);

  useEffect(() => {
    if (isAdminPath) return;
    const saved = window.localStorage.getItem("techtools-locale");
    if (!saved || !supportedLocales.includes(saved as Locale)) return;
    const savedLocale = saved as Locale;
    setLocaleState(savedLocale);
    document.documentElement.lang = savedLocale;
    if (savedLocale !== (pathname.split("/")[1] as RouteLocale)) {
      router.replace(withLocalePath(stripLocalePrefix(pathname), savedLocale));
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
      <NextIntlClientProvider locale={locale} messages={messages}>
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
