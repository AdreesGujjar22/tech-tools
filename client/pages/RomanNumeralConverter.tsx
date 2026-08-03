"use client";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { arabicToRoman, romanToArabic } from "@/lib/converter-tools-2";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
export default function RomanNumeralConverter() { const t = useTranslations("Tools.RomanNumeralConverter");
  const faqs = getFaqsForRoute("unknown-slug"); const [number, setNumber] = useState("42"); const [roman, setRoman] = useState("XLII"); const numberResult = useMemo(() => arabicToRoman(Number(number)), [number]); const romanResult = useMemo(() => romanToArabic(roman), [roman]); return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="Roman numeral converter" /><div className="mx-auto max-w-3xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><div className="space-y-6">{[[t("arabicToRoman"), number, setNumber, numberResult, t("number"), t("roman")], [t("romanToArabic"), roman, setRoman, romanResult === null ? "" : String(romanResult), t("roman"), t("number")]].map(([heading, input, setter, output, inputLabel, outputLabel], index) => <section className="glass-card-dark rounded-[24px] p-8" key={heading as string}><h2 className="mb-5 text-xl font-bold text-[#2D4D35]">{heading as string}</h2><label className="block text-sm font-semibold text-[#2D4D35]">{inputLabel as string}<input value={input as string} onChange={e => (setter as (value: string) => void)(e.target.value)} className="mt-2 w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 font-mono" /></label><label className="mt-4 block text-sm font-semibold text-[#2D4D35]">{outputLabel as string}<input readOnly value={output as string} className="mt-2 w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 font-mono" /></label>{((index === 0 && !numberResult) || (index === 1 && romanResult === null)) && <p className="mt-3 text-sm text-red-600">{t("invalid")}</p>}</section>)}</div></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
