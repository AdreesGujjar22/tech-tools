"use client";
import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { obfuscateBase64, obfuscateCharCode, obfuscateHex, obfuscateHtml } from "@/lib/text-data-2";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
export default function StringObfuscator() { const t = useTranslations("Tools.StringObfuscator");
  const faqs = getFaqsForRoute("unknown-slug"); const [text, setText] = useState("Secret message"); const [copied, setCopied] = useState(""); const results = useMemo(() => [[t("hex"), obfuscateHex(text)], [t("charCode"), obfuscateCharCode(text)], [t("html"), obfuscateHtml(text)], [t("base64"), obfuscateBase64(text)]], [t, text]); const copy = async (value: string, label: string) => { await navigator.clipboard.writeText(value); setCopied(label); window.setTimeout(() => setCopied(""), 1600); }; return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="string obfuscator hex HTML entities base64" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("input")}<textarea value={text} onChange={e => setText(e.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 text-[#2D4D35]" /></label><div className="mt-6 space-y-5">{results.map(([label, value]) => <div key={label as string}><p className="text-sm font-semibold text-[#2D4D35]">{label}</p><div className="mt-2 flex gap-2"><textarea readOnly value={value} rows={3} className="w-full rounded-xl border border-[#E0E0E0] bg-[#F4F7F4] p-3 font-mono text-xs text-[#2D4D35]" /><button onClick={() => copy(value, label as string)} aria-label={t("copy")} className="self-start rounded-xl border border-[#2D4D35] p-3 text-[#2D4D35]">{copied === label ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button></div></div>)}</div></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
