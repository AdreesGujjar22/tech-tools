import { BlogPostReader } from "./BlogPostReader";

import type { Metadata } from "next";
import { getLocalizedAlternates, getRequestLocale } from "@/lib/server-locale";
import { messages } from "../../../messages";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getRequestLocale();
  const blog = messages[locale].Blog;
  const alternates = await getLocalizedAlternates(`/blog/${slug}`);
  const title = blog.title;
  const description = blog.description;

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      type: "article" as const,
      url: alternates.canonical,
      images: [{ url: "/images/web-logo.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: ["/images/web-logo.png"],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <BlogPostReader slug={slug} />;
}
