import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/otp-generator", "OtpGenerator");
}

export default function OtpGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
