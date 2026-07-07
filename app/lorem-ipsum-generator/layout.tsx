import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator - Tech Tools",
  description: "Free Lorem Ipsum generator. Create placeholder text for your designs, mockups, and prototypes instantly.",
  keywords: ["lorem ipsum", "lorem ipsum generator", "placeholder text", "dummy text", "filler text"],
  openGraph: {
    title: "Lorem Ipsum Generator - Tech Tools",
    description: "Generate Lorem Ipsum text instantly.",
    type: "website",
  },
};

export default function LoremIpsumGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
