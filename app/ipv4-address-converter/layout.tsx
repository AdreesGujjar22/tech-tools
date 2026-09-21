import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/ipv4-address-converter", "Ipv4AddressConverter");
}

export default function Ipv4AddressConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
