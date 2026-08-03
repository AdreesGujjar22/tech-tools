"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { generateHmac, type HmacAlgorithm, type HmacEncoding } from "@/lib/crypto-sec-4";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function HmacGenerator() {
  const t = useTranslations("Tools.HmacGenerator");
  const faqs = getFaqsForRoute("hmac-generator"); const [message, setMessage] = useState("Message to authenticate"); const [secret, setSecret] = useState("secret-key"); const [algorithm, setAlgorithm] = useState<HmacAlgorithm>("SHA-256"); const [encoding, setEncoding] = useState<HmacEncoding>("hex"); const [output, setOutput] = useState(""); const [error, setError] = useState("");
  const generate = async () => { try { setError(""); setOutput(await generateHmac(message, secret, algorithm, encoding)); } catch (reason) { setError(reason instanceof Error ? reason.message : t("invalid")); setOutput(""); } };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="HMAC SHA256 SHA512 MD5 generator" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("message")}<textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={5} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-normal text-[#2D4D35]" /></label><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{t("secret")}<input value={secret} onChange={(event) => setSecret(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal text-[#2D4D35]" /></label><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-[#2D4D35]">{t("algorithm")}<select value={algorithm} onChange={(event) => setAlgorithm(event.target.value as HmacAlgorithm)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal">{["SHA-256", "SHA-512", "SHA-384", "SHA-1", "MD5"].map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-sm font-semibold text-[#2D4D35]">{t("encoding")}<select value={encoding} onChange={(event) => setEncoding(event.target.value as HmacEncoding)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal"><option value="hex">Hexadecimal</option><option value="base64">Base64</option></select></label></div><button type="button" onClick={() => void generate()} className="mt-6 rounded-xl bg-[#2D4D35] px-5 py-3 font-semibold text-white">{t("generate")}</button>{error && <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}{output && <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#F4F7F4] p-5"><code className="min-w-0 flex-1 break-all text-sm text-[#2D4D35]">{output}</code><button type="button" onClick={() => void navigator.clipboard.writeText(output)} aria-label={t("copy")} className="rounded-lg p-2 text-[#2D4D35]"><Copy size={18} /></button></div>}</section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
