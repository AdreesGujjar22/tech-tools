import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/terms-and-conditions", "terms");

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
