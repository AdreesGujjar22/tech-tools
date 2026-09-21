import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/roman-numeral-converter", "RomanNumeralConverter");
}

export default function RomanNumeralConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
