import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/json-diff", "JsonDiff");
}

export default function JsonDiffLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
