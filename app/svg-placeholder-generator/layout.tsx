import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/svg-placeholder-generator", "SvgPlaceholderGenerator");
}

export default function SvgPlaceholderGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
