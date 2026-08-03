"use client";
import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { chmodOctal, chmodSymbolic, type ChmodPermissions, type Permission } from "@/lib/net-dev-2";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

const initial: ChmodPermissions = { owner: { read: true, write: true, execute: true }, group: { read: true, write: false, execute: true }, others: { read: true, write: false, execute: true } };
const scopes: Array<keyof Permission> = ["read", "write", "execute"];
const groups: Array<keyof ChmodPermissions> = ["owner", "group", "others"];
export default function ChmodCalculator() { const t = useTranslations("Tools.ChmodCalculator");
  const faqs = getFaqsForRoute("chmod-calculator"); const [permissions, setPermissions] = useState(initial); const octal = useMemo(() => chmodOctal(permissions), [permissions]); const symbolic = useMemo(() => chmodSymbolic(permissions), [permissions]); const toggle = (group: keyof ChmodPermissions, scope: keyof Permission) => setPermissions(current => ({ ...current, [group]: { ...current[group], [scope]: !current[group][scope] } })); const command = `chmod ${octal} path`; return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="chmod calculator Unix permissions" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-6 sm:p-8"><div className="overflow-x-auto"><table className="w-full min-w-[500px] text-left"><thead><tr><th className="pb-4 text-sm text-[#4A6857]">{t("subject")}</th>{scopes.map(scope => <th className="pb-4 text-center text-sm text-[#4A6857]" key={scope}>{t(scope)}</th>)}</tr></thead><tbody>{groups.map(group => <tr className="border-t border-[#E0E0E0]" key={group}><th className="py-4 text-sm font-semibold capitalize text-[#2D4D35]">{t(group)}</th>{scopes.map(scope => <td className="py-4 text-center" key={scope}><input type="checkbox" checked={permissions[group][scope]} onChange={() => toggle(group, scope)} className="h-5 w-5 accent-[#10A968]" aria-label={`${t(group)} ${t(scope)}`} /></td>)}</tr>)}</tbody></table></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-[#F4F7F4] p-5"><p className="text-xs text-[#4A6857]">{t("octal")}</p><p className="mt-1 font-mono text-3xl font-bold text-[#2D4D35]">{octal}</p></div><div className="rounded-xl bg-[#F4F7F4] p-5"><p className="text-xs text-[#4A6857]">{t("symbolic")}</p><p className="mt-1 break-all font-mono text-xl font-bold text-[#2D4D35]">{symbolic}</p></div></div><div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#E0E0E0] bg-white p-4"><code className="break-all text-sm text-[#2D4D35]">$ {command}</code><button onClick={() => void navigator.clipboard.writeText(command)} aria-label={t("copy")} className="rounded-lg p-2 text-[#2D4D35] hover:bg-[#F4F7F4]"><Copy className="h-4 w-4" /></button></div><p className="mt-3 text-sm text-[#4A6857]">{t("symbolicCommand")}: <code>chmod {octal} filename</code></p></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
