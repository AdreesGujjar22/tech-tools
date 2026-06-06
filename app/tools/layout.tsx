import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools - Tech Tools Collection",
  description: "Browse all our free online tools including PDF tools, image tools, AI utilities, and productivity solutions.",
  keywords: ["tools", "online tools", "free tools", "utilities"],
  openGraph: {
    title: "Tools - Tech Tools Collection",
    description: "Browse all our free online tools.",
    type: "website",
  },
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
