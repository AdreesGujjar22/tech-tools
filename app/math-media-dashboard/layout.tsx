import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/math-media-dashboard", "DashboardCategories", "mathMedia");
}

export default function MathMediaDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
