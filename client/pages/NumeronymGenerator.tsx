"use client";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { createNumeronym } from "@/lib/text-data-2";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
export default function NumeronymGenerator() { const t = useTranslations("Tools.NumeronymGenerator");
  const faqs = getFaqsForRoute("numeronym-generator"); const [text, setText] = useState("internationalization"); const [minimum, setMinimum] = useState(4); const output = useMemo(() => createNumeronym(text, minimum), [minimum, text]); return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="numeronym generator i18n abbreviation" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("input")}<textarea value={text} onChange={e => setText(e.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 text-[#2D4D35]" /></label><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{t("minimumLength")}<select value={minimum} onChange={e => setMinimum(Number(e.target.value))} className="mt-2 rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2D4D35]">{[3, 4, 5, 6, 7, 8].map(value => <option value={value} key={value}>{value}</option>)}</select></label><div className="mt-8 rounded-xl bg-[#F4F7F4] p-8 text-center"><p className="text-sm text-[#4A6857]">{t("output")}</p><p className="mt-3 break-words font-mono text-4xl font-bold text-[#2D4D35]">{output || "—"}</p></div></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
