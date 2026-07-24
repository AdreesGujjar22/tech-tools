import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/iloveimg", "image");
}

export default function ILoveImgLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
