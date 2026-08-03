"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { slugify } from "@/lib/dev-text-4";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function SlugifyString() {
  const t = useTranslations("Tools.SlugifyString");
  const faqs = getFaqsForRoute("slugify-string");
  const [input, setInput] = useState("Déjà vu: A Guide to Café Culture!");
  const [separator, setSeparator] = useState<"-" | "_" | ".">("-");
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => slugify(input, separator), [input, separator]);
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="slugify URL slug separator" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("input")}<textarea value={input} onChange={(event) => setInput(event.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-normal text-[#2D4D35]" /></label><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{t("separator")}<select value={separator} onChange={(event) => setSeparator(event.target.value as typeof separator)} className="mt-2 rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal"><option value="-">Hyphen (-)</option><option value="_">Underscore (_)</option><option value=".">Period (.)</option></select></label><div className="mt-8 rounded-xl bg-[#F4F7F4] p-5"><p className="text-xs text-[#4A6857]">{t("output")}</p><code className="mt-2 block break-all text-xl font-bold text-[#2D4D35]">{output || "—"}</code></div><button type="button" disabled={!output} onClick={copy} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2D4D35] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? t("copied") : t("copy")}</button></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
