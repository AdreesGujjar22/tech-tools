import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/customization", "customization");

export default function CustomizationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
