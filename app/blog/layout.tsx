import React from "react";
import type { Metadata } from "next";
import { getLocalizedAlternates, getRequestLocale } from "@/lib/server-locale";
import { loadMessages } from "../../messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const loaded = await loadMessages(locale, ["meta"]);
  const blog = (loaded.Metadata as Record<string, { title: string; description: string; keywords: string }>).blog;
  const title = blog.title;
  const description = blog.description;

  return {
    title,
    description,
    keywords: blog.keywords,
    alternates: await getLocalizedAlternates("/blog"),
    openGraph: {
      title,
      description,
      type: "website",
      url: (await getLocalizedAlternates("/blog")).canonical,
      images: [{ url: "/images/web-logo.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/web-logo.png"],
    },
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
