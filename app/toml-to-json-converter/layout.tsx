import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/toml-to-json-converter", "TomlToJsonConverter");
}

export default function TomlToJsonConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
