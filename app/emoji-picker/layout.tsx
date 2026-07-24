import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/emoji-picker", "emojiPicker");
}

export default function EmojiPickerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
