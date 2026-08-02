"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, Check, Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { natoToText, textToNato } from "@/lib/crypto-conv-3";
import { useTranslations } from "next-intl";

export default function TextToNatoAlphabet() {
  const t = useTranslations("Tools.TextToNatoAlphabet");
  const [text, setText] = useState("Hello 123!");
  const [nato, setNato] = useState("");
  const [delimiter, setDelimiter] = useState(" ");
  const [copied, setCopied] = useState<"nato" | "text" | null>(null);
  const encoded = useMemo(() => textToNato(text, delimiter), [delimiter, text]);
  const decoded = useMemo(() => natoToText(nato, delimiter), [delimiter, nato]);
  const copy = async (value: string, target: "nato" | "text") => { await navigator.clipboard.writeText(value); setCopied(target); window.setTimeout(() => setCopied(null), 1800); };
  const swap = () => { setText(decoded); setNato(encoded); };

  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="NATO phonetic alphabet converter" /><div className="mx-auto max-w-5xl"><header className="mx-auto mb-10 max-w-2xl text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark mb-6 rounded-[24px] p-6"><label className="block max-w-sm text-sm font-semibold text-[#2D4D35]">{t("delimiter")}<input value={delimiter} onChange={e => setDelimiter(e.target.value)} maxLength={5} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2D4D35]" /></label><p className="mt-2 text-xs text-[#4A6857]">{t("delimiterHelp")}</p></section><div className="grid gap-6 lg:grid-cols-2"><section className="glass-card-dark rounded-[24px] p-6 sm:p-8"><h2 className="text-xl font-bold text-[#2D4D35]">{t("encode")}</h2><textarea value={text} onChange={e => setText(e.target.value)} rows={5} className="mt-5 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 text-[#2D4D35]" /><div className="mt-4 min-h-28 whitespace-pre-wrap break-words rounded-xl bg-[#F4F7F4] p-4 font-mono text-sm text-[#2D4D35]">{encoded || t("empty")}</div><button onClick={() => copy(encoded, "nato")} disabled={!encoded} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#2D4D35] px-4 py-2 font-semibold text-[#2D4D35] disabled:opacity-50">{copied === "nato" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied === "nato" ? t("copied") : t("copy")}</button></section><section className="glass-card-dark rounded-[24px] p-6 sm:p-8"><h2 className="text-xl font-bold text-[#2D4D35]">{t("decode")}</h2><textarea value={nato} onChange={e => setNato(e.target.value)} rows={5} className="mt-5 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 text-[#2D4D35]" /><div className="mt-4 min-h-28 whitespace-pre-wrap break-words rounded-xl bg-[#F4F7F4] p-4 font-mono text-sm text-[#2D4D35]">{decoded || t("empty")}</div><button onClick={() => copy(decoded, "text")} disabled={!decoded} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#2D4D35] px-4 py-2 font-semibold text-[#2D4D35] disabled:opacity-50">{copied === "text" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied === "text" ? t("copied") : t("copy")}</button></section></div><button onClick={swap} className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-[#2D4D35] px-5 py-3 font-semibold text-white"><ArrowRightLeft className="h-4 w-4" />{t("swap")}</button></div></main>;
}
