"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { jsonToToml } from "@/lib/net-text-5";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function JsonToTomlConverter() {
  const t = useTranslations("Tools.JsonToTomlConverter");
  const faqs = getFaqsForRoute("json-to-toml-converter");
  const [input, setInput] = useState('{"owner":{"name":"Ada","active":true},"database":{"ports":[8000,8001]}}');
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => { try { return { output: input.trim() ? jsonToToml(input) : "", error: "" }; } catch (error) { return { output: "", error: error instanceof Error ? error.message : t("invalid") }; } }, [input, t]);
  const copy = async () => { await navigator.clipboard.writeText(result.output); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="JSON TOML converter" /><div className="mx-auto max-w-6xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="grid gap-6 lg:grid-cols-2"><label className="glass-card-dark rounded-[24px] p-6 text-sm font-semibold text-[#2D4D35]">{t("input")}<textarea value={input} onChange={(event) => setInput(event.target.value)} rows={18} spellCheck={false} className="mt-3 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm font-normal" /></label><section className="glass-card-dark rounded-[24px] p-6"><div className="flex items-center justify-between text-sm font-semibold text-[#2D4D35]"><span>{t("output")}</span><button type="button" disabled={!result.output} onClick={() => void copy()} className="inline-flex items-center gap-2 rounded-lg bg-[#2D4D35] px-3 py-2 text-white disabled:opacity-50">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? t("copied") : t("copy")}</button></div><pre className="mt-3 min-h-[390px] overflow-auto whitespace-pre-wrap rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]">{result.error || result.output}</pre></section></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
