import type { MetadataRoute } from "next";
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
  const routes = Object.values(publicRoutes).map((path) => ({
    url: `${baseUrl}${path === "/" ? "/" : path}`,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 0.8 : 0.6,
  }));

  const blogSlugs = await getPublishedBlogSlugs();
  const blogs = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${encodeURIComponent(slug)}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...blogs];
}
