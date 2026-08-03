"use client";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { jsonToYaml, yamlToJson } from "@/lib/converter-tools";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
export default function JsonYamlConverter() { const t = useTranslations("Tools.JsonYamlConverter");
  const faqs = getFaqsForRoute("json-yaml-converter"); const [json, setJson] = useState('{"hello":"world","items":[1,2,3]}'); const [yaml, setYaml] = useState("hello: world\nitems:\n  - 1\n  - 2\n  - 3"); const jsonResult = useMemo(() => { try { return jsonToYaml(json); } catch { return ""; } }, [json]); const yamlResult = useMemo(() => { try { return yamlToJson(yaml); } catch { return ""; } }, [yaml]); return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="JSON YAML converter" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><div className="grid gap-6 lg:grid-cols-2"><section className="glass-card-dark rounded-[24px] p-8"><h2 className="mb-5 text-xl font-bold text-[#2D4D35]">{t("jsonToYaml")}</h2><textarea value={json} onChange={e => setJson(e.target.value)} rows={12} placeholder={t("jsonPlaceholder")} className="w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" /><textarea readOnly value={jsonResult} rows={12} className="mt-4 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" /><button onClick={() => void navigator.clipboard.writeText(jsonResult)} className="mt-4 w-full rounded-xl bg-gradient-indigo-cyan px-5 py-3 font-semibold text-white">{t("copy")}</button></section><section className="glass-card-dark rounded-[24px] p-8"><h2 className="mb-5 text-xl font-bold text-[#2D4D35]">{t("yamlToJson")}</h2><textarea value={yaml} onChange={e => setYaml(e.target.value)} rows={12} placeholder={t("yamlPlaceholder")} className="w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" /><textarea readOnly value={yamlResult} rows={12} className="mt-4 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" /><button onClick={() => void navigator.clipboard.writeText(yamlResult)} className="mt-4 w-full rounded-xl bg-gradient-indigo-cyan px-5 py-3 font-semibold text-white">{t("copy")}</button></section></div></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
