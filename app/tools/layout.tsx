import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/tools", "tools");
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
