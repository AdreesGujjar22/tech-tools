import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/xml-formatter", "XmlFormatter");
}

export default function XmlFormatterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
