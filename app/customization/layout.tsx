import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/customization", "customization");
}

export default function CustomizationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
