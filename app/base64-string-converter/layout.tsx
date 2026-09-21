import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/base64-string-converter", "Base64StringConverter");
}

export default function Base64StringConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
