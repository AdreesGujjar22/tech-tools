"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import SEO from "@/components/SEO";
import { formatXml, type XmlIndent } from "@/lib/net-dev-3";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function XmlFormatter() {
  const t = useTranslations("Tools.XmlFormatter");
  const faqs = getFaqsForRoute("xml-formatter");
  const [input, setInput] = useState('<root><item id="1">Hello</item><empty /></root>');
  const [indent, setIndent] = useState<XmlIndent>("2");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => { try { return { output: formatXml(input, indent), error: "" }; } catch (error) { return { output: "", error: error instanceof Error ? error.message : t("invalid") }; } }, [indent, input, t]);
  const copy = async () => { await navigator.clipboard.writeText(result.output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="XML formatter prettify validator" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><div className="mb-5 flex flex-wrap items-center gap-3"><label className="text-sm font-semibold text-[#2D4D35]">{t("indent")}<select value={indent} onChange={(event) => setIndent(event.target.value as XmlIndent)} className="ml-2 rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 font-normal"><option value="2">{t("twoSpaces")}</option><option value="4">{t("fourSpaces")}</option><option value="tab">{t("tabs")}</option></select></label></div><textarea value={input} onChange={(event) => setInput(event.target.value)} rows={10} spellCheck={false} className="w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" />{result.error ? <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{result.error}</p> : <div className="mt-5"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-[#2D4D35]">{t("output")}</p><button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#2D4D35] hover:bg-[#F4F7F4]">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? t("copied") : t("copy")}</button></div><pre className="mt-2 overflow-auto rounded-xl bg-[#18281D] p-5 font-mono text-sm leading-7 text-[#DDF5DF]">{result.output || " "}</pre></div>}</section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
