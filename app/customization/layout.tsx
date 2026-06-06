import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customization - Tech Tools",
  description: "Customize your Tech Tools experience. Adjust settings, themes, and preferences.",
  keywords: ["customization", "settings", "preferences", "themes"],
  openGraph: {
    title: "Customization - Tech Tools",
    description: "Customize your Tech Tools experience.",
    type: "website",
  },
};

export default function CustomizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
