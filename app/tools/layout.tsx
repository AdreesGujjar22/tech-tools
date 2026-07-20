import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/tools", "tools");

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
