"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { defaultLocale, loadMessages, supportedLocales, supportedToolNamespaces, type Locale, type MessageNamespace } from "../../messages";
import { stripLocalePrefix, withLocalePath, type RouteLocale } from "./router-compat";
import { NextIntlClientProvider } from "next-intl";
import enCommon from "../../messages/en/common.json";
import enMeta from "../../messages/en/meta.json";
import enImageDashboard from "../../messages/en/tools/ImageDashboard.json";
import enPdfDashboard from "../../messages/en/tools/PdfDashboard.json";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function pascalCaseToolId(toolId: string) {
  return toolId
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

function getRouteNamespaces(pathname: string): MessageNamespace[] {
  const route = stripLocalePrefix(pathname);
  const namespaces: MessageNamespace[] = ["common"];
  const add = (...names: string[]) => {
    for (const name of names) {
      if (["Base64FileConverter", "IbanValidator", "PercentageCalculator", "DashboardCategories"].includes(name) || supportedToolNamespaces.includes(name as (typeof supportedToolNamespaces)[number])) {
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
  else if (route === "/uuid-generator") add("UuidGenerator");
  else if (route === "/hash-text") add("HashText");
  else if (route === "/token-generator") add("TokenGenerator");
  else if (route === "/password-strength-analyser") add("PasswordStrengthAnalyser");
  else if (route === "/base64-string-converter") add("Base64StringConverter");
  else if (route === "/case-converter") add("CaseConverter");
  else if (route === "/url-encoder-decoder") add("UrlEncoderDecoder");
  else if (route === "/json-yaml-converter") add("JsonYamlConverter");
  else if (route === "/jwt-parser") add("JwtParser");
  else if (route === "/html-wysiwyg-editor") add("HtmlWysiwygEditor");
  else if (route === "/user-agent-parser") add("UserAgentParser");
  else if (route === "/text-diff") add("TextDiff");
  else if (route === "/ipv4-subnet-calculator") add("Ipv4SubnetCalculator");
  else if (route === "/crontab-generator") add("CrontabGenerator");
  else if (route === "/json-formatter-minifier") add("JsonFormatterMinifier");
  else if (route === "/sql-prettify") add("SqlPrettify");
  else if (route === "/eta-calculator") add("EtaCalculator");
  else if (route === "/percentage-calculator") add("PercentageCalculator");
  else if (route === "/chronometer") add("Chronometer");
  else if (route === "/iban-validator") add("IbanValidator");
  else if (route === "/base64-file-converter") add("Base64FileConverter");
  else if (["/pdf-tools-dashboard", "/image-tools-dashboard", "/crypto-security-dashboard", "/converter-tools-dashboard", "/web-tools-dashboard", "/developer-tools-dashboard", "/network-tools-dashboard", "/text-data-dashboard", "/math-media-dashboard"].includes(route)) add("DashboardCategories");
  else if (route === "/wifi-qr-code-generator") add("WifiQrCodeGenerator");
  else if (route === "/svg-placeholder-generator") add("SvgPlaceholderGenerator");
  else if (route === "/color-converter") add("ColorConverter");
  else if (route === "/html-entities") add("HtmlEntities");
  else if (route === "/integer-base-converter") add("IntegerBaseConverter");
  else if (route === "/roman-numeral-converter") add("RomanNumeralConverter");
  else if (route === "/text-to-binary") add("TextToBinary");
  else if (route === "/url-parser") add("UrlParser");
  else if (route === "/device-information") add("DeviceInformation");
  else if (route === "/basic-auth-generator") add("BasicAuthGenerator");
  else if (route === "/og-meta-generator") add("OgMetaGenerator");
  else if (route === "/bip39-generator") add("Bip39Generator");
  else if (route === "/bcrypt-generator") add("BcryptGenerator");
  else if (route === "/text-to-nato-alphabet") add("TextToNatoAlphabet");
  else if (route === "/text-to-unicode") add("TextToUnicode");
  else if (route === "/mac-address-lookup") add("MacAddressLookup");
  else if (route === "/ipv6-ula-generator") add("Ipv6UlaGenerator");
  else if (route === "/chmod-calculator") add("ChmodCalculator");
  else if (route === "/random-port-generator") add("RandomPortGenerator");
  else if (route === "/docker-run-to-docker-compose-converter") add("DockerRunToDockerComposeConverter");
  else if (route === "/regex-tester") add("RegexTester");
  else if (route === "/yaml-to-json-toml") add("YamlToJsonToml");
  else if (route === "/markdown-to-html") add("MarkdownToHtml");
  else if (route === "/text-statistics") add("TextStatistics");
  else if (route === "/string-obfuscator") add("StringObfuscator");
  else if (route === "/numeronym-generator") add("NumeronymGenerator");
  else if (route === "/phone-parser") add("PhoneParser");
  else if (route === "/temperature-converter") add("TemperatureConverter");
  else if (route === "/base64-string-converter") add("Base64StringConverter");
  else if (route === "/camera-recorder") add("CameraRecorder");
  else if (route === "/chronometer") add("Chronometer");
  else if (route === "/toml-to-yaml-converter") add("TomlToYamlConverter");
  else if (route === "/yaml-prettify") add("YamlPrettify");
  else if (route === "/email-normalizer") add("EmailNormalizer");
  else if (route === "/benchmark-builder") add("BenchmarkBuilder");
  else if (route === "/xml-to-json-converter") add("XmlToJsonConverter");
  else if (route === "/json-to-xml-converter") add("JsonToXmlConverter");
  else if (route === "/list-converter") add("ListConverter");
  else if (route === "/toml-to-json-converter") add("TomlToJsonConverter");
  else if (route === "/json-to-toml-converter") add("JsonToTomlConverter");
  else if (route === "/encryption-decryption") add("EncryptionDecryption");
  else if (route === "/hmac-generator") add("HmacGenerator");
  else if (route === "/rsa-key-pair-generator") add("RsaKeyPairGenerator");
  else if (route === "/pdf-signature-checker") add("PdfSignatureChecker");
  else if (route === "/ipv4-range-expander") add("Ipv4RangeExpander");
  else if (route === "/xml-formatter") add("XmlFormatter");
  else if (route === "/outlook-safelink-decoder") add("OutlookSafelinkDecoder");
  else if (route === "/git-memo") add("GitMemo");
  else if (route === "/json-diff") add("JsonDiff");
  else if (route === "/slugify-string") add("SlugifyString");
  else if (route === "/ascii-art-generator") add("AsciiArtGenerator");
  else if (route === "/ipv4-address-converter") add("Ipv4AddressConverter");
  else if (route.startsWith("/ilovepdf")) {
    const pdfToolId = route.split("/").filter(Boolean).at(-1);
    const pdfToolNamespace = pdfToolId ? pascalCaseToolId(pdfToolId) : null;
    add("PdfDashboard", "shared", "Loading");
    if (pdfToolNamespace) add(pdfToolNamespace);
  }
  else if (route.startsWith("/iloveimg")) {
    const imageToolId = route.split("/").filter(Boolean).at(-1);
    const imageToolNamespace = imageToolId ? pascalCaseToolId(imageToolId) : null;
    add("ImageDashboard", "shared", "Loading");
    if (imageToolNamespace === "RemoveBackground") add("BackgroundRemover");
    else if (["ImageToJpg", "ImageToPng", "ImageToWebp", "ImageToAvif", "JpgToPng", "PngToJpg", "WebpToJpg", "WebpToPng", "GifToJpg", "SvgToPng", "BatchConvert"].includes(imageToolNamespace)) add("ImageConverter");
    else if (imageToolNamespace) add(imageToolNamespace);
  }

  if (/^\/[^/]+$/.test(route)) add(pascalCaseToolId(route.slice(1)));

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
  const [messages, setMessages] = useState<Record<string, any>>({
    ...enCommon,
    ...enMeta,
    Tools: {
      ImageDashboard: enImageDashboard,
      PdfDashboard: enPdfDashboard,
    },
  });
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const messageKey = `${locale}:${pathname}`;

  useEffect(() => {
    let active = true;
    setLoadedKey(null);
    const namespaces = getRouteNamespaces(pathname);
    loadMessages(locale, namespaces).then((loaded) => {
      if (active) {
        setMessages(loaded);
        setLoadedKey(messageKey);
      }
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
        {loadedKey === messageKey ? children : null}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
