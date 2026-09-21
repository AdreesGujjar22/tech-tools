import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/text-statistics", "TextStatistics");
}

export default function TextStatisticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
