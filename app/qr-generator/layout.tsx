import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/qr-generator", "qrGenerator");

export default function QRGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
