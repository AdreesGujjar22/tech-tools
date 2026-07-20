import { IMAGE_TOOLS } from "@/components/image-tools/toolsData";
import { PDF_TOOLS } from "@/components/pdf-tools/toolsData";
import { publicRoutes } from "../../messages";

const STATIC_SLUGS = [
  { path: publicRoutes.home, priority: 1.0, changefreq: "daily" },
  { path: publicRoutes.about, priority: 0.9, changefreq: "monthly" },
  { path: publicRoutes.contact, priority: 0.8, changefreq: "yearly" },
  { path: publicRoutes.pricing, priority: 0.8, changefreq: "monthly" },
  { path: publicRoutes.help, priority: 0.7, changefreq: "monthly" },
  { path: publicRoutes.privacy, priority: 0.7, changefreq: "yearly" },
  { path: publicRoutes.terms, priority: 0.7, changefreq: "yearly" },
  { path: publicRoutes.image, priority: 0.9, changefreq: "weekly" },
  { path: publicRoutes.pdf, priority: 0.9, changefreq: "weekly" },
  { path: publicRoutes.qrGenerator, priority: 0.8, changefreq: "weekly" },
  { path: publicRoutes.barcodeGenerator, priority: 0.8, changefreq: "weekly" },
  { path: publicRoutes.barcodeReader, priority: 0.8, changefreq: "weekly" },
  { path: publicRoutes.passwordGenerator, priority: 0.8, changefreq: "weekly" },
  { path: publicRoutes.loremGenerator, priority: 0.8, changefreq: "weekly" },
  { path: publicRoutes.emojiPicker, priority: 0.8, changefreq: "weekly" },
  { path: publicRoutes.notepad, priority: 0.8, changefreq: "weekly" },
  { path: publicRoutes.colorPicker, priority: 0.8, changefreq: "weekly" },
  { path: publicRoutes.speedTest, priority: 0.8, changefreq: "weekly" },
  { path: publicRoutes.typingSpeed, priority: 0.8, changefreq: "weekly" },
  { path: publicRoutes.tools, priority: 0.8, changefreq: "weekly" },
  { path: publicRoutes.blog, priority: 0.9, changefreq: "daily" },
];

const LOCALES = ["en", "es"] as const;

function localeUrl(baseUrl: string, locale: string, slug: string) {
  return `${baseUrl}/${locale}${slug === "/" ? "" : slug}`;
}

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '\"': "&quot;",
    };

    return entities[character];
  });
}

export function GET() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.ilovetechtools.com"
  ).replace(/\/$/, "");
  const lastModified = new Date().toISOString();
  const routes = [
    ...STATIC_SLUGS,
    ...IMAGE_TOOLS.map(({ route }) => ({
      path: route,
      priority: 0.8,
      changefreq: "weekly",
    })),
    ...PDF_TOOLS.map(({ route }) => ({
      path: route,
      priority: 0.8,
      changefreq: "weekly",
    })),
  ];

  const entries = routes
    .flatMap(({ path, priority, changefreq }) =>
      LOCALES.map((locale) => {
        const url = localeUrl(baseUrl, locale, path);
        const alternates = LOCALES.map(
          (alternateLocale) =>
            `    <xhtml:link rel="alternate" hreflang="${alternateLocale}" href="${escapeXml(localeUrl(baseUrl, alternateLocale, path))}" />`
        ).join("\n");

        return `  <url>\n    <loc>${escapeXml(url)}</loc>\n${alternates}\n    <lastmod>${lastModified}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`;
      })
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
