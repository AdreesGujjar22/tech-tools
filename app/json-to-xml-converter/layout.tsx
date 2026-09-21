import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/json-to-xml-converter", "JsonToXmlConverter");
}

export default function JsonToXmlConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
