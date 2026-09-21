import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/ipv4-range-expander", "Ipv4RangeExpander");
}

export default function Ipv4RangeExpanderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
