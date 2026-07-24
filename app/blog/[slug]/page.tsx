import { BlogPostReader } from "./BlogPostReader";

import type { Metadata } from "next";
import { getLocalizedAlternates } from "@/lib/server-locale";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: "Tech Tools Blog",
    description: "Articles, tutorials, and guides from Tech Tools.",
    alternates: await getLocalizedAlternates(`/blog/${slug}`),
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <BlogPostReader slug={slug} />;
}
