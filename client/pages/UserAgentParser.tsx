"use client";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { parseUserAgent } from "@/lib/web-text-tools";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
export default function UserAgentParser() { const t = useTranslations("Tools.UserAgentParser");
  const faqs = getFaqsForRoute("unknown-slug"); const [userAgent, setUserAgent] = useState(typeof navigator === "undefined" ? "" : navigator.userAgent); const info = useMemo(() => parseUserAgent(userAgent), [userAgent]); const blocks = [[t("browser"), info.browser], [t("engine"), info.engine], [t("os"), info.os], [t("device"), info.device]] as const; return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="user agent parser browser OS device" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("inputLabel")}<textarea value={userAgent} onChange={e => setUserAgent(e.target.value)} rows={3} placeholder={t("placeholder")} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" /></label></section><div className="mt-6 grid gap-6 sm:grid-cols-2">{blocks.map(([title, values]) => <section className="glass-card-dark rounded-[24px] p-6" key={title}><h2 className="mb-4 text-xl font-bold text-[#2D4D35]">{title}</h2><dl className="space-y-3">{Object.entries(values).map(([key, value]) => <div className="flex justify-between gap-4 border-b border-[#E0E0E0] pb-2" key={key}><dt className="capitalize text-[#4A6857]">{key}</dt><dd className="text-right font-semibold text-[#2D4D35]">{value}</dd></div>)}</dl></section>)}</div></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
