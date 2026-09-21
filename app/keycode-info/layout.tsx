import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/keycode-info", "KeycodeInfo");
}

export default function KeycodeInfoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
