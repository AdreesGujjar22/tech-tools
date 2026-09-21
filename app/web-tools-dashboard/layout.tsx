import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/web-tools-dashboard", "DashboardCategories", "web");
}

export default function WebToolsDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
