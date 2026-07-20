import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/iloveimg", "image");

export default function ILoveImgLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
