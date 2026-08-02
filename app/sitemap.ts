import type { MetadataRoute } from "next";
import { DASHBOARD_CATEGORIES, allDashboardTools } from "@/lib/dashboards-config";

export const revalidate = 3600;

const locales = ["de", "en", "es", "fr", "id", "it", "nl", "pt", "tr"] as const;

const STATIC_PAGES = [
  { path: "/", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/about-us", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact-us", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/pricing", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/help", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/privacy-policy", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/terms-and-conditions", priority: 0.7, changeFrequency: "yearly" as const },
  { path: "/iloveimg", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/ilovepdf", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/qr-generator", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/barcode-generator", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/barcode-reader", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/password-generator", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/lorem-ipsum-generator", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/emoji-picker", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/notepad", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/color-picker", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/speed-test", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/typing-speed", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/tools", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.ilovetechtools.com").replace(/\/$/, "");
  const lastModified = new Date();

  // Deduplicate all unique routes across dashboard categories, dashboard tools, and static pages
  const uniquePathsMap = new Map<string, { priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" }>();

  STATIC_PAGES.forEach((item) => {
    uniquePathsMap.set(item.path, { priority: item.priority, changeFrequency: item.changeFrequency });
  });

  DASHBOARD_CATEGORIES.forEach((cat) => {
    uniquePathsMap.set(`/${cat.slug}`, { priority: 0.8, changeFrequency: "weekly" });
  });

  allDashboardTools.forEach((tool) => {
    if (!uniquePathsMap.has(tool.route)) {
      uniquePathsMap.set(tool.route, { priority: 0.7, changeFrequency: "weekly" });
    }
  });

  const allEntries: MetadataRoute.Sitemap = [];

  uniquePathsMap.forEach(({ priority, changeFrequency }, path) => {
    const slug = path === "/" ? "" : path;

    // Generate language alternates map
    const languages: Record<string, string> = {};
    locales.forEach((loc) => {
      languages[loc] = `${baseUrl}/${loc}${slug}`;
    });
    languages["x-default"] = `${baseUrl}/en${slug}`;

    locales.forEach((loc) => {
      allEntries.push({
        url: `${baseUrl}/${loc}${slug}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages,
        },
      });
    });
  });

  return allEntries;
}
