import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/emoji-picker", "emojiPicker");

export default function EmojiPickerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
