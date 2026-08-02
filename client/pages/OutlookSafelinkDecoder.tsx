"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import SEO from "@/components/SEO";
import { decodeOutlookSafelink } from "@/lib/net-dev-3";
import { useTranslations } from "next-intl";

export default function OutlookSafelinkDecoder() {
  const t = useTranslations("Tools.OutlookSafelinkDecoder");
  const [input, setInput] = useState("https://nam01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com%2Fdocs%3Fid%3D42&data=06%7C01");
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => { try { return { output: decodeOutlookSafelink(input), error: "" }; } catch (error) { return { output: "", error: error instanceof Error ? error.message : t("invalid") }; } }, [input, t]);
  const copy = async () => { await navigator.clipboard.writeText(result.output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="Outlook SafeLinks decoder unwrap URL" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("input")}<textarea value={input} onChange={(event) => setInput(event.target.value)} rows={6} spellCheck={false} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm font-normal text-[#2D4D35]" /></label>{result.error ? <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{result.error}</p> : <div className="mt-6 rounded-xl bg-[#F4F7F4] p-5"><div className="flex items-center justify-between gap-3"><p className="text-xs text-[#4A6857]">{t("output")}</p><button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#2D4D35] hover:bg-white">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? t("copied") : t("copy")}</button></div><a href={result.output} target="_blank" rel="noreferrer" className="mt-2 block break-all font-mono text-[#2D4D35] underline">{result.output}</a></div>}</section></div></main>;
}
