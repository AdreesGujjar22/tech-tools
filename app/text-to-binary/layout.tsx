import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/text-to-binary", "TextToBinary");
}

export default function TextToBinaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
