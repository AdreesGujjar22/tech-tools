import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/password-strength-analyser", "PasswordStrengthAnalyser");
}

export default function PasswordStrengthAnalyserLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
