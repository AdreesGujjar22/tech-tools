import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/privacy-policy", "privacy");

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
