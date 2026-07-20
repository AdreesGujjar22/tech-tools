"use client";

import { useState } from "react";
import SEO from "@/components/SEO";
import { HelpCircle, Search, Mail, BookOpen, ChevronDown, Users } from "lucide-react";
import { StaggerList } from "@/components/StaggerList";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "next-intl";
import { useLocale } from "@/lib/locale";

export default function Help() {
  const t = useTranslations("Help");
  const { locale } = useLocale();
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: t("faqs.safe.question"),
      a: t("faqs.safe.answer"),
    },
    {
      q: t("faqs.offline.question"),
      a: t("faqs.offline.answer"),
    },
    {
      q: t("faqs.accuracy.question"),
      a: t("faqs.accuracy.answer"),
    },
    {
      q: t("faqs.contact.question"),
      a: t("faqs.contact.answer"),
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(search.toLowerCase()) ||
    faq.a.toLowerCase().includes(search.toLowerCase())
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SEO
        title={t("meta.title")}
        description={t("meta.description")}
        keywords={t("meta.keywords")}
      />

      <main className="section-py section-px">
        <div className="container-full">
          {/* Header */}
          <div className="mb-12 text-center max-w-2xl mx-auto space-y-4 animate-fade-in">
            <Badge className="inline-flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              {t("badge")}
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight gradient-text">
              {t("title")}
            </h1>
            <p className="text-base text-muted-foreground">
              {t("description")}
            </p>

            {/* Support search input */}
            <div className="relative max-w-lg mx-auto mt-8">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="input-modern w-full pl-12"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start mt-12">
            {/* FAQs Accordion */}
            <div className="lg:col-span-8 space-y-4 animate-slide-up">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" /> {t("faqTitle")}
              </h2>

              {filteredFaqs.length > 0 ? (
                <StaggerList staggerDelay={0.1}>
                  {filteredFaqs.map((faq, index) => (
                    <div
                      key={index}
                      className="premium-card rounded-xl overflow-hidden border border-border/40 hover:shadow-lg transition-all"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-accent/30 transition-colors"
                      >
                        <span className="font-semibold">{faq.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${
                            openFaq === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openFaq === index && (
                        <div className="px-6 pb-6 pt-2 text-muted-foreground text-sm leading-relaxed border-t border-border">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </StaggerList>
              ) : (
                <div className="premium-card rounded-xl p-8 text-center text-muted-foreground border border-border/40">
                  {t("noResults", { search })}
                </div>
              )}
            </div>

            {/* Quick Contact & Resource Cards */}
            <div className="lg:col-span-4 space-y-6 animate-slide-down">
              <div className="premium-card p-6 rounded-xl border border-border/40 hover:shadow-lg transition-all">
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">{t("stillQuestions")}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">
                  {t("stillQuestionsText")}
                </p>
                <a
                  href="/contact-us"
                  className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg brand-gradient text-white font-semibold text-sm hover:brightness-110 transition-all"
                >
                  {t("submitTicket")}
                </a>
              </div>

              <div className="premium-card p-6 rounded-xl space-y-4 border border-border/40 hover:shadow-lg transition-all">
                <h3 className="font-bold text-base">{t("community")}</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{t("discord")}</h4>
                    <p className="text-xs text-muted-foreground">{t("communityMembers")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
