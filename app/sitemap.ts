import type { MetadataRoute } from "next";
import { readFile } from "node:fs/promises";
import { publicRoutes } from "../messages";

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.ilovetechtools.com"
).replace(/\/$/, "");

function stringValue(value: { stringValue?: string } | undefined) {
  return value?.stringValue || "";
}

async function getPublishedBlogSlugs() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return [];

  const slugs: string[] = [];
  let pageToken = "";

  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/blogs`,
    );
    url.searchParams.set("pageSize", "1000");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) return slugs;

    const data = (await response.json()) as {
      documents?: Array<{
        fields?: {
          slug?: { stringValue?: string };
          status?: { stringValue?: string };
        };
      }>;
      nextPageToken?: string;
    };

    for (const document of data.documents || []) {
      const fields = document.fields;
      if (stringValue(fields?.status) === "published") {
        const slug = stringValue(fields?.slug);
        if (slug) slugs.push(slug);
      }
    }

    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticSitemap = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8").catch(() => "");
  const staticUrls = [...staticSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const routeUrls = [...new Set([
    ...staticUrls,
    ...Object.values(publicRoutes).map((path) => `${baseUrl}${path === "/" ? "/" : path}`),
  ])];
  const routes = routeUrls.map((url) => ({
    url,
    changeFrequency: "weekly" as const,
    priority: url === `${baseUrl}/` ? 0.8 : 0.6,
  }));

  const blogSlugs = await getPublishedBlogSlugs();
  const blogs = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${encodeURIComponent(slug)}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...blogs.filter((blog) => !routeUrls.includes(blog.url))];
}
