import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/case-converter", "CaseConverter");
}

export default function CaseConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
