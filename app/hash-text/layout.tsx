import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/hash-text", "HashText");
}

export default function HashTextLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
