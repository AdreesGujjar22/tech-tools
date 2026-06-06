import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Tools - Convert, Merge, Split & Compress PDFs | Tech Tools",
  description: "Free online PDF tools. Merge PDFs, split PDFs, compress PDFs, convert to/from PDF, extract pages, edit PDFs, and more.",
  keywords: ["pdf tools", "merge pdf", "split pdf", "compress pdf", "pdf converter", "pdf to word", "word to pdf", "jpg to pdf"],
  openGraph: {
    title: "PDF Tools - Convert, Merge, Split & Compress PDFs",
    description: "Free online PDF tools for merging, splitting, converting, and compressing PDFs.",
    type: "website",
  },
};

export default function ILovePdfLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
