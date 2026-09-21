import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/text-to-nato-alphabet", "TextToNatoAlphabet");
}

export default function TextToNatoAlphabetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
