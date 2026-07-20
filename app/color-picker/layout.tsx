import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/color-picker", "colorPicker");

export default function ColorPickerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
