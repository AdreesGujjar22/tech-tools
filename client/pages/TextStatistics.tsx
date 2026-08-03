"use client";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { textStatistics } from "@/lib/text-data-2";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
export default function TextStatistics() { const t = useTranslations("Tools.TextStatistics");
  const faqs = getFaqsForRoute("unknown-slug"); const [text, setText] = useState(""); const stats = useMemo(() => textStatistics(text), [text]); const cards = [[t("characters"), stats.characters], [t("words"), stats.words], [t("sentences"), stats.sentences], [t("lines"), stats.lines], [t("paragraphs"), stats.paragraphs], [t("bytes"), stats.bytes]]; return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="text statistics word character counter reading time" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><textarea value={text} onChange={e => setText(e.target.value)} rows={8} placeholder={t("placeholder")} className="w-full rounded-xl border border-[#E0E0E0] bg-white p-4 text-[#2D4D35]" /><div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{cards.map(([label, value]) => <div className="rounded-xl bg-[#F4F7F4] p-4 text-center" key={label as string}><p className="text-xs text-[#4A6857]">{label}</p><p className="mt-1 text-2xl font-bold text-[#2D4D35]">{value}</p></div>)}</div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-[#E0E0E0] p-4"><p className="text-sm text-[#4A6857]">{t("readingTime")}</p><p className="mt-1 font-bold text-[#2D4D35]">{stats.readingMinutes.toFixed(1)} {t("minutes")}</p></div><div className="rounded-xl border border-[#E0E0E0] p-4"><p className="text-sm text-[#4A6857]">{t("speakingTime")}</p><p className="mt-1 font-bold text-[#2D4D35]">{stats.speakingMinutes.toFixed(1)} {t("minutes")}</p></div></div><h2 className="mt-8 text-xl font-bold text-[#2D4D35]">{t("frequency")}</h2><div className="mt-3 flex flex-wrap gap-2">{stats.frequency.slice(0, 20).map(item => <span className="rounded-lg bg-[#F4F7F4] px-3 py-2 font-mono text-sm text-[#2D4D35]" key={item.character}>{JSON.stringify(item.character)}: {item.count} ({item.percentage.toFixed(1)}%)</span>)}</div></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
