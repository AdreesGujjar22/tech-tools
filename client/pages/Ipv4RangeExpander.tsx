"use client";

import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { expandIpv4Range } from "@/lib/net-dev-3";
import { useTranslations } from "next-intl";

export default function Ipv4RangeExpander() {
  const t = useTranslations("Tools.Ipv4RangeExpander");
  const [start, setStart] = useState("192.168.1.1");
  const [end, setEnd] = useState("192.168.1.5");
  const [limit, setLimit] = useState("1024");
  const result = useMemo(() => { try { return { data: expandIpv4Range(start, end, Number(limit)), error: "" }; } catch (error) { return { data: null, error: error instanceof Error ? error.message : t("invalid") }; } }, [end, limit, start, t]);
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="IPv4 range expander CIDR IP list" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><div className="grid gap-4 md:grid-cols-3"><label className="text-sm font-semibold text-[#2D4D35]">{t("start")}<input value={start} onChange={(event) => setStart(event.target.value)} placeholder="192.168.1.1 or 192.168.1.0/30" className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-mono font-normal" /></label><label className="text-sm font-semibold text-[#2D4D35]">{t("end")}<input value={end} onChange={(event) => setEnd(event.target.value)} placeholder="Leave blank for CIDR" className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-mono font-normal" /></label><label className="text-sm font-semibold text-[#2D4D35]">{t("limit")}<input type="number" min="1" max="65536" value={limit} onChange={(event) => setLimit(event.target.value)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-normal" /></label></div>{result.error ? <p className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{result.error}</p> : <><div className="mt-6 grid gap-3 sm:grid-cols-4">{[[t("rangeStart"), result.data!.start], [t("rangeEnd"), result.data!.end], [t("cidr"), result.data!.cidr], [t("total"), result.data!.total.toLocaleString()]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#F4F7F4] p-4"><p className="text-xs text-[#4A6857]">{label}</p><p className="mt-1 break-all font-mono font-bold text-[#2D4D35]">{value}</p></div>)}</div><div className="mt-6 rounded-xl bg-[#18281D] p-5"><pre className="max-h-96 overflow-auto whitespace-pre-wrap font-mono text-sm leading-7 text-[#DDF5DF]">{result.data!.addresses.join("\n")}</pre></div>{result.data!.truncated && <p className="mt-3 text-sm text-[#4A6857]">{t("truncated", { limit: Number(limit) })}</p>}</>}</section></div></main>;
}
