import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/help", "help");

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
