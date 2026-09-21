import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/temperature-converter", "TemperatureConverter");
}

export default function TemperatureConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
