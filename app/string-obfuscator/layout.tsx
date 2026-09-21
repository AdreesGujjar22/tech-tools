import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/string-obfuscator", "StringObfuscator");
}

export default function StringObfuscatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
