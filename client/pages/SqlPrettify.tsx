"use client";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { prettifySql } from "@/lib/network-dev-tools";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
export default function SqlPrettify() { const t = useTranslations("Tools.SqlPrettify");
  const faqs = getFaqsForRoute("unknown-slug"); const [sql, setSql] = useState("select field1,field2,field3 from my_table where my_condition;"); const formatted = useMemo(() => prettifySql(sql), [sql]); return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="SQL formatter prettify" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("inputLabel")}<textarea value={sql} onChange={e => setSql(e.target.value)} rows={10} placeholder={t("placeholder")} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" /></label><label className="mt-6 block text-sm font-semibold text-[#2D4D35]">{t("outputLabel")}<textarea readOnly value={formatted} rows={12} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" /></label></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
