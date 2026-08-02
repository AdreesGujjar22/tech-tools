"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { compareLines } from "@/lib/net-text-5";
import { useTranslations } from "next-intl";

export default function TextDiff() {
  const t = useTranslations("Tools.TextDiff");
  const [left, setLeft] = useState("The quick brown fox\njumps over the lazy dog.");
  const [right, setRight] = useState("The quick red fox\njumped over a lazy dog.");
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => compareLines(left, right), [left, right]);
  const copy = async () => { await navigator.clipboard.writeText(lines.map((line) => line.status === "removed" ? `- ${line.left}` : line.status === "added" ? `+ ${line.right}` : line.status === "modified" ? `- ${line.left}\n+ ${line.right}` : `  ${line.right}`).join("\n")); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  const tone = { same: "bg-white", added: "bg-emerald-50", removed: "bg-red-50", modified: "bg-amber-50" };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="text diff comparison" /><div className="mx-auto max-w-6xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="grid gap-6 lg:grid-cols-2"><label className="glass-card-dark rounded-[24px] p-6 text-sm font-semibold text-[#2D4D35]">{t("original")}<textarea value={left} onChange={(event) => setLeft(event.target.value)} rows={10} className="mt-3 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm font-normal" /></label><label className="glass-card-dark rounded-[24px] p-6 text-sm font-semibold text-[#2D4D35]">{t("changed")}<textarea value={right} onChange={(event) => setRight(event.target.value)} rows={10} className="mt-3 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm font-normal" /></label></section><section className="glass-card-dark mt-6 rounded-[24px] p-6"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-[#2D4D35]">{t("result")}</h2><button type="button" onClick={() => void copy()} className="inline-flex items-center gap-2 rounded-lg bg-[#2D4D35] px-3 py-2 text-sm text-white">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? t("copied") : t("copy")}</button></div><div className="overflow-auto rounded-xl border border-[#E0E0E0] font-mono text-sm"><div className="grid min-w-[700px] grid-cols-[96px_1fr_1fr] border-b border-[#E0E0E0] bg-[#F6F8F6] px-3 py-2 text-xs font-bold uppercase text-[#4A6857]"><span>{t("status")}</span><span>{t("original")}</span><span>{t("changed")}</span></div>{lines.map((line, index) => <div key={index} className={`grid min-w-[700px] grid-cols-[96px_1fr_1fr] border-b border-[#E0E0E0] px-3 py-2 ${tone[line.status]}`}><span><span className="rounded-full bg-[#2D4D35] px-2 py-1 text-xs text-white">{t(line.status)}</span></span><code className="whitespace-pre-wrap break-words pr-3">{line.left}</code><code className="whitespace-pre-wrap break-words">{line.right}</code></div>)}</div></section></div></main>;
}
