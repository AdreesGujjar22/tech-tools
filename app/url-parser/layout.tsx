import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/url-parser", "UrlParser");
}

export default function UrlParserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
