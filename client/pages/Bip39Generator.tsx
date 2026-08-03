"use client";

import { useMemo, useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import SEO from "@/components/SEO";
import { generateBip39Passphrase, isValidBip39Passphrase, type Bip39WordCount } from "@/lib/crypto-conv-3";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function Bip39Generator() {
  const t = useTranslations("Tools.Bip39Generator");
  const faqs = getFaqsForRoute("bip39-generator");
  const [words, setWords] = useState<Bip39WordCount>(12);
  const [phrase, setPhrase] = useState(() => generateBip39Passphrase(12));
  const [copied, setCopied] = useState(false);
  const valid = useMemo(() => isValidBip39Passphrase(phrase), [phrase]);

  const generate = () => setPhrase(generateBip39Passphrase(words));
  const copy = async () => {
    await navigator.clipboard.writeText(phrase);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="BIP39 mnemonic generator" /><div className="mx-auto max-w-4xl"><header className="mx-auto mb-10 max-w-2xl text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-6 sm:p-8"><div className="grid gap-5 sm:grid-cols-[180px_1fr]"><label className="text-sm font-semibold text-[#2D4D35]">{t("wordCount")}<select value={words} onChange={e => setWords(Number(e.target.value) as Bip39WordCount)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2D4D35]">{([12, 15, 18, 21, 24] as const).map(count => <option value={count} key={count}>{count}</option>)}</select></label><div className="rounded-xl border border-[#E0E0E0] bg-[#F4F7F4] px-4 py-3 text-sm text-[#4A6857]">{t("helpText")}</div></div><label className="mt-6 block text-sm font-semibold text-[#2D4D35]">{t("mnemonic")}<textarea value={phrase} onChange={e => setPhrase(e.target.value)} rows={4} spellCheck={false} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35] focus:outline-none focus:ring-2 focus:ring-[#10A968]" /></label><p className={`mt-3 text-sm font-medium ${valid ? "text-[#10A968]" : "text-red-600"}`}>{valid ? t("valid") : t("invalid")}</p><div className="mt-6 flex flex-wrap gap-3"><button onClick={generate} className="inline-flex items-center gap-2 rounded-xl bg-[#2D4D35] px-5 py-3 font-semibold text-white"><RefreshCw className="h-4 w-4" />{t("generate")}</button><button onClick={copy} disabled={!phrase} className="inline-flex items-center gap-2 rounded-xl border border-[#2D4D35] px-5 py-3 font-semibold text-[#2D4D35] disabled:opacity-50">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? t("copied") : t("copy")}</button></div></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
