import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/text-data-dashboard", "DashboardCategories", "textData");
}

export default function TextDataDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
