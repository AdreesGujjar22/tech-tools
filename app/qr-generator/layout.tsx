import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator - Tech Tools",
  description: "Free QR code generator. Create QR codes for URLs, text, vCard, WiFi, and more. Instant download and customization.",
  keywords: ["qr code", "qr code generator", "qr generator", "barcode", "code generator"],
  openGraph: {
    title: "QR Code Generator - Tech Tools",
    description: "Create QR codes instantly for free.",
    type: "website",
  },
};

export default function QRGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
