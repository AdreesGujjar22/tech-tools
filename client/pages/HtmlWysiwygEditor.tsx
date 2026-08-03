"use client";
import { useRef, useState } from "react";
import SEO from "@/components/SEO";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
const initialHtml = "<h1>Hey!</h1><p>Welcome to this HTML WYSIWYG editor</p>";
export default function HtmlWysiwygEditor() { const t = useTranslations("Tools.HtmlWysiwygEditor");
  const faqs = getFaqsForRoute("html-wysiwyg-editor"); const [html, setHtml] = useState(initialHtml); const editorRef = useRef<HTMLDivElement>(null); const command = (name: string, value?: string) => { editorRef.current?.focus(); document.execCommand(name, false, value); setHtml(editorRef.current?.innerHTML || ""); }; const update = () => setHtml(editorRef.current?.innerHTML || ""); const copy = () => void navigator.clipboard.writeText(html); return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="HTML WYSIWYG editor" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-6"><div className="mb-4 flex flex-wrap gap-2">{[["bold", t("bold")], ["italic", t("italic")], ["underline", t("underline")], ["formatBlock", "H2", "h2"], ["insertUnorderedList", t("bulletList")]].map(([commandName, label, value]) => <button key={label as string} onClick={() => command(commandName as string, value as string)} className="rounded-lg bg-[#E8F0E8] px-3 py-2 text-sm font-semibold text-[#2D4D35]">{label as string}</button>)}</div><div ref={editorRef} contentEditable suppressContentEditableWarning onInput={update} dangerouslySetInnerHTML={{ __html: html }} className="min-h-[300px] rounded-xl border border-[#E0E0E0] bg-white p-5 text-[#2D4D35] outline-none" /><div className="mt-6 flex items-center justify-between"><h2 className="font-bold text-[#2D4D35]">{t("htmlOutput")}</h2><button onClick={copy} className="rounded-xl bg-gradient-indigo-cyan px-5 py-3 font-semibold text-white">{t("copy")}</button></div><textarea readOnly value={html} rows={8} className="mt-3 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" /></section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>; }
