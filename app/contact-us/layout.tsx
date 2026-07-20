import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/contact-us", "contact");

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
