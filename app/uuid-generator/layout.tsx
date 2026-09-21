import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/uuid-generator", "UuidGenerator");
}

export default function UuidGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
