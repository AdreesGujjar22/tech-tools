import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/server-locale";

export const metadata: Metadata = buildPageMetadata("/password-generator", "passwordGenerator");

export default function PasswordGeneratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
