"use client";

import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { jsonToXml } from "@/lib/converter-tools-3";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function JsonToXmlConverter() { const t = useTranslations("Tools.JsonToXmlConverter");
  const faqs = getFaqsForRoute("json-to-xml-converter"); const [input, setInput] = useState('{"users":{"user":[{"id":1,"name":"Ada"},{"id":2,"name":"Linus"}]}}'); const [rootTag, setRootTag] = useState("root"); const result = useMemo(() => { try { return { output: jsonToXml(input, rootTag), error: "" }; } catch (error) { return { output: "", error: error instanceof Error ? error.message : t("invalid") }; } }, [input, rootTag, t]); return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="JSON to XML converter root element" /><div className="mx-auto max-w-6xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="grid gap-6 lg:grid-cols-2"><div className="glass-card-dark rounded-[24px] p-6"><label className="block text-sm font-semibold text-[#2D4D35]">{t("rootTag")}<input value={rootTag} onChange={(event) => setRootTag(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal" /></label><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{t("input")}<textarea value={input} onChange={(event) => setInput(event.target.value)} rows={15} spellCheck={false} className="mt-3 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm font-normal" /></label></div><div className="glass-card-dark rounded-[24px] p-6"><div className="flex items-center justify-between text-sm font-semibold text-[#2D4D35]"><span>{t("output")}</span><button type="button" disabled={!result.output} onClick={() => void navigator.clipboard.writeText(result.output)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 disabled:opacity-40"><Copy size={16} />{t("copy")}</button></div>{result.error ? <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{result.error}</p> : <pre className="mt-3 h-[27rem] overflow-auto rounded-xl bg-[#18281D] p-4 font-mono text-sm leading-6 text-[#DDF5DF]">{result.output || " "}</pre>}</div></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
