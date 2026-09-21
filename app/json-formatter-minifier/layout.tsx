import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/json-formatter-minifier", "JsonFormatterMinifier");
}

export default function JsonFormatterMinifierLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
