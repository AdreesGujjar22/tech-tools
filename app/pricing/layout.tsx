import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/pricing", "pricing");

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
