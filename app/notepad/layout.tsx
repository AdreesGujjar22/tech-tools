import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("/notepad", "notepad");
}

export default function NotepadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
