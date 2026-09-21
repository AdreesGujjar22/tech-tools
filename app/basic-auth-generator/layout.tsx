import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/basic-auth-generator", "BasicAuthGenerator");
}

export default function BasicAuthGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
