import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Tech Tools",
  description: "Learn about Tech Tools, our mission to provide free online tools for PDF, image, AI utilities, and productivity solutions.",
  keywords: ["about us", "about tech tools", "mission", "vision"],
  openGraph: {
    title: "About Us - Tech Tools",
    description: "Learn about Tech Tools and our mission.",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
