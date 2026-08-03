"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { convertIPv4, type Ipv4Notation } from "@/lib/dev-text-4";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function Ipv4AddressConverter() {
  const t = useTranslations("Tools.Ipv4AddressConverter");
  const faqs = getFaqsForRoute("ipv4-address-converter");
  const [value, setValue] = useState("192.168.1.1");
  const [notation, setNotation] = useState<Ipv4Notation>("dotted");
  const [copied, setCopied] = useState("");
  const result = useMemo(() => { try { return { values: convertIPv4(value, notation), error: "" }; } catch { return { values: null, error: t("invalid") }; } }, [notation, t, value]);
  const rows = result.values ? [["dotted", result.values.dotted], ["decimal", result.values.decimal], ["hexadecimal", result.values.hexadecimal], ["octal", result.values.octal], ["binary", result.values.binary]] : [];
  const copy = async (label: string, output: string) => { await navigator.clipboard.writeText(output); setCopied(label); window.setTimeout(() => setCopied(""), 1500); };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="IPv4 address decimal hexadecimal octal binary converter" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><div className="grid gap-4 sm:grid-cols-[1fr_220px]"><label className="text-sm font-semibold text-[#2D4D35]">{t("input")}<input value={value} onChange={(event) => setValue(event.target.value)} spellCheck={false} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-mono font-normal" /></label><label className="text-sm font-semibold text-[#2D4D35]">{t("notation")}<select value={notation} onChange={(event) => setNotation(event.target.value as Ipv4Notation)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal">{(["dotted", "decimal", "hexadecimal", "octal", "binary"] as const).map((name) => <option key={name} value={name === "hexadecimal" ? "hex" : name}>{t(name)}</option>)}</select></label></div>{result.error ? <p className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{result.error}</p> : <div className="mt-6 space-y-3">{rows.map(([label, output]) => <div key={label} className="flex items-center gap-3 rounded-xl bg-[#F4F7F4] p-4"><span className="w-28 shrink-0 text-sm font-semibold text-[#2D4D35]">{t(label)}</span><code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-sm text-[#2D4D35]">{output}</code><button type="button" onClick={() => copy(label, output)} aria-label={`Copy ${label}`} className="rounded-lg p-2 text-[#2D4D35] hover:bg-white">{copied === label ? <Check size={18} /> : <Copy size={18} />}</button></div>)}</div>}</section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
