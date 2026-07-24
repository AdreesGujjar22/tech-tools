import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/help", "help");
}

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
