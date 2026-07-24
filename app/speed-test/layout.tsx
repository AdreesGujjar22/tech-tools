import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/speed-test", "speedTest");
}

export default function SpeedTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
