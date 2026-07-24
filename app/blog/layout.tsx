import React from "react";
import type { Metadata } from "next";
import { getLocalizedAlternates } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Blog - Tech Tools Articles & Guides";
  const description = "Read articles, tutorials, and guides about PDF tools, image editing, AI utilities, and online productivity solutions.";

  return {
    title,
    description,
    keywords: ["blog", "articles", "guides", "tutorials", "tech tools blog"],
    alternates: await getLocalizedAlternates("/blog"),
    openGraph: {
      title,
      description,
      type: "website",
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
