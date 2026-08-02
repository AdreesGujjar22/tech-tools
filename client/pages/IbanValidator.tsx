"use client";

import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { validateIban } from "@/lib/final-tools-1";
import { useTranslations } from "next-intl";

export default function IbanValidator() {
  const t = useTranslations("Tools.IbanValidator");
  const [input, setInput] = useState("");
  const result = useMemo(() => input ? validateIban(input) : null, [input]);
  const rows = result ? [[t("country"), result.country], [t("checkDigits"), result.checkDigits], [t("bban"), result.bban], [t("bankIdentifier"), result.bankIdentifier], [t("accountDetails"), result.accountDetails]] : [];
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="IBAN validator parser mod 97" /><div className="mx-auto max-w-3xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("inputLabel")}<input value={input} onChange={(event) => setInput(event.target.value)} placeholder={t("placeholder")} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 font-mono font-normal text-[#2D4D35]" /></label>{result && <div className="mt-6 rounded-xl bg-white p-5 text-[#2D4D35]"><p className={`text-lg font-bold ${result.valid ? "text-[#10A968]" : "text-red-600"}`}>{result.valid ? t("valid") : t("invalid")}</p><p className="mt-2 text-sm text-[#4A6857]">{result.friendly}</p><dl className="mt-5 space-y-3">{rows.map(([label, value]) => <div key={label} className="grid gap-2 sm:grid-cols-2"><dt className="font-semibold">{label}</dt><dd className="break-all font-mono">{value}</dd></div>)}</dl></div>}</section></div></main>;
}
