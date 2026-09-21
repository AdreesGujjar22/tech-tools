import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/html-wysiwyg-editor", "HtmlWysiwygEditor");
}

export default function HtmlWysiwygEditorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
