import type { MetadataRoute } from "next";
import { IMAGE_TOOLS } from "@/components/image-tools/toolsData";
import { PDF_TOOLS } from "@/components/pdf-tools/toolsData";

export const revalidate = 3600;

const STATIC_ROUTES = [
  { url: "/", priority: 1.0, changeFrequency: "daily" as const },
  { url: "/about-us", priority: 0.9, changeFrequency: "monthly" as const },
  { url: "/contact-us", priority: 0.8, changeFrequency: "yearly" as const },
  { url: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
  { url: "/help", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/privacy-policy", priority: 0.7, changeFrequency: "yearly" as const },
  { url: "/terms-and-conditions", priority: 0.7, changeFrequency: "yearly" as const },
  { url: "/iloveimg", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/ilovepdf", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/qr-generator", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/barcode-generator", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/barcode-reader", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/password-generator", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/lorem-ipsum-generator", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/emoji-picker", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/notepad", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/color-picker", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/speed-test", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/typing-speed", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/tools", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/blog", priority: 0.9, changeFrequency: "daily" as const },
];

type FirestoreBlogDocument = {
  fields?: {
    slug?: { stringValue?: string };
    status?: { stringValue?: string };
    updatedAt?: { timestampValue?: string };
    createdAt?: { timestampValue?: string };
  };
};

async function getBlogPosts() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!projectId || !apiKey) return [];

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/blogs?key=${apiKey}`,
      { next: { revalidate } },
    );

    if (!response.ok) return [];

    const { documents = [] } = (await response.json()) as { documents?: FirestoreBlogDocument[] };

    return documents.flatMap(({ fields }) => {
      const slug = fields?.slug?.stringValue;
      if (!slug || fields?.status?.stringValue !== "published") return [];

      const lastModified = fields.updatedAt?.timestampValue ?? fields.createdAt?.timestampValue;
      return [{ url: `/blog/${slug}`, lastModified: lastModified ? new Date(lastModified) : new Date() }];
    });
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.ilovetechtools.com").replace(/\/$/, "");
  const lastModified = new Date();

  const imageToolRoutes = IMAGE_TOOLS.map((tool) => ({
    url: `${baseUrl}${tool.route}`,
    lastModified,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }));

  const pdfToolRoutes = PDF_TOOLS.map((tool) => ({
    url: `${baseUrl}${tool.route}`,
    lastModified,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }));

  const blogPostRoutes = (await getBlogPosts()).map((post) => ({
    url: `${baseUrl}${post.url}`,
    lastModified: post.lastModified,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const staticRoutes = STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified,
    priority: route.priority,
    changeFrequency: route.changeFrequency,
  }));

  const routes = [...staticRoutes, ...imageToolRoutes, ...pdfToolRoutes, ...blogPostRoutes];
  const localizedRoutes = ["en", "es", "pt"].flatMap((locale) =>
    routes.map((route) => ({
      ...route,
      url: `${baseUrl}/${locale}${route.url.slice(baseUrl.length)}`,
    })),
  );

  return localizedRoutes;
}
