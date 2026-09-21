import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/user-agent-parser", "UserAgentParser");
}

export default function UserAgentParserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
