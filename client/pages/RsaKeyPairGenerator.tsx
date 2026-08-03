"use client";

import { useState } from "react";
import { Copy, KeyRound } from "lucide-react";
import SEO from "@/components/SEO";
import { generateRsaKeyPair } from "@/lib/crypto-sec-4";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function RsaKeyPairGenerator() {
  const t = useTranslations("Tools.RsaKeyPairGenerator");
  const faqs = getFaqsForRoute("rsa-key-pair-generator"); const [bits, setBits] = useState<1024 | 2048 | 4096>(2048); const [keys, setKeys] = useState<{ publicKey: string; privateKey: string } | null>(null); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const generate = async () => { setLoading(true); setError(""); try { setKeys(await generateRsaKeyPair(bits)); } catch (reason) { setError(reason instanceof Error ? reason.message : t("invalid")); } finally { setLoading(false); } };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="RSA public private PEM key pair generator" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><div className="flex flex-wrap items-end gap-4"><label className="text-sm font-semibold text-[#2D4D35]">{t("length")}<select value={bits} onChange={(event) => setBits(Number(event.target.value) as typeof bits)} className="mt-2 block rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal"><option value="1024">1024 bits</option><option value="2048">2048 bits</option><option value="4096">4096 bits</option></select></label><button type="button" onClick={() => void generate()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-[#2D4D35] px-5 py-3 font-semibold text-white disabled:opacity-50"><KeyRound size={17} />{loading ? t("generating") : t("generate")}</button></div>{error && <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}{keys && <div className="mt-7 grid gap-5 lg:grid-cols-2">{[[t("publicKey"), keys.publicKey], [t("privateKey"), keys.privateKey]].map(([label, value]) => <div key={label}><div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#2D4D35]"><span>{label}</span><button type="button" onClick={() => void navigator.clipboard.writeText(value)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs"><Copy size={14} />{t("copy")}</button></div><pre className="max-h-80 overflow-auto rounded-xl bg-[#18281D] p-4 font-mono text-xs leading-6 text-[#DDF5DF]">{value}</pre></div>)}</div>}</section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
