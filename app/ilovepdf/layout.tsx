import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/ilovepdf", "pdf");

export default function ILovePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
