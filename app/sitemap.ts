import type { MetadataRoute } from "next";
import { IMAGE_TOOLS } from "@/components/image-tools/toolsData";
import { PDF_TOOLS } from "@/components/pdf-tools/toolsData";
import { publicRoutes } from "../messages";

const STATIC_SLUGS = [
  { path: publicRoutes.home, priority: 1.0, changefreq: "daily" as const },
  { path: publicRoutes.about, priority: 0.9, changefreq: "monthly" as const },
  { path: publicRoutes.contact, priority: 0.8, changefreq: "yearly" as const },
  { path: publicRoutes.pricing, priority: 0.8, changefreq: "monthly" as const },
  { path: publicRoutes.help, priority: 0.7, changefreq: "monthly" as const },
  { path: publicRoutes.privacy, priority: 0.7, changefreq: "yearly" as const },
  { path: publicRoutes.terms, priority: 0.7, changefreq: "yearly" as const },
  { path: publicRoutes.image, priority: 0.9, changefreq: "weekly" as const },
  { path: publicRoutes.pdf, priority: 0.9, changefreq: "weekly" as const },
  { path: publicRoutes.qrGenerator, priority: 0.8, changefreq: "weekly" as const },
  { path: publicRoutes.barcodeGenerator, priority: 0.8, changefreq: "weekly" as const },
  { path: publicRoutes.barcodeReader, priority: 0.8, changefreq: "weekly" as const },
  { path: publicRoutes.passwordGenerator, priority: 0.8, changefreq: "weekly" as const },
  { path: publicRoutes.loremGenerator, priority: 0.8, changefreq: "weekly" as const },
  { path: publicRoutes.emojiPicker, priority: 0.8, changefreq: "weekly" as const },
  { path: publicRoutes.notepad, priority: 0.8, changefreq: "weekly" as const },
  { path: publicRoutes.colorPicker, priority: 0.8, changefreq: "weekly" as const },
  { path: publicRoutes.speedTest, priority: 0.8, changefreq: "weekly" as const },
  { path: publicRoutes.typingSpeed, priority: 0.8, changefreq: "weekly" as const },
  { path: publicRoutes.tools, priority: 0.8, changefreq: "weekly" as const },
  { path: publicRoutes.blog, priority: 0.9, changefreq: "daily" as const },
];

const LOCALES = ["en", "es"] as const;

function localeUrl(base: string, locale: string, slug: string) {
  return `${base}/${locale}${slug === "/" ? "" : slug}`;
}

async function getBlogPosts() {
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.ilovetechtools.com";

  const now = new Date();

  // Expand each static route into one entry per locale
  const staticEntries: MetadataRoute.Sitemap = STATIC_SLUGS.flatMap(
    ({ path, priority, changefreq }) =>
      LOCALES.map((locale) => ({
        url: localeUrl(baseUrl, locale, path),
        lastModified: now,
        priority,
        changefreq,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, localeUrl(baseUrl, l, path)])
          ),
        },
      }))
  );

  // Image tool routes — one entry per locale
  const imageToolEntries: MetadataRoute.Sitemap = IMAGE_TOOLS.flatMap((tool) =>
    LOCALES.map((locale) => ({
      url: localeUrl(baseUrl, locale, tool.route),
      lastModified: now,
      priority: 0.8,
      changefreq: "weekly" as const,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, localeUrl(baseUrl, l, tool.route)])
        ),
      },
    }))
  );

  // PDF tool routes — one entry per locale
  const pdfToolEntries: MetadataRoute.Sitemap = PDF_TOOLS.flatMap((tool) =>
    LOCALES.map((locale) => ({
      url: localeUrl(baseUrl, locale, tool.route),
      lastModified: now,
      priority: 0.8,
      changefreq: "weekly" as const,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, localeUrl(baseUrl, l, tool.route)])
        ),
      },
    }))
  );

  // Blog posts — not localized, keep as-is
  const blogPosts = await getBlogPosts();
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}${post.url}`,
    lastModified: post.lastModified,
    priority: post.priority,
    changefreq: post.changefreq,
  }));

  return [...staticEntries, ...imageToolEntries, ...pdfToolEntries, ...blogEntries];
}
