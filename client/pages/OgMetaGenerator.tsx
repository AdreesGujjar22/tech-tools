"use client";
import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { generateOpenGraphTags, type OpenGraphValues } from "@/lib/web-tools-2";
import { useTranslations } from "next-intl";

const initialValues: OpenGraphValues = { title: "My website", description: "A short description of my website.", url: "https://example.com", image: "https://example.com/image.jpg", siteName: "My website", type: "website", twitterCard: "summary_large_image", twitterCreator: "" };
export default function OgMetaGenerator() {
  const t = useTranslations("Tools.OgMetaGenerator");
  const [values, setValues] = useState(initialValues);
  const tags = useMemo(() => generateOpenGraphTags(values), [values]);
  const update = (key: keyof OpenGraphValues, value: string) => setValues(current => ({ ...current, [key]: value }));
  const fields: Array<[keyof OpenGraphValues, string]> = [["title", t("titleLabel")], ["description", t("descriptionLabel")], ["url", t("url")], ["image", t("image")], ["siteName", t("siteName")], ["type", t("type")], ["twitterCard", t("twitterCard")], ["twitterCreator", t("twitterCreator")]];
  const copy = () => void navigator.clipboard.writeText(tags);
  return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("pageTitle")} description={t("description")} keywords="Open Graph meta tags SEO Twitter Cards" /><div className="mx-auto max-w-6xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold">{t("pageTitle")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><div className="grid gap-6 lg:grid-cols-2"><section className="glass-card-dark rounded-[24px] p-8"><h2 className="mb-5 text-xl font-bold text-[#2D4D35]">{t("fields")}</h2><div className="space-y-4">{fields.map(([key, label]) => <label className="block text-sm font-semibold text-[#2D4D35]" key={key}>{label}<input value={values[key]} onChange={e => update(key, e.target.value)} className="mt-2 w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-[#2D4D35]" /></label>)}</div></section><section className="glass-card-dark rounded-[24px] p-8"><div className="flex items-center justify-between gap-4"><h2 className="text-xl font-bold text-[#2D4D35]">{t("output")}</h2><button onClick={copy} className="rounded-xl bg-[#2D4D35] px-4 py-2 text-sm font-semibold text-white">{t("copy")}</button></div><pre className="mt-5 max-h-[600px] overflow-auto whitespace-pre-wrap break-all rounded-xl bg-[#F4F7F4] p-4 text-sm text-[#2D4D35]">{tags}</pre></section></div></div></main>;
}
