"use client";

import { useRef, useState } from "react";
import { FileCheck2, Upload } from "lucide-react";
import SEO from "@/components/SEO";
import { inspectPdfSignatures, type PdfSignatureInfo } from "@/lib/crypto-sec-4";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function PdfSignatureChecker() {
  const t = useTranslations("Tools.PdfSignatureChecker");
  const faqs = getFaqsForRoute("pdf-signature-checker"); const inputRef = useRef<HTMLInputElement>(null); const [fileName, setFileName] = useState(""); const [signatures, setSignatures] = useState<PdfSignatureInfo[]>([]); const [error, setError] = useState(""); const [dragging, setDragging] = useState(false);
  const inspect = async (file?: File) => { if (!file) return; setFileName(file.name); setError(""); setSignatures([]); try { setSignatures(inspectPdfSignatures(await file.arrayBuffer())); } catch (reason) { setError(reason instanceof Error ? reason.message : t("invalid")); } };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="PDF digital signature checker ByteRange Contents" /><div className="mx-auto max-w-4xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); void inspect(event.dataTransfer.files[0]); }} className={`flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${dragging ? "border-[#2D4D35] bg-[#F4F7F4]" : "border-[#C8D5CA]"}`}><Upload size={32} className="text-[#2D4D35]" /><span className="mt-3 font-semibold text-[#2D4D35]">{t("dropFile")}</span><span className="mt-1 text-sm text-[#4A6857]">{t("pdfOnly")}</span><input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => void inspect(event.target.files?.[0])} /></button>{fileName && <p className="mt-4 text-sm text-[#4A6857]">{fileName}</p>}{error && <p className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}{fileName && !error && signatures.length === 0 && <div className="mt-6 rounded-xl bg-amber-50 p-5 text-sm text-amber-800">{t("noneFound")}</div>}{signatures.length > 0 && <div className="mt-6 space-y-4">{signatures.map((signature) => <div key={signature.index} className="rounded-xl bg-[#F4F7F4] p-5"><div className="flex items-center gap-2 font-semibold text-[#2D4D35]"><FileCheck2 size={19} />{t("signature")} {signature.index}</div><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div><dt className="text-[#4A6857]">{t("byteRange")}</dt><dd className="mt-1 break-all font-mono text-[#2D4D35]">{signature.byteRange}</dd></div><div><dt className="text-[#4A6857]">{t("contents")}</dt><dd className="mt-1 text-[#2D4D35]">{signature.contentsLength} {t("bytes")}</dd></div><div><dt className="text-[#4A6857]">{t("signatureObject")}</dt><dd className="mt-1 text-[#2D4D35]">{signature.hasSignatureObject ? t("detected") : t("notDetected")}</dd></div></dl></div>)}</div>}</section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
