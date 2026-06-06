import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Picker - Tech Tools",
  description: "Free online color picker tool. Extract colors from images, generate color palettes, and convert between color formats.",
  keywords: ["color picker", "color converter", "color palette", "hex color", "rgb color"],
  openGraph: {
    title: "Color Picker - Tech Tools",
    description: "Free online color picker and palette generator.",
    type: "website",
  },
};

export default function ColorPickerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
