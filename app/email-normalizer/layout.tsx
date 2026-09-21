import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/email-normalizer", "EmailNormalizer");
}

export default function EmailNormalizerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
