import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/ascii-art-generator", "AsciiArtGenerator");
}

export default function AsciiArtGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
