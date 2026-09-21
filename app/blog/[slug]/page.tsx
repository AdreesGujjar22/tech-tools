import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPostReader } from "./BlogPostReader";
import { getLocalizedAlternates } from "@/lib/server-locale";
import { getBlogBySlug, toPlainText } from "@/lib/blog-server";

const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.ilovetechtools.com"
).replace(/\/$/, "");

const DEFAULT_OG_IMAGE = "/images/og-default.png";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  const alternates = await getLocalizedAlternates(`/blog/${slug}`);

  // Unknown slug: keep it out of the index instead of serving a generic page.
  if (!post) {
    return {
      title: "Article not found | Tech Tools",
      description: "This article is no longer available.",
      robots: { index: false, follow: true },
      alternates,
    };
  }

  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription || post.excerpt || toPlainText(post.content) || "Guides and tutorials from Tech Tools.";
  const image = post.featuredImage || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    keywords: post.seoKeywords || post.tags?.join(", "),
    alternates,
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: alternates.canonical,
      publishedTime: post.createdAt || undefined,
      modifiedTime: post.updatedAt || post.createdAt || undefined,
      tags: post.tags,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  // A missing article must answer 404, not a 200 "not found" page (soft 404).
  if (!post) notFound();

  const alternates = await getLocalizedAlternates(`/blog/${slug}`);
  const description =
    post.seoDescription || post.excerpt || toPlainText(post.content) || "Guides and tutorials from Tech Tools.";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle || post.title,
    description,
    image: [post.featuredImage || `${BASE_URL}${DEFAULT_OG_IMAGE}`],
    datePublished: post.createdAt || undefined,
    dateModified: post.updatedAt || post.createdAt || undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": alternates.canonical },
    author: { "@type": "Organization", name: "Tech Tools", url: BASE_URL },
    publisher: {
      "@type": "Organization",
      name: "Tech Tools",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/images/web-logo.png` },
    },
    keywords: post.seoKeywords || post.tags?.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* initialPost ships the article inside the server-rendered HTML so
          crawlers index the real content instead of a loading spinner. */}
      <BlogPostReader slug={slug} initialPost={post} />
    </>
  );
}
