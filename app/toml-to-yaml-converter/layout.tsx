import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/toml-to-yaml-converter", "TomlToYamlConverter");
}

export default function TomlToYamlConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
