"use client";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
type KeyInfo = { key: string; code: string; keyCode: number; location: number; shiftKey: boolean; ctrlKey: boolean; altKey: boolean; metaKey: boolean };
export default function KeycodeInfo() { const t = useTranslations("Tools.KeycodeInfo");
  const faqs = getFaqsForRoute("keycode-info"); const [event, setEvent] = useState<KeyInfo | null>(null); useEffect(() => { const handler = (value: KeyboardEvent) => setEvent({ key: value.key, code: value.code, keyCode: value.keyCode, location: value.location, shiftKey: value.shiftKey, ctrlKey: value.ctrlKey, altKey: value.altKey, metaKey: value.metaKey }); document.addEventListener("keydown", handler); return () => document.removeEventListener("keydown", handler); }, []); const rows = event ? [[t("key"), event.key], [t("code"), event.code], [t("keyCode"), event.keyCode], [t("location"), event.location], [t("shift"), event.shiftKey], [t("ctrl"), event.ctrlKey], [t("alt"), event.altKey], [t("meta"), event.metaKey]] : []; return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="keyboard keycode inspector key event" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><div className="rounded-xl bg-[#F4F7F4] p-10 text-center"><p className="text-sm text-[#4A6857]">{t("pressKey")}</p><p className="mt-3 font-mono text-4xl font-bold text-[#2D4D35]">{event?.key || "—"}</p></div><div className="mt-6 divide-y divide-[#E0E0E0] rounded-xl border border-[#E0E0E0] bg-white">{rows.map(([label, value]) => <div className="flex justify-between gap-4 p-4 text-sm" key={label as string}><span className="text-[#4A6857]">{label}</span><code className="font-bold text-[#2D4D35]">{String(value)}</code></div>)}</div></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
