import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/device-information", "DeviceInformation");
}

export default function DeviceInformationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
