import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/phone-parser", "PhoneParser");
}

export default function PhoneParserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
