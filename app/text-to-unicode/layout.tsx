import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/text-to-unicode", "TextToUnicode");
}

export default function TextToUnicodeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
