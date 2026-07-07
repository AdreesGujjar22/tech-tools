import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barcode Generator - Tech Tools",
  description: "Free barcode generator. Create barcodes for CODE128, CODE39, EAN13, UPC, and more. Instant download and customization.",
  keywords: ["barcode", "barcode generator", "barcode maker", "CODE128", "EAN13", "UPC"],
  openGraph: {
    title: "Barcode Generator - Tech Tools",
    description: "Create barcodes instantly for free.",
    type: "website",
  },
};

export default function BarcodeGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
