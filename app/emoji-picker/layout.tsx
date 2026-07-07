import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emoji Picker & Copier - Tech Tools",
  description: "Browse and copy emojis easily. Find the perfect emoji for your messages, posts, and social media.",
  keywords: ["emoji picker", "emoji copier", "emoji search", "emojis", "emoticons"],
  openGraph: {
    title: "Emoji Picker & Copier - Tech Tools",
    description: "Browse and copy emojis instantly.",
    type: "website",
  },
};

export default function EmojiPickerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
