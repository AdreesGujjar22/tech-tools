import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/network-tools-dashboard", "DashboardCategories", "network");
}

export default function NetworkToolsDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
