import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/typing-speed", "typingSpeed");

export default function TypingSpeedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
