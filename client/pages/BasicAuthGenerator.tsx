"use client";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { createBasicAuth } from "@/lib/web-tools-2";
import { useTranslations } from "next-intl";

export default function BasicAuthGenerator() {
  const t = useTranslations("Tools.BasicAuthGenerator");
  const [username, setUsername] = useState("user");
  const [password, setPassword] = useState("password");
  const result = useMemo(() => createBasicAuth(username, password), [username, password]);
  const copy = (value: string) => void navigator.clipboard.writeText(value);
  return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="basic authentication header htpasswd generator" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-[#2D4D35]">{t("username")}<input value={username} onChange={e => setUsername(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2D4D35]" /></label><label className="text-sm font-semibold text-[#2D4D35]">{t("password")}<input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2D4D35]" /></label></div></section><div className="mt-6 grid gap-6 lg:grid-cols-2">{[[t("header"), result.header], [t("htpasswd"), result.htpasswd]].map(([label, value]) => <section className="glass-card-dark rounded-[24px] p-8" key={label}><h2 className="mb-3 text-xl font-bold text-[#2D4D35]">{label}</h2><code className="block break-all rounded-xl bg-[#F4F7F4] p-4 text-sm text-[#2D4D35]">{value}</code><button onClick={() => copy(value)} className="mt-4 rounded-xl bg-[#2D4D35] px-4 py-2 text-sm font-semibold text-white">{t("copy")}</button></section>)}</div></div></main>;
}
