import { headers } from "next/headers";
import { messages } from "../../messages";

type MetadataKey = keyof typeof messages.en.Metadata;
const locales = ["de", "en", "es", "fr", "id", "it", "nl", "pt", "tr"] as const;
type MetadataLocale = (typeof locales)[number];

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.ilovetechtools.com"
).replace(/\/$/, "");

export async function getLocalizedAlternates(routePath: string) {
  const requestLocale = (await headers()).get("x-locale");
  const locale: MetadataLocale = locales.includes(requestLocale as MetadataLocale)
    ? (requestLocale as MetadataLocale)
    : "en";
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
  const pageData = messages.en.Metadata[metadataKey];
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
    },
  };
}
