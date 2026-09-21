import type { MetadataRoute } from "next";
import { publicRoutes, supportedLocales } from "../messages";

const baseUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.ilovetechtools.com"
).replace(/\/$/, "");

function stringValue(value: { stringValue?: string; timestampValue?: string } | undefined) {
  return value?.stringValue || value?.timestampValue || "";
}

type BlogEntry = { slug: string; updatedAt?: string };

async function getPublishedBlogs(): Promise<BlogEntry[]> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return [];

  const blogs: BlogEntry[] = [];
  let pageToken = "";

  do {
    const url = new URL(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/blogs`,
    );
    url.searchParams.set("pageSize", "1000");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const response = await fetch(url, { next: { revalidate: 300 } });
    if (!response.ok) return blogs;

    const data = (await response.json()) as {
      documents?: Array<{
        updateTime?: string;
        fields?: {
          slug?: { stringValue?: string };
          status?: { stringValue?: string };
          updatedAt?: { stringValue?: string; timestampValue?: string };
        };
      }>;
      nextPageToken?: string;
    };

    for (const document of data.documents || []) {
      const fields = document.fields;
      if (stringValue(fields?.status) === "published") {
        const slug = stringValue(fields?.slug);
        if (slug) blogs.push({ slug, updatedAt: stringValue(fields?.updatedAt) || document.updateTime });
      }
    }

    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return blogs;
}

function localeUrl(locale: string, path: string) {
  return path === "/" ? `${baseUrl}/${locale}/` : `${baseUrl}/${locale}${path}`;
}

/**
 * One generated sitemap for the whole site.
 *
 * The old public/sitemap.xml shadowed this route (files in /public win over
 * app routes), so the generated URLs - including every blog post - were never
 * served to Google. The static file has been removed and each entry now ships
 * hreflang alternates plus a lastModified date.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = Array.from(new Set(Object.values(publicRoutes) as string[]));
  const now = new Date();

  const languagesFor = (path: string) =>
    Object.fromEntries(supportedLocales.map((locale) => [locale, localeUrl(locale, path)]));

  const routes: MetadataRoute.Sitemap = [];
  for (const path of paths) {
    for (const locale of supportedLocales) {
      routes.push({
        url: localeUrl(locale, path),
        lastModified: now,
        changeFrequency: path === "/" ? "daily" : "weekly",
        priority: path === "/" ? 1 : 0.7,
        alternates: { languages: { ...languagesFor(path), "x-default": localeUrl("en", path) } },
      });
    }
  }

  const blogs = await getPublishedBlogs();
  const blogEntries: MetadataRoute.Sitemap = [];
  for (const blog of blogs) {
    const path = `/blog/${encodeURIComponent(blog.slug)}`;
    for (const locale of supportedLocales) {
      blogEntries.push({
        url: localeUrl(locale, path),
        lastModified: blog.updatedAt ? new Date(blog.updatedAt) : now,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: { languages: { ...languagesFor(path), "x-default": localeUrl("en", path) } },
      });
    }
  }

  const seen = new Set<string>();
  return [...routes, ...blogEntries].filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}
