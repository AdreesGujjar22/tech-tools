"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { BookOpen, HelpCircle, FileText, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Terms() {
  const t = useTranslations("Legal.terms");
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title={t("meta.title")}
        description={t("meta.description")}
        keywords={t("meta.keywords")}
      />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[800px] mx-auto space-y-8">
          {/* Header */}
          <div className="border-b border-[#C5DCC9] pb-6">
            <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-[#1F3A26] mb-2">
              {t("title")}
            </h1>
            <p className="text-sm text-[#4A6857]">
              {t("effective")}
            </p>
          </div>

          {/* Quick info grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#C5DCC9] bg-[#F0F7F0] flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#10A968] shrink-0" />
              <span className="text-xs text-[#2D4D35]">{t("freeUse")}</span>
            </div>
            <div className="p-4 rounded-xl border border-[#C5DCC9] bg-[#F0F7F0] flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-[#10A968] shrink-0" />
              <span className="text-xs text-[#2D4D35]">{t("commercialUse")}</span>
            </div>
          </div>

          {/* Terms sections */}
          <div className="space-y-6 text-[#4A6857] leading-relaxed text-sm">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1F3A26]">{t("sections.acceptance.title")}</h2>
              <p>{t("sections.acceptance.text")}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1F3A26]">{t("sections.license.title")}</h2>
              <p>{t("sections.license.text")}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1F3A26]">{t("sections.acceptableUse.title")}</h2>
              <p>{t("sections.acceptableUse.text")}</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1F3A26]">{t("sections.warranty.title")}</h2>
              <p>{t("sections.warranty.text")}</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
