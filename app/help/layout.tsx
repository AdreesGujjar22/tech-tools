import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & Support - Tech Tools",
  description: "Get help and support for using Tech Tools. Find FAQs, guides, and troubleshooting information.",
  keywords: ["help", "support", "faq", "documentation"],
  openGraph: {
    title: "Help & Support - Tech Tools",
    description: "Get help and support for using Tech Tools.",
    type: "website",
  },
};

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
