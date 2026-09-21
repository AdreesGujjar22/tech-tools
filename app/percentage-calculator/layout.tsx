import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/percentage-calculator", "PercentageCalculator");
}

export default function PercentageCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
