import { DASHBOARD_CATEGORIES, allDashboardTools } from "@/lib/dashboards-config";

export const revalidate = 3600;

const locales = ["de", "en", "es", "fr", "id", "it", "nl", "pt", "tr"] as const;
const staticPages = [
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

const escapeXml = (value: string) =>
  value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[character] ?? character);

export function GET() {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.ilovetechtools.com").replace(/\/$/, "");
  const lastModified = new Date().toISOString();
  const uniquePaths = new Map<string, { priority: number; changeFrequency: string }>();

  staticPages.forEach((page) => uniquePaths.set(page.path, page));
  DASHBOARD_CATEGORIES.forEach((category) => {
    uniquePaths.set(`/${category.slug}`, { priority: 0.8, changeFrequency: "weekly" });
  });
  allDashboardTools.forEach((tool) => {
    if (!uniquePaths.has(tool.route)) {
      uniquePaths.set(tool.route, { priority: 0.7, changeFrequency: "weekly" });
    }
  });

  const urls = [...uniquePaths].flatMap(([path, metadata]) => {
    const slug = path === "/" ? "" : path;
    const alternates = locales
      .map((locale) => `      <xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(`${baseUrl}/${locale}${slug}`)}" />`)
      .concat(`      <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${baseUrl}/en${slug}`)}" />`)
      .join("\n");

    return locales.map((locale) => `    <url>
      <loc>${escapeXml(`${baseUrl}/${locale}${slug}`)}</loc>
      <lastmod>${lastModified}</lastmod>
      <changefreq>${metadata.changeFrequency}</changefreq>
      <priority>${metadata.priority}</priority>
${alternates}
    </url>`);
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
