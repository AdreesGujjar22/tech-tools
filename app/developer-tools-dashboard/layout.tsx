import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/developer-tools-dashboard", "DashboardCategories", "developer");
}

export default function DeveloperToolsDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
