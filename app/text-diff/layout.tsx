import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/text-diff", "TextDiff");
}

export default function TextDiffLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
