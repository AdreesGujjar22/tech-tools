import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/terms-and-conditions", "terms");
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
