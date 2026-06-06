import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Tech Tools Articles & Guides",
  description: "Read articles, tutorials, and guides about PDF tools, image editing, AI utilities, and online productivity solutions.",
  keywords: ["blog", "articles", "guides", "tutorials", "tech tools blog"],
  openGraph: {
    title: "Blog - Tech Tools Articles & Guides",
    description: "Read articles, tutorials, and guides about PDF tools, image editing, AI utilities, and online productivity solutions.",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
