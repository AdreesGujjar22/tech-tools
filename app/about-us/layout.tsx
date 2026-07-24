import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/about-us", "about");
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
