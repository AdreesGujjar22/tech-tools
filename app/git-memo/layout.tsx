import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/git-memo", "GitMemo");
}

export default function GitMemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
