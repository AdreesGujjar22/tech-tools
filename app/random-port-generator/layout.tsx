import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/random-port-generator", "RandomPortGenerator");
}

export default function RandomPortGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
