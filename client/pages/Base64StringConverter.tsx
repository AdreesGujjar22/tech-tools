"use client";

import { useMemo, useState } from "react";
import { Copy } from "lucide-react";
import SEO from "@/components/SEO";
import { decodeBase64Utf8, encodeBase64Utf8 } from "@/lib/math-media-1";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function Base64StringConverter() { const t = useTranslations("Tools.Base64StringConverter");
  const faqs = getFaqsForRoute("base64-string-converter"); const [text, setText] = useState("Hello, world!"); const [encoded, setEncoded] = useState(""); const [urlSafe, setUrlSafe] = useState(false); const decoded = useMemo(() => { if (!encoded) return { value: "", error: "" }; try { return { value: decodeBase64Utf8(encoded, urlSafe), error: "" }; } catch (error) { return { value: "", error: error instanceof Error ? error.message : t("invalid") }; } }, [encoded, t, urlSafe]); return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="Base64 UTF-8 URL safe encoder decoder" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="grid gap-6 lg:grid-cols-2"><div className="glass-card-dark rounded-[24px] p-7"><h2 className="text-xl font-bold text-[#2D4D35]">{t("encode")}</h2><textarea value={text} onChange={(event) => setText(event.target.value)} rows={7} className="mt-4 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 text-[#2D4D35]" /><pre className="mt-4 min-h-24 whitespace-pre-wrap break-all rounded-xl bg-[#F4F7F4] p-4 font-mono text-sm text-[#2D4D35]">{encodeBase64Utf8(text, urlSafe)}</pre><button type="button" onClick={() => void navigator.clipboard.writeText(encodeBase64Utf8(text, urlSafe))} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#2D4D35] px-4 py-2 text-sm font-semibold text-white"><Copy size={16} />{t("copy")}</button></div><div className="glass-card-dark rounded-[24px] p-7"><h2 className="text-xl font-bold text-[#2D4D35]">{t("decode")}</h2><textarea value={encoded} onChange={(event) => setEncoded(event.target.value)} rows={7} className="mt-4 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" />{decoded.error ? <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{decoded.error}</p> : <pre className="mt-4 min-h-24 whitespace-pre-wrap break-all rounded-xl bg-[#F4F7F4] p-4 text-sm text-[#2D4D35]">{decoded.value}</pre>}<button type="button" disabled={!decoded.value} onClick={() => void navigator.clipboard.writeText(decoded.value)} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#2D4D35] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"><Copy size={16} />{t("copy")}</button></div><label className="lg:col-span-2 text-sm font-semibold text-[#2D4D35]"><input type="checkbox" checked={urlSafe} onChange={(event) => setUrlSafe(event.target.checked)} className="mr-2" />{t("urlSafe")}</label></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
