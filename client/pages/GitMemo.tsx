"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import SEO from "@/components/SEO";
import { gitMemoCommands } from "@/lib/net-dev-3";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function GitMemo() {
  const t = useTranslations("Tools.GitMemo");
  const faqs = getFaqsForRoute("git-memo");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const commands = useMemo(() => gitMemoCommands.filter((item) => `${item.category} ${item.command} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const copy = async (command: string) => { await navigator.clipboard.writeText(command); setCopied(command); window.setTimeout(() => setCopied(""), 1500); };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="Git cheatsheet commands memo" /><div className="mx-auto max-w-6xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="relative block"><Search size={18} className="absolute left-4 top-3.5 text-[#4A6857]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("searchPlaceholder")} className="w-full rounded-xl border border-[#E0E0E0] bg-white py-3 pl-11 pr-4 text-[#2D4D35]" /></label><div className="mt-6 grid gap-4 md:grid-cols-2">{commands.map((item) => <article key={item.command} className="rounded-xl border border-[#E0E0E0] bg-white p-5"><p className="text-xs font-bold uppercase tracking-wide text-[#4A6857]">{item.category}</p><p className="mt-2 text-sm text-[#2D4D35]">{item.description}</p><div className="mt-4 flex items-center gap-3 rounded-lg bg-[#18281D] p-3"><code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm text-[#DDF5DF]">{item.command}</code><button type="button" onClick={() => copy(item.command)} aria-label={t("copyCommand")} className="shrink-0 rounded-lg p-2 text-[#DDF5DF] hover:bg-white/10">{copied === item.command ? <Check size={17} /> : <Copy size={17} />}</button></div></article>)}</div>{commands.length === 0 && <p className="py-10 text-center text-[#4A6857]">{t("noResults")}</p>}</section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
