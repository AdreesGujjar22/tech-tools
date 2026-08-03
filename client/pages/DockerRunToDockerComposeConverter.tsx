"use client";
import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { dockerRunToCompose } from "@/lib/dev-tools-3";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
export default function DockerRunToDockerComposeConverter() { const t = useTranslations("Tools.DockerRunToDockerComposeConverter");
  const faqs = getFaqsForRoute("docker-run-to-docker-compose-converter"); const [input, setInput] = useState("docker run -d --name web -p 8080:80 -v ./html:/usr/share/nginx/html:ro -e NODE_ENV=production --restart always nginx:latest"); const result = useMemo(() => { try { return { output: dockerRunToCompose(input), error: "" }; } catch (error) { return { output: "", error: error instanceof Error ? error.message : t("invalid") }; } }, [input, t]); return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="Docker run compose YAML converter" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><label className="block text-sm font-semibold text-[#2D4D35]">{t("input")}<textarea value={input} onChange={e => setInput(e.target.value)} rows={4} spellCheck={false} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" /></label>{result.error && <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{result.error}</p>}<label className="mt-6 block text-sm font-semibold text-[#2D4D35]">{t("output")}<textarea readOnly value={result.output} rows={14} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-[#F4F7F4] p-4 font-mono text-sm text-[#2D4D35]" /></label><button onClick={() => void navigator.clipboard.writeText(result.output)} disabled={!result.output} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2D4D35] px-5 py-3 font-semibold text-white disabled:opacity-50"><Copy className="h-4 w-4" />{t("copy")}</button></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
