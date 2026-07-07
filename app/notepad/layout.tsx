import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online NotePad - Tech Tools",
  description: "Free online notepad with auto-save, file download/upload, and real-time word/character counting.",
  keywords: ["notepad", "online notepad", "text editor", "note taking", "online text editor"],
  openGraph: {
    title: "Online NotePad - Tech Tools",
    description: "Simple, fast online notepad with auto-save.",
    type: "website",
  },
};

export default function NotePadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
