import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/base64-file-converter", "Base64FileConverter");
}

export default function Base64FileConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
