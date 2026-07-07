import { MetadataRoute } from "next";
import { IMAGE_TOOLS } from "@/components/image-tools/toolsData";
import { PDF_TOOLS } from "@/components/pdf-tools/toolsData";

// Static pages that should always be in the sitemap
const STATIC_ROUTES = [
  { url: "/", priority: 1.0, changefreq: "daily" as const },
  { url: "/about-us", priority: 0.9, changefreq: "monthly" as const },
  { url: "/contact-us", priority: 0.8, changefreq: "yearly" as const },
  { url: "/pricing", priority: 0.8, changefreq: "monthly" as const },
  { url: "/help", priority: 0.7, changefreq: "monthly" as const },
  { url: "/privacy-policy", priority: 0.7, changefreq: "yearly" as const },
  { url: "/terms-and-conditions", priority: 0.7, changefreq: "yearly" as const },
  { url: "/iloveimg", priority: 0.9, changefreq: "weekly" as const },
  { url: "/ilovepdf", priority: 0.9, changefreq: "weekly" as const },
  { url: "/qr-generator", priority: 0.8, changefreq: "weekly" as const },
  { url: "/barcode-generator", priority: 0.8, changefreq: "weekly" as const },
  { url: "/color-picker", priority: 0.8, changefreq: "weekly" as const },
  { url: "/speed-test", priority: 0.8, changefreq: "weekly" as const },
  { url: "/typing-speed", priority: 0.8, changefreq: "weekly" as const },
  { url: "/tools", priority: 0.8, changefreq: "weekly" as const },
  { url: "/blog", priority: 0.9, changefreq: "daily" as const },
];

async function getBlogPosts() {
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techtools.example.com";

  // Image tools routes
  const imageToolRoutes = IMAGE_TOOLS.map((tool) => ({
    url: `${baseUrl}${tool.route}`,
    lastModified: new Date(),
    priority: 0.8,
    changefreq: "weekly" as const,
  }));

  // PDF tools routes
  const pdfToolRoutes = PDF_TOOLS.map((tool) => ({
    url: `${baseUrl}${tool.route}`,
    lastModified: new Date(),
    priority: 0.8,
    changefreq: "weekly" as const,
  }));

  // Fetch blog posts dynamically
  const blogPosts = await getBlogPosts();
  const blogPostRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}${post.url}`,
    lastModified: post.lastModified,
    priority: post.priority,
    changefreq: post.changefreq,
  }));

  // Static routes
  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    priority: route.priority,
    changefreq: route.changefreq,
  }));

  return [...staticRoutes, ...imageToolRoutes, ...pdfToolRoutes, ...blogPostRoutes];
}
