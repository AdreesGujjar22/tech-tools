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
  const urlForLocale = (l: string) => `${BASE_URL}/${l}${slug || "/"}`;
  const canonical = urlForLocale(locale);
  const languages = Object.fromEntries(
    supportedLocales.map((supportedLocale) => [supportedLocale, urlForLocale(supportedLocale)]),
  );

  return { canonical, languages: { ...languages, "x-default": urlForLocale("en") } };
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
      "max-snippet": -1,
      "max-image-preview": "large" as const,
      "max-video-preview": -1,
    },
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      type: "website" as const,
      url: alternates.canonical,
      locale: openGraphLocales[locale],
      alternateLocale: Object.values(openGraphLocales).filter((value) => value !== openGraphLocales[locale]),
      images: [{ url: "/images/og-default.png", width: 1200, height: 630, alt: pageData.title }],
    },
    twitter: { card: "summary_large_image" as const, title: pageData.title, description: pageData.description, images: ["/images/og-default.png"] },
  };
}

const SITE_NAME = "Tech Tools";

function withSiteName(title: string) {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

type ToolCopy = {
  title?: string;
  description?: string;
  metaDescription?: string;
  metaKeywords?: string;
};

/**
 * Build metadata for a tool page from its own translated namespace,
 * so every tool gets a unique localized title/description without
 * duplicating copy in meta.json.
 */
export async function buildToolMetadata(
  routePath: string,
  namespace: string,
  subKey?: string,
) {
  const locale = await getRequestLocale();
  const loaded = await loadMessages(locale, [namespace as never]);
  // loadMessages nests tool namespaces under `Tools`. Reading the namespace at
  // the top level always returned undefined, so every one of the 100+ tool
  // pages fell back to the identical site title and description - the main
  // duplicate-metadata problem on the site. Look in `Tools` first.
  const tools = (loaded as Record<string, unknown>).Tools as Record<string, unknown> | undefined;
  let root = (tools?.[namespace] ?? (loaded as Record<string, unknown>)[namespace]) as
    | Record<string, unknown>
    | undefined;

  // Last-resort direct read of the translation file, so a tool never falls back
  // to the generic site title/description.
  if (!root) {
    root =
      (await import(`../../messages/${locale}/tools/${namespace}.json`)
        .then((module) => module.default as Record<string, unknown>)
        .catch(() =>
          import(`../../messages/en/tools/${namespace}.json`)
            .then((module) => module.default as Record<string, unknown>)
            .catch(() => undefined),
        )) ?? undefined;
  }
  const node = (subKey ? (root?.[subKey] as ToolCopy | undefined) : (root as ToolCopy | undefined)) ?? {};

  const fallback = await loadMessages(locale, ["meta"]);
  const site = ((fallback.Metadata as Record<string, PageMetadata>) ?? {}).site;

  const title = withSiteName(node.title ?? site.title);
  const baseDescription = node.metaDescription ?? node.description ?? site.description;
  // Keep every tool description unique and long enough to be a useful snippet.
  const description =
    node.title && baseDescription.length < 110
      ? `${baseDescription} Free ${node.title.toLowerCase()} tool - no sign-up, no upload, runs right in your browser.`
      : baseDescription;
  const keywords =
    node.metaKeywords ??
    (node.title
      ? [node.title, `${node.title} online`, `free ${node.title.toLowerCase()}`, "online tools", "tech tools"].join(", ")
      : site.keywords);
  const alternates = await getLocalizedAlternates(routePath);

  return {
    title,
    description,
    keywords,
    alternates,
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large" as const,
      "max-video-preview": -1,
    },
    openGraph: {
      title,
      description,
      type: "website" as const,
      url: alternates.canonical,
      locale: openGraphLocales[locale],
      alternateLocale: Object.values(openGraphLocales).filter((value) => value !== openGraphLocales[locale]),
      images: [{ url: "/images/og-default.png", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image" as const, title, description, images: ["/images/og-default.png"] },
  };
}

export async function buildCatalogToolMetadata(
  routePath: string,
  family: "Pdf" | "Image",
  toolKey: string,
) {
  const locale = await getRequestLocale();
  const loaded = await loadMessages(locale, ["common"]);
  const catalog = (loaded.ToolCatalog as Record<string, any>)?.[family]?.[toolKey] ?? {};
  const name = catalog.name ?? toolKey.replace(/([A-Z])/g, " $1").trim();
  const description = catalog.long ?? catalog.short ?? `Use the free online ${name} tool securely in your browser.`;
  const alternates = await getLocalizedAlternates(routePath);
  const title = withSiteName(name);
  return {
    title, description, keywords: `${name}, ${name} online, free ${name.toLowerCase()}, Tech Tools`, alternates,
    robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const, "max-video-preview": -1 },
    openGraph: { title, description, type: "website" as const, url: alternates.canonical, locale: openGraphLocales[locale], images: [{ url: "/images/og-default.png", width: 1200, height: 630, alt: title }] },
    twitter: { card: "summary_large_image" as const, title, description, images: ["/images/og-default.png"] },
  };
}
