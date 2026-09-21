import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/benchmark-builder", "BenchmarkBuilder");
}

export default function BenchmarkBuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
