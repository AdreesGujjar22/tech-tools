"use client";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { getDeviceInformation, type DeviceInformation as DeviceInfo } from "@/lib/web-tools-2";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function DeviceInformation() {
  const t = useTranslations("Tools.DeviceInformation");
  const faqs = getFaqsForRoute("device-information");
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  useEffect(() => { const update = () => setInfo(getDeviceInformation()); update(); window.addEventListener("resize", update); window.addEventListener("online", update); window.addEventListener("offline", update); return () => { window.removeEventListener("resize", update); window.removeEventListener("online", update); window.removeEventListener("offline", update); }; }, []);
  const rows = info ? [[t("screenWidth"), `${info.screenWidth}px`], [t("screenHeight"), `${info.screenHeight}px`], [t("devicePixelRatio"), info.devicePixelRatio], [t("colorDepth"), `${info.colorDepth} bit`], [t("touchSupport"), info.touchSupport ? t("yes") : t("no")], [t("online"), info.online ? t("yes") : t("no")]] : [];
  return <main className="min-h-screen px-6 pt-32 pb-20 text-foreground"><SEO title={t("title")} description={t("description")} keywords="device information screen browser" /><div className="mx-auto max-w-3xl"><header className="mb-10 text-center"><h1 className="gradient-text text-4xl font-bold">{t("title")}</h1><p className="mt-3 text-[#4A6857]">{t("description")}</p></header><section className="glass-card-dark rounded-[24px] p-8">{info ? <dl className="space-y-4">{rows.map(([label, value]) => <div className="flex items-center justify-between gap-4 border-b border-[#E0E0E0] pb-3" key={label}><dt className="text-[#4A6857]">{label}</dt><dd className="font-semibold text-[#2D4D35]">{value}</dd></div>)}</dl> : <p className="text-center text-[#4A6857]">{t("loading")}</p>}</section></div>

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>;
}
