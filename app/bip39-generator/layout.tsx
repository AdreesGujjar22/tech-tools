import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/bip39-generator", "Bip39Generator");
}

export default function Bip39GeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
