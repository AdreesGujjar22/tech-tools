"use client";
import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { yamlToJson, yamlToToml } from "@/lib/dev-tools-3";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
export default function YamlToJsonToml() { const t = useTranslations("Tools.YamlToJsonToml");
  const faqs = getFaqsForRoute("unknown-slug"); const [yaml, setYaml] = useState("name: example\nversion: 1\nitems:\n  - one\n  - two"); const result = useMemo(() => { try { return { json: yamlToJson(yaml), toml: yamlToToml(yaml), error: "" }; } catch (error) { return { json: "", toml: "", error: error instanceof Error ? error.message : t("invalid") }; } }, [t, yaml]); return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="YAML JSON TOML converter" /><div className="mx-auto max-w-6xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("input")}<textarea value={yaml} onChange={e => setYaml(e.target.value)} rows={9} spellCheck={false} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" /></label>{result.error && <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{result.error}</p>}<div className="mt-6 grid gap-6 lg:grid-cols-2">{[[t("json"), result.json], [t("toml"), result.toml]].map(([label, value]) => <div key={label}><p className="text-sm font-semibold text-[#2D4D35]">{label}</p><textarea readOnly value={value} rows={9} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-[#F4F7F4] p-4 font-mono text-sm text-[#2D4D35]" /><button onClick={() => void navigator.clipboard.writeText(value)} disabled={!value} className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#2D4D35] px-4 py-2 text-sm font-semibold text-[#2D4D35] disabled:opacity-50"><Copy className="h-4 w-4" />{t("copy")}</button></div>)}</div></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
