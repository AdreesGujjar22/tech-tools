"use client";
import { useMemo, useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import SEO from "@/components/SEO";
import { formatMac, lookupMacVendor, type MacCase, type MacDelimiter } from "@/lib/net-dev-2";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function MacAddressLookup() {
  const t = useTranslations("Tools.MacAddressLookup");
  const faqs = getFaqsForRoute("mac-address-lookup");
  const [address, setAddress] = useState("00:1B:63:AA:BB:CC");
  const [delimiter, setDelimiter] = useState<MacDelimiter>(":");
  const [casing, setCasing] = useState<MacCase>("uppercase");
  const result = useMemo(() => lookupMacVendor(address), [address]);
  const formatted = useMemo(() => formatMac(address, delimiter, casing), [address, casing, delimiter]);
  const generate = () => setAddress(Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join(""));
  return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="MAC address generator OUI vendor lookup" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("address")}<input value={address} onChange={e => setAddress(e.target.value)} spellCheck={false} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-mono text-[#2D4D35]" /></label><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-[#2D4D35]">{t("delimiter")}<select value={delimiter} onChange={e => setDelimiter(e.target.value as MacDelimiter)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3"><option value=":">{t("colon")}</option><option value="-">{t("hyphen")}</option><option value=".">{t("dot")}</option><option value="">{t("none")}</option></select></label><label className="text-sm font-semibold text-[#2D4D35]">{t("case")}<select value={casing} onChange={e => setCasing(e.target.value as MacCase)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3"><option value="uppercase">{t("uppercase")}</option><option value="lowercase">{t("lowercase")}</option></select></label></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-[#F4F7F4] p-4"><p className="text-xs text-[#4A6857]">{t("formatted")}</p><code className="mt-1 block break-all text-lg font-bold text-[#2D4D35]">{formatted || t("invalid")}</code></div><div className="rounded-xl bg-[#F4F7F4] p-4"><p className="text-xs text-[#4A6857]">{t("vendor")}</p><p className="mt-1 font-semibold text-[#2D4D35]">{result.vendor || t("invalid")}</p><p className="mt-1 font-mono text-xs text-[#4A6857]">OUI: {result.oui || "—"}</p></div></div><div className="mt-6 flex flex-wrap gap-3"><button onClick={generate} className="inline-flex items-center gap-2 rounded-xl bg-[#2D4D35] px-5 py-3 font-semibold text-white"><RefreshCw className="h-4 w-4" />{t("generate")}</button><button onClick={() => void navigator.clipboard.writeText(formatted)} disabled={!formatted} className="inline-flex items-center gap-2 rounded-xl border border-[#2D4D35] px-5 py-3 font-semibold text-[#2D4D35] disabled:opacity-50"><Copy className="h-4 w-4" />{t("copy")}</button></div></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
