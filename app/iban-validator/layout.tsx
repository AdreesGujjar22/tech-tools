import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/iban-validator", "IbanValidator");
}

export default function IbanValidatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
