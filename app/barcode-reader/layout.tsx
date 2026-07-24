import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/barcode-reader", "barcodeReader");
}

export default function BarcodeReaderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
