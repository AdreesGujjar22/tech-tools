"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Shield, Lock, Eye, Server, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function Privacy() {
  const t = useTranslations("Legal.privacy");
  const faqs = getFaqsForRoute("unknown-slug");
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
              {t("updated")}
            </p>
          </div>

          {/* Intro cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-[#C5DCC9] bg-[#F0F7F0] text-center flex flex-col items-center">
              <Lock className="w-8 h-8 text-[#10A968] mb-3" />
              <span className="text-xs font-bold text-[#2D4D35]">{t("clientSide")}</span>
            </div>
            <div className="p-5 rounded-xl border border-[#C5DCC9] bg-[#F0F7F0] text-center flex flex-col items-center">
              <Eye className="w-8 h-8 text-[#10A968] mb-3" />
              <span className="text-xs font-bold text-[#2D4D35]">{t("noCookies")}</span>
            </div>
            <div className="p-5 rounded-xl border border-[#C5DCC9] bg-[#F0F7F0] text-center flex flex-col items-center">
              <Server className="w-8 h-8 text-[#10A968] mb-3" />
              <span className="text-xs font-bold text-[#2D4D35]">{t("noDataSales")}</span>
            </div>
          </div>

          {/* Policy Text sections */}
          <div className="space-y-6 text-[#4A6857] leading-relaxed text-sm">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1F3A26]">{t("sections.scope.title")}</h2>
              {t.raw("sections.scope.paragraphs").map((paragraph: string) => <p key={paragraph}>{paragraph}</p>)}
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1F3A26]">{t("sections.cookies.title")}</h2>
              {t.raw("sections.cookies.paragraphs").map((paragraph: string) => <p key={paragraph}>{paragraph}</p>)}
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1F3A26]">{t("sections.thirdParty.title")}</h2>
              {t.raw("sections.thirdParty.paragraphs").map((paragraph: string) => <p key={paragraph}>{paragraph}</p>)}
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#1F3A26]">{t("sections.children.title")}</h2>
              {t.raw("sections.children.paragraphs").map((paragraph: string) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          </div>
        </div>
      

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </main>
    </div>
  );
}
