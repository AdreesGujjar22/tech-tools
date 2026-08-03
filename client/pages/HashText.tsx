"use client";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { hashText, type HashAlgorithm, type HashEncoding } from "@/lib/crypto-tools";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
const algorithms: HashAlgorithm[] = ["MD5", "SHA1", "SHA256", "SHA224", "SHA512", "SHA384", "SHA3", "RIPEMD160"];
export default function HashText() { const t = useTranslations("Tools.HashText");
  const faqs = getFaqsForRoute("hash-text"); const [text, setText] = useState(""); const [encoding, setEncoding] = useState<HashEncoding>("Hex"); const [values, setValues] = useState<Record<string, string>>({}); useEffect(() => { let active = true; void Promise.all(algorithms.map(async algorithm => [algorithm, await hashText(text, algorithm, encoding)] as const)).then(entries => { if (active) setValues(Object.fromEntries(entries)); }); return () => { active = false; }; }, [encoding, text]); const copy = (value: string) => { void navigator.clipboard.writeText(value); }; return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="hash text, MD5, SHA256" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("inputLabel")}<textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder={t("placeholder")} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 text-[#2D4D35]" /></label><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{t("encoding")}<select value={encoding} onChange={e => setEncoding(e.target.value as HashEncoding)} className="mt-2 w-full rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 text-[#2D4D35]"><option value="Bin">{t("binary")}</option><option value="Hex">{t("hex")}</option><option value="Base64">{t("base64")}</option><option value="Base64url">{t("base64url")}</option></select></label><div className="mt-6 space-y-3">{algorithms.map(algorithm => <div className="flex items-center gap-3" key={algorithm}><span className="w-24 shrink-0 font-mono text-sm font-bold text-[#2D4D35]">{algorithm}</span><input readOnly value={values[algorithm] ?? ""} className="min-w-0 flex-1 rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 font-mono text-xs text-[#2D4D35]" /><button onClick={() => copy(values[algorithm] ?? "")} className="rounded-lg bg-[#E8F0E8] px-3 py-2 text-sm text-[#2D4D35]">{t("copy")}</button></div>)}</div></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
