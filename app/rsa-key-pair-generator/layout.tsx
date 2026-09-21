import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/rsa-key-pair-generator", "RsaKeyPairGenerator");
}

export default function RsaKeyPairGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
