import { headers } from "next/headers";
import { messages } from "../../messages";

type MetadataKey = keyof typeof messages.en.Metadata;
const locales = ["de", "en", "es", "fr", "id", "it", "nl", "pt", "tr"] as const;
type MetadataLocale = (typeof locales)[number];
const openGraphLocales = {
  de: "de_DE",
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  id: "id_ID",
  it: "it_IT",
  nl: "nl_NL",
  pt: "pt_BR",
  tr: "tr_TR",
} as const;

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.ilovetechtools.com"
).replace(/\/$/, "");

export async function getRequestLocale(): Promise<MetadataLocale> {
  const requestLocale = (await headers()).get("x-locale");
  return locales.includes(requestLocale as MetadataLocale)
    ? (requestLocale as MetadataLocale)
    : "en";
}

export async function getLocalizedAlternates(routePath: string) {
  const locale = await getRequestLocale();
  const slug = routePath === "/" ? "" : routePath;
  const localizedUrls = Object.fromEntries(
    locales.map((supportedLocale) => [supportedLocale, `${BASE_URL}/${supportedLocale}${slug}`]),
  );

  return {
    canonical: localizedUrls[locale],
    languages: {
      ...localizedUrls,
      "x-default": localizedUrls.en,
    },
  };
}

export async function buildPageMetadata(routePath: string, metadataKey: MetadataKey) {
  const locale = await getRequestLocale();
  const pageData = messages[locale].Metadata[metadataKey];
  const alternates = await getLocalizedAlternates(routePath);

  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords,
    alternates,
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      type: "website" as const,
      url: alternates.canonical,
      locale: openGraphLocales[locale],
      alternateLocale: Object.values(openGraphLocales).filter((value) => value !== openGraphLocales[locale]),
      images: [{ url: "/images/web-logo.png", width: 1200, height: 630, alt: pageData.title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: pageData.title,
      description: pageData.description,
      images: ["/images/web-logo.png"],
    },
  };
}
