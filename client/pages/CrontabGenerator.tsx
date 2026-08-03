"use client";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { buildCron, parseCron, type CronFields } from "@/lib/network-dev-tools";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
export default function CrontabGenerator() { const t = useTranslations("Tools.CrontabGenerator");
  const faqs = getFaqsForRoute("crontab-generator"); const [cron, setCron] = useState("40 * * * *"); const parsed = useMemo(() => parseCron(cron), [cron]); const update = (key: keyof CronFields, value: string) => setCron(buildCron({ ...parsed.fields, [key]: value })); const fields: Array<[keyof CronFields, string]> = [["minute", t("minute")], ["hour", t("hour")], ["day", t("day")], ["month", t("month")], ["weekday", t("weekday")]]; return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="crontab generator cron expression" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("cronInput")}<input value={cron} onChange={e => setCron(e.target.value)} placeholder="* * * * *" className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-center font-mono text-xl text-[#2D4D35]" /></label>{!parsed.valid && <p className="mt-3 text-sm text-red-600">{t("invalid")}</p>}{parsed.valid && <p className="mt-5 rounded-xl bg-[#E8F0E8] p-4 text-center text-[#2D4D35]">{parsed.explanation}</p>}<div className="mt-6 grid gap-4 sm:grid-cols-5">{fields.map(([key, label]) => <label className="text-sm font-semibold text-[#2D4D35]" key={key}>{label}<input value={parsed.fields[key]} onChange={e => update(key, e.target.value)} className="mt-2 w-full rounded-lg border border-[#E0E0E0] bg-white px-2 py-2 font-mono text-center text-[#2D4D35]" /></label>)}</div><pre className="mt-8 overflow-x-auto rounded-xl bg-[#F0F7F0] p-5 text-sm text-[#2D4D35]">{t("legend")}</pre></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
