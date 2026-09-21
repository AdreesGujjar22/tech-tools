import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/chmod-calculator", "ChmodCalculator");
}

export default function ChmodCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
