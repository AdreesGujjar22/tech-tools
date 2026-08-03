"use client";

import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { normalizeEmail } from "@/lib/dev-conv-5";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function EmailNormalizer() { const t = useTranslations("Tools.EmailNormalizer");
  const faqs = getFaqsForRoute("email-normalizer"); const [input, setInput] = useState(" John.Doe+news@Gmail.COM\nuser@mailinator.com"); const results = useMemo(() => input.split(/\r?\n/).filter((line) => line.trim()).map((line) => { try { return { data: normalizeEmail(line), error: "" }; } catch (error) { return { data: null, error: error instanceof Error ? error.message : t("invalid") }; } }), [input, t]); return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="email normalizer Gmail disposable domain" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("input")}<textarea value={input} onChange={(event) => setInput(event.target.value)} rows={7} className="mt-3 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-normal" /></label><div className="mt-6 space-y-3">{results.map((result, index) => result.error ? <p key={index} className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{result.error}</p> : <article key={result.data!.original + index} className="rounded-xl bg-[#F4F7F4] p-5"><div className="flex items-center justify-between gap-3"><code className="break-all font-semibold text-[#2D4D35]">{result.data!.normalized}</code><button type="button" onClick={() => void navigator.clipboard.writeText(result.data!.normalized)} aria-label={t("copy")} className="rounded-lg p-2 text-[#2D4D35]"><Copy size={17} /></button></div><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4"><div><dt className="text-[#4A6857]">{t("localPart")}</dt><dd className="text-[#2D4D35]">{result.data!.localPart}</dd></div><div><dt className="text-[#4A6857]">{t("domain")}</dt><dd className="text-[#2D4D35]">{result.data!.domain}</dd></div><div><dt className="text-[#4A6857]">{t("provider")}</dt><dd className="text-[#2D4D35]">{result.data!.provider}</dd></div><div><dt className="text-[#4A6857]">{t("disposable")}</dt><dd className={result.data!.disposable ? "font-semibold text-rose-700" : "text-emerald-700"}>{result.data!.disposable ? t("yes") : t("no")}</dd></div></dl></article>)}</div></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
