import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/jwt-parser", "JwtParser");
}

export default function JwtParserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
