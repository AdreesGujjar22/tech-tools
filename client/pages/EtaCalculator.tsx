"use client";

import { useEffect, useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { calculateCompletionEta, formatDuration } from "@/lib/net-text-5";
import { useTranslations } from "next-intl";

export default function EtaCalculator() {
  const t = useTranslations("Tools.EtaCalculator");
  const [total, setTotal] = useState(1000);
  const [completed, setCompleted] = useState(320);
  const [speed, setSpeed] = useState(3);
  const [unitMs, setUnitMs] = useState(60000);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const result = useMemo(() => calculateCompletionEta(total, completed, speed, unitMs, now), [completed, now, speed, total, unitMs]);
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="ETA completion time calculator" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-semibold text-[#2D4D35]">{t("total")}<input type="number" min="0" value={total} onChange={(event) => setTotal(Math.max(0, Number(event.target.value)))} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal" /></label><label className="text-sm font-semibold text-[#2D4D35]">{t("completed")}<input type="number" min="0" value={completed} onChange={(event) => setCompleted(Math.max(0, Number(event.target.value)))} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal" /></label><label className="text-sm font-semibold text-[#2D4D35]">{t("speed")}<input type="number" min="0" step="any" value={speed} onChange={(event) => setSpeed(Math.max(0, Number(event.target.value)))} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal" /></label><label className="text-sm font-semibold text-[#2D4D35]">{t("speedUnit")}<select value={unitMs} onChange={(event) => setUnitMs(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal"><option value={1000}>{t("perSecond")}</option><option value={60000}>{t("perMinute")}</option><option value={3600000}>{t("perHour")}</option></select></label></div><div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-xl bg-white p-5"><p className="text-sm text-[#4A6857]">{t("remaining")}</p><p className="mt-2 text-2xl font-bold text-[#2D4D35]">{result.remaining.toLocaleString()}</p></div><div className="rounded-xl bg-white p-5"><p className="text-sm text-[#4A6857]">{t("remainingTime")}</p><p className="mt-2 text-2xl font-bold text-[#2D4D35]">{formatDuration(result.remainingMs)}</p></div><div className="rounded-xl bg-white p-5"><p className="text-sm text-[#4A6857]">{t("finishAt")}</p><p className="mt-2 text-lg font-bold text-[#2D4D35]">{result.finishAt ? new Date(result.finishAt).toLocaleString() : "—"}</p></div></div><div className="mt-6 h-3 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#2D4D35] transition-all" style={{ width: `${result.progress}%` }} /></div></section></div></main>;
}
