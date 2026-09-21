import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/eta-calculator", "EtaCalculator");
}

export default function EtaCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
