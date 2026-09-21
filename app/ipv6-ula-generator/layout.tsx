import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/ipv6-ula-generator", "Ipv6UlaGenerator");
}

export default function Ipv6UlaGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
