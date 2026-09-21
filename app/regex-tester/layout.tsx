import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/regex-tester", "RegexTester");
}

export default function RegexTesterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
