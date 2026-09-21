import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/crypto-security-dashboard", "DashboardCategories", "cryptoSecurity");
}

export default function CryptoSecurityDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
