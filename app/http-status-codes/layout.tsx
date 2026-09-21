import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/http-status-codes", "HttpStatusCodes");
}

export default function HttpStatusCodesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
