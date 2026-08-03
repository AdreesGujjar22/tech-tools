"use client";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { escapeHtmlEntities, unescapeHtmlEntities } from "@/lib/media-visual-tools";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
export default function HtmlEntities() { const t = useTranslations("Tools.HtmlEntities");
  const faqs = getFaqsForRoute("html-entities"); const [escapeInput, setEscapeInput] = useState("<title>IT Tool</title>"); const [unescapeInput, setUnescapeInput] = useState("&lt;title&gt;IT Tool&lt;/title&gt;"); const escaped = useMemo(() => escapeHtmlEntities(escapeInput), [escapeInput]); const unescaped = useMemo(() => unescapeHtmlEntities(unescapeInput), [unescapeInput]); return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="HTML entities escape unescape" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><div className="grid gap-6 lg:grid-cols-2">{[[t("escape"), escapeInput, setEscapeInput, escaped, t("string"), t("escaped")], [t("unescape"), unescapeInput, setUnescapeInput, unescaped, t("escapedString"), t("unescaped")]].map(([heading, input, setter, output, inputLabel, outputLabel]) => <section className="glass-card-dark rounded-[24px] p-8" key={heading as string}><h2 className="mb-5 text-xl font-bold text-[#2D4D35]">{heading as string}</h2><label className="block text-sm font-semibold text-[#2D4D35]">{inputLabel as string}<textarea value={input as string} onChange={e => (setter as (value: string) => void)(e.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 text-[#2D4D35]" /></label><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{outputLabel as string}<textarea readOnly value={output as string} rows={5} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 text-[#2D4D35]" /></label><button onClick={() => void navigator.clipboard.writeText(output as string)} className="mt-5 w-full rounded-xl bg-gradient-indigo-cyan px-5 py-3 font-semibold text-white">{t("copy")}</button></section>)}</div></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
