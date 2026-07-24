import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/pricing", "pricing");
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
