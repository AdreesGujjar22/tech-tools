import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/qr-generator", "qrGenerator");
}

export default function QRGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
