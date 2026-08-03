"use client";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { decodeUrl, encodeUrl } from "@/lib/converter-tools";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
export default function UrlEncoderDecoder() { const t = useTranslations("Tools.UrlEncoderDecoder");
  const faqs = getFaqsForRoute("unknown-slug"); const [toEncode, setToEncode] = useState("Hello world :)"); const [toDecode, setToDecode] = useState("Hello%20world%20%3A)"); const encoded = useMemo(() => { try { return encodeUrl(toEncode); } catch { return ""; } }, [toEncode]); const decoded = useMemo(() => { try { return decodeUrl(toDecode); } catch { return ""; } }, [toDecode]); return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="URL encoder decoder percent encoding" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><div className="grid gap-6 lg:grid-cols-2">{[[t("encode"), toEncode, setToEncode, encoded, t("input"), t("output")], [t("decode"), toDecode, setToDecode, decoded, t("encodedInput"), t("output")]].map(([heading, input, setter, output, inputLabel, outputLabel]) => <section className="glass-card-dark rounded-[24px] p-8" key={heading as string}><h2 className="mb-5 text-xl font-bold text-[#2D4D35]">{heading as string}</h2><label className="block text-sm font-semibold text-[#2D4D35]">{inputLabel as string}<textarea value={input as string} onChange={e => (setter as (value: string) => void)(e.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 text-[#2D4D35]" /></label><label className="mt-5 block text-sm font-semibold text-[#2D4D35]">{outputLabel as string}<textarea readOnly value={output as string} rows={4} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 text-[#2D4D35]" /></label><button onClick={() => void navigator.clipboard.writeText(output as string)} className="mt-5 w-full rounded-xl bg-gradient-indigo-cyan px-5 py-3 font-semibold text-white">{t("copy")}</button></section>)}</div></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
