import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/wifi-qr-code-generator", "WifiQrCodeGenerator");
}

export default function WifiQrCodeGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
