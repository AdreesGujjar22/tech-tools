"use client";

import { useRef, useState } from "react";
import { Check, Copy, Download, Upload } from "lucide-react";
import SEO from "@/components/SEO";
import { downloadBase64File, fileToDataUri, parseBase64File } from "@/lib/final-tools-1";
import { useTranslations } from "next-intl";

export default function Base64FileConverter() {
  const t = useTranslations("Tools.Base64FileConverter");
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [filename, setFilename] = useState("download");
  const [extension, setExtension] = useState("bin");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const parsed = (() => { try { return value.trim() ? parseBase64File(value, extension) : null; } catch { return null; } })();
  const readFile = async (file?: File) => { if (!file) return; setError(""); setFilename(file.name.replace(/\.[^.]+$/, "") || "download"); setExtension(file.name.match(/\.([^.]+)$/)?.[1] || "bin"); setValue(await fileToDataUri(file)); };
  const copy = async () => { if (!parsed) return; await navigator.clipboard.writeText(parsed.dataUri); setCopied(true); window.setTimeout(() => setCopied(false), 1500); };
  return <main className="min-h-screen px-6 pb-20 pt-32 text-foreground"><SEO title={t("title")} description={t("description")} keywords="Base64 file converter data URI" /><div className="mx-auto max-w-5xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold lg:text-5xl">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8"><div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void readFile(event.dataTransfer.files[0]); }} onClick={() => inputRef.current?.click()} className="cursor-pointer rounded-2xl border-2 border-dashed border-[#A9C4AE] bg-white p-10 text-center text-[#2D4D35]"><Upload className="mx-auto mb-3" /><p className="font-semibold">{t("dropFile")}</p><p className="mt-1 text-sm text-[#4A6857]">{t("browse")}</p><input ref={inputRef} type="file" className="hidden" onChange={(event) => void readFile(event.target.files?.[0])} /></div><textarea value={value} onChange={(event) => { setValue(event.target.value); setError(""); }} rows={8} spellCheck={false} placeholder={t("pastePlaceholder")} className="mt-6 w-full rounded-xl border border-[#E0E0E0] bg-white p-4 font-mono text-sm text-[#2D4D35]" />{value && !parsed && <p className="mt-3 text-red-600">{error || t("invalid")}</p>}{parsed && <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => void copy()} className="inline-flex items-center gap-2 rounded-lg bg-[#2D4D35] px-4 py-2 text-white">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? t("copied") : t("copy")}</button><button type="button" onClick={() => downloadBase64File(parsed, `${filename}.${extension || parsed.extension}`)} className="inline-flex items-center gap-2 rounded-lg border border-[#2D4D35] px-4 py-2 text-[#2D4D35]"><Download size={16} />{t("download")}</button><span className="rounded-lg bg-white px-4 py-2 text-sm text-[#4A6857]">{parsed.mimeType}</span></div>}</section></div></main>;
}
