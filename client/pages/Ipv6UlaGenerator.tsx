"use client";
import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import SEO from "@/components/SEO";
import { generateIpv6Ula } from "@/lib/net-dev-2";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function Ipv6UlaGenerator() { const t = useTranslations("Tools.Ipv6UlaGenerator");
  const faqs = getFaqsForRoute("ipv6-ula-generator"); const [result, setResult] = useState(generateIpv6Ula); const copy = (value: string) => void navigator.clipboard.writeText(value); const rows = [[t("prefix"), result.prefix], [t("firstSubnet"), result.firstSubnet], [t("lastSubnet"), result.lastSubnet]]; return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="IPv6 ULA RFC 4193 generator" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><div className="rounded-xl bg-[#F4F7F4] p-5"><p className="text-sm text-[#4A6857]">{t("globalId")}: <code className="font-bold text-[#2D4D35]">{result.globalId}</code></p><p className="mt-1 text-sm text-[#4A6857]">{t("subnetId")}: <code className="font-bold text-[#2D4D35]">{result.subnetId}</code></p></div><div className="mt-6 space-y-3">{rows.map(([label, value]) => <div className="flex flex-col gap-2 rounded-xl border border-[#E0E0E0] bg-white p-4 sm:flex-row sm:items-center sm:justify-between" key={label}><span className="text-sm font-semibold text-[#4A6857]">{label}</span><code className="break-all font-mono text-sm font-bold text-[#2D4D35]">{value}</code><button onClick={() => copy(value)} aria-label={t("copy")} className="self-start rounded-lg p-2 text-[#2D4D35] hover:bg-[#F4F7F4] sm:self-auto"><Copy className="h-4 w-4" /></button></div>)}</div><button onClick={() => setResult(generateIpv6Ula())} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2D4D35] px-5 py-3 font-semibold text-white"><RefreshCw className="h-4 w-4" />{t("generate")}</button><p className="mt-5 text-sm text-[#4A6857]">{t("rfcNote")}</p></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
