import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/slugify-string", "SlugifyString");
}

export default function SlugifyStringLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
