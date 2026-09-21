import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/color-converter", "ColorConverter");
}

export default function ColorConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
