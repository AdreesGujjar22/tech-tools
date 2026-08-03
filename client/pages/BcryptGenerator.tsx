"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { hashBcrypt, verifyBcrypt } from "@/lib/crypto-conv-3";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function BcryptGenerator() {
  const t = useTranslations("Tools.BcryptGenerator");
  const faqs = getFaqsForRoute("unknown-slug");
  const [text, setText] = useState("");
  const [rounds, setRounds] = useState(10);
  const [verifyText, setVerifyText] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [copied, setCopied] = useState(false);
  const generated = useMemo(() => text ? hashBcrypt(text, rounds) : "", [rounds, text]);
  const verification = useMemo(() => verifyHash ? verifyBcrypt(verifyText, verifyHash) : null, [verifyHash, verifyText]);
  const copy = async () => { await navigator.clipboard.writeText(generated); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };

  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="bcrypt hash verifier" /><div className="mx-auto max-w-5xl"><header className="mx-auto mb-10 max-w-2xl text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><div className="grid gap-6 lg:grid-cols-2"><section className="glass-card-dark rounded-[24px] p-6 sm:p-8"><h2 className="text-xl font-bold text-[#2D4D35]">{t("hash")}</h2><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{t("textInput")}<input type="text" value={text} onChange={e => setText(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2D4D35]" /></label><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{t("rounds")}<select value={rounds} onChange={e => setRounds(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2D4D35]">{Array.from({ length: 11 }, (_, index) => index + 4).map(value => <option value={value} key={value}>{value}</option>)}</select></label><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{t("hashOutput")}<textarea readOnly value={generated} rows={3} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-[#F4F7F4] p-4 font-mono text-xs text-[#2D4D35]" /></label><button onClick={copy} disabled={!generated} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#2D4D35] px-5 py-3 font-semibold text-[#2D4D35] disabled:opacity-50">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? t("copied") : t("copy")}</button></section><section className="glass-card-dark rounded-[24px] p-6 sm:p-8"><h2 className="text-xl font-bold text-[#2D4D35]">{t("verify")}</h2><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{t("textInput")}<input type="text" value={verifyText} onChange={e => setVerifyText(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2D4D35]" /></label><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{t("hashInput")}<textarea value={verifyHash} onChange={e => setVerifyHash(e.target.value)} rows={3} spellCheck={false} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-xs text-[#2D4D35]" /></label><p className={`mt-6 rounded-xl px-4 py-3 text-sm font-semibold ${verification === null ? "bg-[#F4F7F4] text-[#4A6857]" : verification ? "bg-green-50 text-[#087A46]" : "bg-red-50 text-red-700"}`}>{verification === null ? t("enterHash") : verification ? t("match") : t("noMatch")}</p></section></div></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
