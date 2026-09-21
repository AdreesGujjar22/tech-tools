import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/mime-types", "MimeTypes");
}

export default function MimeTypesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
