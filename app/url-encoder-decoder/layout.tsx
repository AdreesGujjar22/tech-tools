import type { Metadata } from "next";
import { buildToolMetadata } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  return buildToolMetadata("/url-encoder-decoder", "UrlEncoderDecoder");
}

export default function UrlEncoderDecoderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
