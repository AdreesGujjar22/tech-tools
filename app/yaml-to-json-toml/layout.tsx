import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/yaml-to-json-toml", "YamlToJsonToml");
}

export default function YamlToJsonTomlLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
