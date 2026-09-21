import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/crontab-generator", "CrontabGenerator");
}

export default function CrontabGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
