import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Tech Tools",
  description: "Terms and conditions for using Tech Tools. Please read carefully.",
  keywords: ["terms", "conditions", "terms of service", "tos"],
  openGraph: {
    title: "Terms & Conditions - Tech Tools",
    description: "Terms and conditions for Tech Tools.",
    type: "website",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
