import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/yaml-prettify", "YamlPrettify");
}

export default function YamlPrettifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
