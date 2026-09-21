import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/token-generator", "TokenGenerator");
}

export default function TokenGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
