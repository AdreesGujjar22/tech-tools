import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/markdown-to-html", "MarkdownToHtml");
}

export default function MarkdownToHtmlLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
