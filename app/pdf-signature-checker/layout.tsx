import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/pdf-signature-checker", "PdfSignatureChecker");
}

export default function PdfSignatureCheckerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
