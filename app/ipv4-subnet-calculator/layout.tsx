import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/ipv4-subnet-calculator", "Ipv4SubnetCalculator");
}

export default function Ipv4SubnetCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
