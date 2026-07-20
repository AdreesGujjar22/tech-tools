import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/barcode-generator", "barcodeGenerator");

export default function BarcodeGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
