import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/sql-prettify", "SqlPrettify");
}

export default function SqlPrettifyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
