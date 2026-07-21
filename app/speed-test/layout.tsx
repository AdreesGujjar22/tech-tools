import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/speed-test", "speedTest");

export default function SpeedTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
