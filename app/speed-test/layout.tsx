import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speed Test - Tech Tools",
  description: "Test your internet speed with Tech Tools. Check download, upload speed, and ping in seconds.",
  keywords: ["speed test", "internet speed", "connection test", "bandwidth test", "ping"],
  openGraph: {
    title: "Speed Test - Tech Tools",
    description: "Test your internet speed instantly.",
    type: "website",
  },
};

export default function SpeedTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
