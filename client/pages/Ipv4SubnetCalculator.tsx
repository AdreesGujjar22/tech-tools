"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { calculateIpv4Subnet } from "@/lib/net-text-5";
import { useTranslations } from "next-intl";

export default function Ipv4SubnetCalculator() {
  const t = useTranslations("Tools.Ipv4SubnetCalculator");
  const [address, setAddress] = useState("192.168.0.1");
  const [prefix, setPrefix] = useState(24);
  const [copied, setCopied] = useState("");
  const result = useMemo(() => { try { return { info: calculateIpv4Subnet(address, prefix), error: "" }; } catch (error) { return { info: null, error: error instanceof Error ? error.message : t("invalid") }; } }, [address, prefix, t]);
  const rows = result.info ? [[t("netmask"), result.info.netmask], [t("wildcard"), result.info.wildcard], [t("network"), result.info.network], [t("broadcast"), result.info.broadcast], [t("firstUsable"), result.info.firstUsable], [t("lastUsable"), result.info.lastUsable], [t("totalUsable"), result.info.totalUsable.toLocaleString()], [t("ipClass"), result.info.ipClass]] : [];
  const copy = async (value: string) => { await navigator.clipboard.writeText(value); setCopied(value); window.setTimeout(() => setCopied(""), 1600); };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="IPv4 subnet calculator CIDR" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><div className="grid gap-4 sm:grid-cols-[1fr_180px]"><label className="text-sm font-semibold text-[#2D4D35]">{t("inputLabel")}<input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="192.168.0.1" className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-mono font-normal" /></label><label className="text-sm font-semibold text-[#2D4D35]">{t("cidr")}<input type="number" min="0" max="32" value={prefix} onChange={(event) => setPrefix(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal" /></label></div>{result.error ? <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{result.error}</p> : <div className="mt-6 divide-y divide-[#E0E0E0] rounded-xl border border-[#E0E0E0] bg-white">{rows.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 px-4 py-3"><span className="text-sm font-semibold text-[#4A6857]">{label}</span><button type="button" onClick={() => void copy(String(value))} className="inline-flex items-center gap-2 font-mono text-sm text-[#2D4D35]"><span>{value}</span>{copied === value ? <Check size={16} /> : <Copy size={16} />}</button></div>)}</div>}</section></div></main>;
}
