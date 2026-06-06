import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typing Speed Test - Tech Tools",
  description: "Test your typing speed and improve your WPM. Free online typing test with accuracy tracking and results.",
  keywords: ["typing speed", "typing test", "wpm", "typing", "keyboard test"],
  openGraph: {
    title: "Typing Speed Test - Tech Tools",
    description: "Test your typing speed and track improvements.",
    type: "website",
  },
};

export default function TypingSpeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
