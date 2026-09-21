import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/encryption-decryption", "EncryptionDecryption");
}

export default function EncryptionDecryptionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
