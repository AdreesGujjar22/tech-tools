import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/contact-us", "contact");
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
