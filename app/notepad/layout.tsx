import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/notepad", "notepad");

export default function NotepadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
