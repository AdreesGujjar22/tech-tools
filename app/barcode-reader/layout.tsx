import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/barcode-reader", "barcodeReader");

export default function BarcodeReaderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
