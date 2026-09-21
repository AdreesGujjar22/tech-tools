import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/json-to-toml-converter", "JsonToTomlConverter");
}

export default function JsonToTomlConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
