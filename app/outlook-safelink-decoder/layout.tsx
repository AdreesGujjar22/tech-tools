import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/outlook-safelink-decoder", "OutlookSafelinkDecoder");
}

export default function OutlookSafelinkDecoderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
