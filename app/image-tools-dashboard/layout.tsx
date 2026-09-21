import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/image-tools-dashboard", "DashboardCategories", "image");
}

export default function ImageToolsDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
