import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/barcode-generator", "barcodeGenerator");
}

export default function BarcodeGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
