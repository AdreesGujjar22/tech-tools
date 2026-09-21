import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/numeronym-generator", "NumeronymGenerator");
}

export default function NumeronymGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
