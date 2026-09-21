import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/json-yaml-converter", "JsonYamlConverter");
}

export default function JsonYamlConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
