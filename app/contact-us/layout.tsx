import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Tech Tools",
  description: "Get in touch with Tech Tools. We're here to help with any questions about our PDF, image, AI tools, and services.",
  keywords: ["contact", "contact us", "support", "help"],
  openGraph: {
    title: "Contact Us - Tech Tools",
    description: "Get in touch with Tech Tools support team.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
