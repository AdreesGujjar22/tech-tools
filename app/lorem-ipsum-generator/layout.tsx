import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/lorem-ipsum-generator", "loremGenerator");
}

export default function LoremIpsumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
