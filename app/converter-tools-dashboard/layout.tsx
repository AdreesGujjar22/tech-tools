import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/converter-tools-dashboard", "DashboardCategories", "converters");
}

export default function ConverterToolsDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
