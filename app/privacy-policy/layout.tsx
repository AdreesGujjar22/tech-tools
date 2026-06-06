import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Tech Tools",
  description: "Privacy policy for Tech Tools. Learn how we protect your data and privacy.",
  keywords: ["privacy", "privacy policy", "data protection"],
  openGraph: {
    title: "Privacy Policy - Tech Tools",
    description: "Privacy policy for Tech Tools.",
    type: "website",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
