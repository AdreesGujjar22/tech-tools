import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/og-meta-generator", "OgMetaGenerator");
}

export default function OgMetaGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
