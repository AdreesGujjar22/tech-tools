import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/list-converter", "ListConverter");
}

export default function ListConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
