import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Tech Tools",
  description: "Explore our pricing plans. Most of our tools are completely free, with premium options available.",
  keywords: ["pricing", "plans", "premium", "subscriptions"],
  openGraph: {
    title: "Pricing - Tech Tools",
    description: "Explore our pricing plans.",
    type: "website",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
