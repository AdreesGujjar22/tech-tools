"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { asciiArt, type AsciiStyle } from "@/lib/dev-text-4";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function AsciiArtGenerator() {
  const t = useTranslations("Tools.AsciiArtGenerator");
  const faqs = getFaqsForRoute("ascii-art-generator");
  const [input, setInput] = useState("HELLO");
  const [style, setStyle] = useState<AsciiStyle>("standard");
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => asciiArt(input, style), [input, style]);
  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  const styles: AsciiStyle[] = ["standard", "block", "slant", "framed", "binary"];
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="ASCII art text banner generator" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-[#2D4D35]">{t("input")}<input value={input} onChange={(event) => setInput(event.target.value)} maxLength={80} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal" /></label><label className="text-sm font-semibold text-[#2D4D35]">{t("style")}<select value={style} onChange={(event) => setStyle(event.target.value as AsciiStyle)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal">{styles.map((name) => <option key={name} value={name}>{t(name)}</option>)}</select></label></div><div className="mt-7 overflow-auto rounded-xl bg-[#18281D] p-5"><pre className="min-w-max whitespace-pre font-mono text-xs leading-relaxed text-[#DDF5DF] sm:text-sm">{output || " "}</pre></div><button type="button" disabled={!output} onClick={copy} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2D4D35] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? t("copied") : t("copy")}</button></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
