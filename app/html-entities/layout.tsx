import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/html-entities", "HtmlEntities");
}

export default function HtmlEntitiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
