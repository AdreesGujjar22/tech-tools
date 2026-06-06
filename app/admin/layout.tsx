import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Tech Tools",
  description: "Admin dashboard for managing Tech Tools.",
  keywords: ["admin", "dashboard", "management"],
  openGraph: {
    title: "Admin Dashboard - Tech Tools",
    description: "Admin dashboard.",
    type: "website",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
