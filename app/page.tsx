"use client";

import type { Metadata } from "next";
import Index from "@/pages/Index";
import { getRequestLocale } from "@/lib/server-locale";
import { loadMessages } from "../messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const loaded = await loadMessages(locale, ["meta"]);
  const home = (loaded.Metadata as Record<string, { title: string; description: string; keywords: string }>).home;

  return {
    title: home.title,
    description: home.description,
    keywords: home.keywords,
  };
}

export default function Page() {
  return <Index />;
}
