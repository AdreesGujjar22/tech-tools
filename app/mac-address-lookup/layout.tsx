import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/mac-address-lookup", "MacAddressLookup");
}

export default function MacAddressLookupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
