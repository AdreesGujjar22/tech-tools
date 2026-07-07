import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Generator - Tech Tools",
  description: "Free password generator. Create strong, random passwords with customizable character types and length.",
  keywords: ["password generator", "strong password", "random password", "password maker", "secure password"],
  openGraph: {
    title: "Password Generator - Tech Tools",
    description: "Generate strong passwords instantly.",
    type: "website",
  },
};

export default function PasswordGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
