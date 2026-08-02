import { headers } from "next/headers";
import { loadMessages, supportedLocales, type Locale } from "../../messages";

type PageMetadata = { title: string; description: string; keywords: string };
type MetadataKey = "site" | "home" | "about" | "pricing" | "contact" | "help" | "privacy" | "terms" | "qrGenerator" | "barcodeGenerator" | "barcodeReader" | "passwordGenerator" | "loremGenerator" | "emojiPicker" | "notepad" | "colorPicker" | "speedTest" | "typingSpeed" | "tools" | "pdf" | "image" | "customization";
type MetadataLocale = Locale;
const openGraphLocales: Record<MetadataLocale, string> = {
  de: "de_DE", en: "en_US", es: "es_ES", fr: "fr_FR", id: "id_ID", it: "it_IT", nl: "nl_NL", pt: "pt_BR", tr: "tr_TR",
};

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.ilovetechtools.com"
).replace(/\/$/, "");

export async function getRequestLocale(): Promise<MetadataLocale> {
  const requestLocale = (await headers()).get("x-locale");
  return supportedLocales.includes(requestLocale as Locale) ? requestLocale as Locale : "en";
}

export async function getLocalizedAlternates(routePath: string) {
  const locale = await getRequestLocale();
  const slug = routePath === "/" ? "" : routePath;
  const localizedUrls = Object.fromEntries(
    supportedLocales.map((supportedLocale) => [supportedLocale, `${BASE_URL}/${supportedLocale}${slug}`]),
  );

  return { canonical: localizedUrls[locale], languages: { ...localizedUrls, "x-default": localizedUrls.en } };
}

export async function buildPageMetadata(routePath: string, metadataKey: MetadataKey) {
  const locale = await getRequestLocale();
  const loaded = await loadMessages(locale, ["meta"]);
  const metadata = loaded.Metadata as Record<string, PageMetadata>;
  const pageData = metadata[metadataKey];
  const alternates = await getLocalizedAlternates(routePath);

  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords,
    alternates,
    robots: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large" as const,
      maxVideoPreview: -1,
    },
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      type: "website" as const,
      url: alternates.canonical,
      locale: openGraphLocales[locale],
      alternateLocale: Object.values(openGraphLocales).filter((value) => value !== openGraphLocales[locale]),
      images: [{ url: "/images/web-logo.png", width: 1200, height: 630, alt: pageData.title }],
    },
    twitter: { card: "summary_large_image" as const, title: pageData.title, description: pageData.description, images: ["/images/web-logo.png"] },
  };
}
