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

function localizedEntries(
  baseUrl: string,
  path: string,
  priority: number,
  changefreq: "daily" | "weekly" | "monthly" | "yearly",
  lastModified: Date
): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${baseUrl}/${locale}${path === "/" ? "" : path}`,
    lastModified,
    priority,
    changefreq,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((alternateLocale) => [
          alternateLocale,
          `${baseUrl}/${alternateLocale}${path === "/" ? "" : path}`,
        ])
      ),
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.ilovetechtools.com"
  ).replace(/\/$/, "");
  const lastModified = new Date();

  return [
    ...STATIC_SLUGS.flatMap(({ path, priority, changefreq }) =>
      localizedEntries(baseUrl, path, priority, changefreq, lastModified)
    ),
    ...IMAGE_TOOLS.flatMap(({ route }) =>
      localizedEntries(baseUrl, route, 0.8, "weekly", lastModified)
    ),
    ...PDF_TOOLS.flatMap(({ route }) =>
      localizedEntries(baseUrl, route, 0.8, "weekly", lastModified)
    ),
  ];
}
