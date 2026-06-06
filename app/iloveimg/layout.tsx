import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Tools - Compress, Convert & Edit Images | Tech Tools",
  description: "Free online image tools. Compress images, convert formats (JPG, PNG, WebP), resize, crop, rotate, remove background, and more.",
  keywords: ["image tools", "compress image", "image converter", "resize image", "crop image", "image editor", "jpg to png", "png to jpg"],
  openGraph: {
    title: "Image Tools - Compress, Convert & Edit Images",
    description: "Free online image compression, conversion, and editing tools.",
    type: "website",
  },
};

export default function ILoveImgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
