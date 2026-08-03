"use client";

import { useState } from "react";
import { ArrowDownUp, Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { decryptAes, encryptAes, type AesMode } from "@/lib/crypto-sec-4";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function EncryptionDecryption() {
  const t = useTranslations("Tools.EncryptionDecryption");
  const faqs = getFaqsForRoute("encryption-decryption");
  const [mode, setMode] = useState<AesMode>("GCM"); const [secret, setSecret] = useState(""); const [input, setInput] = useState("Hello, secure world!"); const [output, setOutput] = useState(""); const [error, setError] = useState("");
  const run = async (operation: "encrypt" | "decrypt") => { try { setError(""); setOutput(operation === "encrypt" ? await encryptAes(input, secret, mode) : await decryptAes(input, secret, mode)); } catch (reason) { setOutput(""); setError(reason instanceof Error ? reason.message : t("invalid")); } };
  const copy = () => { void navigator.clipboard.writeText(output); };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="AES encryption decryption GCM CBC PBKDF2" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold text-[#2D4D35]">{t("mode")}<select value={mode} onChange={(event) => setMode(event.target.value as AesMode)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal"><option value="GCM">AES-GCM</option><option value="CBC">AES-CBC</option></select></label><label className="text-sm font-semibold text-[#2D4D35]">{t("passphrase")}<input type="password" value={secret} onChange={(event) => setSecret(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal" /></label></div><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{t("input")}<textarea value={input} onChange={(event) => setInput(event.target.value)} rows={7} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm font-normal" /></label><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void run("encrypt")} className="rounded-xl bg-[#2D4D35] px-5 py-3 font-semibold text-white">{t("encrypt")}</button><button type="button" onClick={() => void run("decrypt")} className="inline-flex items-center gap-2 rounded-xl border border-[#2D4D35] px-5 py-3 font-semibold text-[#2D4D35]"><ArrowDownUp size={17} />{t("decrypt")}</button></div>{error && <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}{output && <div className="mt-6 rounded-xl bg-[#F4F7F4] p-5"><div className="flex items-center justify-between"><p className="text-xs text-[#4A6857]">{t("output")}</p><button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#2D4D35]"><Copy size={16} />{t("copy")}</button></div><pre className="mt-2 max-h-52 overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-[#2D4D35]">{output}</pre></div>}</section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
