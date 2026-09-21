import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/integer-base-converter", "IntegerBaseConverter");
}

export default function IntegerBaseConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
