import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/typing-speed", "typingSpeed");
}

export default function TypingSpeedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
