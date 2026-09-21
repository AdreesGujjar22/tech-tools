import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/pdf-tools-dashboard", "DashboardCategories", "pdf");
}

export default function PdfToolsDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
