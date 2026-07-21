import { messages } from "../../messages";

type MetadataKey = keyof typeof messages.en.Metadata;

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.ilovetechtools.com";

export function buildPageMetadata(routePath: string, metadataKey: MetadataKey) {
  const pageData = messages.en.Metadata[metadataKey];
  const slug = routePath === "/" ? "" : routePath;
  const enUrl = `${BASE_URL}/en${slug}`;
  const esUrl = `${BASE_URL}/es${slug}`;

  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords,
    alternates: {
      canonical: enUrl,
      languages: {
        en: enUrl,
        es: esUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      type: "website" as const,
    },
  };
}
