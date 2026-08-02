"use client";

import { useNavigate, Link } from "@/lib/router-compat";
import Image from "next/image";
import SEO from "@/components/SEO";
import { useState } from "react";
import { Search, Clock, Eye, Share2, Sparkles, ShieldCheck, ShieldCheck as ShieldIcon, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StaggerList } from "@/components/StaggerList";
import { useTranslations } from "next-intl";
import { useLocale } from "@/lib/locale";
import { DASHBOARD_CATEGORIES } from "@/lib/dashboards-config";

const qrItems = [
  {
    id: 5,
    titleKey: "pdfDashboard",
    url: "/ilovepdf",
    type: "URL",

    preview: "/images/pdf.png",
  },
  {
    id: 6,
    titleKey: "imageDashboard",
    url: "/iloveimg",
    type: "URL",

    preview: "/images/image.png",
  },
  {
    id: 1,
    titleKey: "speedTest",
    url: "/speed-test",
    type: "URL",

    preview: "/images/speed-test.png",
  },
  {
    id: 2,
    titleKey: "typingSpeed",
    url: "/typing-speed",
    type: "URL",

    preview: "/images/typing-speed.png",
  },
  {
    id: 3,
    titleKey: "colorPicker",
    url: "/color-picker",
    type: "URL",

    preview: "/images/color-picker.png",
  },
  {
    id: 4,
    titleKey: "qrGenerator",
    url: "/qr-generator",
    type: "URL",

    preview: "/images/qr-code-generation.png",
  },
  {
    id: 7,
    titleKey: "barcodeGenerator",
    url: "/barcode-generator",
    type: "URL",

    preview: "/images/bar-code-generation.png",
  },
  {
    id: 8,
    titleKey: "barcodeReader",
    url: "/barcode-reader",
    type: "URL",

    preview: "/images/qr-code-generation.png",
  },
  {
    id: 9,
    titleKey: "passwordGenerator",
    url: "/password-generator",
    type: "URL",

    preview: "/images/password-generator.png",
  },
  {
    id: 9,
    titleKey: "loremGenerator",
    url: "/lorem-ipsum-generator",
    type: "URL",

    preview: "/images/lorem-ipsum-generator.png",
  },
  {
    id: 10,
    titleKey: "emojiPicker",
    url: "/emoji-picker",
    type: "URL",

    preview: "/images/emoji-picker-copier.png",
  },
  {
    id: 11,
    titleKey: "notepad",
    url: "/notepad",
    type: "URL",

    preview: "/images/online-notepad.png",
  },
];

export default function Index() {
  const t = useTranslations("Home");
  const common = useTranslations("Common");
  const { locale } = useLocale();
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>, title: string, url: string) => {
    e.stopPropagation();
    const shareData = {
      title: title,
      text: common("messages.checkOutTool"),
      url: url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback: show alert if clipboard fails (e.g., document not focused)
      if (err instanceof Error && err.name === "NotAllowedError") {
        alert(common("messages.link", { url: shareData.url }));
      } else {
        console.error("Failed to copy link: ", err);
      }
    }
  };

  const currentDate = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const localizedItems = qrItems.map((item) => ({
    ...item,
    title: t(`toolCards.${item.titleKey}`),
    date: currentDate,
  }));
  const filteredItems = localizedItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title={t("meta.title")}
        description={t("meta.description")}
        keywords={t("meta.keywords")}
      />

      {/* Hero Section */}
      <section className="pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 w-full h-[20rem] sm:h-[28rem] bg-hero-radial pointer-events-none" style={{ top: 0 }} />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 w-fit px-3 sm:px-4 py-2 rounded-full border border-white/20 bg-white/5 dark:bg-white/[0.03] backdrop-blur-sm">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold tracking-wide uppercase">{t("badge")}</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 sm:space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                {t("title")}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                {t("description")}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="#tools"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-2xl brand-gradient text-white text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-[#10A968]/30 transition-all"
              >
                {t("startTools")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about-us"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-2xl border border-[#C5DCC9] bg-[#F0F7F0] hover:bg-[#E8F0E8] text-[#2D4D35] text-sm sm:text-base font-semibold transition-all"
              >
                {common("actions.learnMore")}
              </Link>
            </div>

            {/* Short Intro Paragraph */}
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              {t("intro")}
            </p>
          </div>

          {/* Right Preview */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-6 bg-[#10A968]/10 blur-3xl rounded-full pointer-events-none" />
              <div className="relative rounded-2xl sm:rounded-3xl backdrop-blur-md bg-white/10 dark:bg-white/[0.05] border border-white/10 p-6 sm:p-10 shadow-2xl">
                <div className="aspect-square rounded-2xl bg-white p-6 flex items-center justify-center">
                  <Image
                    src="/images/hero-section.png"
                    alt={t("previewAlt")}
                    width={400}
                    height={400}
                    priority
                    quality={75}
                    sizes="(max-width: 1023px) 0px, 400px"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Badge */}
                <div className="absolute bottom-6 left-6 p-3 rounded-2xl brand-gradient shadow-lg">
                  <ShieldIcon className="w-5 h-5 text-white" />
                </div>

                {/* Info Badge */}
                <div className="absolute top-6 right-6 px-4 py-2 rounded-2xl border border-[#C5DCC9] bg-[#F0F7F0]/70 backdrop-blur-md flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10A968]" />
                  <span className="text-[#2D4D35] text-sm font-medium">{t("encoded")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="bg-transparent text-foreground">
        <main className="section-py section-px">
          <div className="container-full">
            {/* Header */}
            <section className="relative overflow-hidden border-b border-[#C5DCC9] bg-gradient-to-b from-[#F0F7F0] via-white to-transparent pb-24">
              <div className="absolute inset-0 bg-radial-at-t from-[#10A968]/10 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-20 right-10 w-96 h-96 bg-[#10A968]/5 blur-[120px] rounded-full pointer-events-none" />

              <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-3 py-1 pb-1.5 rounded-full bg-[#10A968]/10 border border-[#10A968]/20 text-[#10A968] text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse"
                >
                  <span className="w-1.5 h-1.5 bg-[#10A968] rounded-full" />
                  {common("labels.allUtilities")}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-[#1F3A26] mb-6"
                >
                  {t("toolsTitle")}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-[#4A6857]/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-10"
                >
                  {t("toolsDescription")}
                </motion.p>

                {/* Interactive Search Grid Controls */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="max-w-xl mx-auto flex items-center bg-white border border-[#C5DCC9] rounded-2xl p-1.5 shadow-lg focus-within:border-[#10A968]/40 transition"
                >
                  <div className="flex items-center pl-3 text-[#4A6857]">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 ring-0 focus:outline-none focus:ring-0 p-3 text-sm text-[#2D4D35] placeholder-[#999B99] font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1 px-2.5 text-xs text-[#4A6857] bg-[#E8F0E8] hover:bg-[#D4E8D8] border border-[#C5DCC9] rounded-xl transition cursor-pointer"
                    >
                      {common("actions.clear")}
                    </button>
                  )}
                </motion.div>
              </div>
            </section>

            {/* Category dashboards */}
            <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {DASHBOARD_CATEGORIES.map((dashboard) => {
                const DashboardIcon = dashboard.icon;
                return <button key={dashboard.slug} type="button" onClick={() => navigate(`/${dashboard.slug}`)} className="group relative rounded-2xl border border-[#10A968]/30 bg-gradient-to-br from-[#F0F7F0] to-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <span className="absolute right-4 top-4 rounded-full bg-[#10A968] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Dashboard</span>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0E8] text-[#10A968]"><DashboardIcon size={25} /></div>
                  <h3 className="text-lg font-bold text-[#1F3A26] group-hover:text-[#10A968]">{dashboard.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#4A6857]">{dashboard.description}</p>
                  <span className="mt-4 block text-xs font-bold text-[#10A968]">{dashboard.badgeCount} tools</span>
                </button>;
              })}
            </div>

            {/* Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="premium-card p-12 text-center text-[#4A6857] mb-12 rounded-2xl border border-[#C5DCC9]/40 bg-white">
                {t("noResults")}
              </div>
            ) : (
              <StaggerList staggerDelay={0.08} className="grid-auto-fit mb-12">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="premium-card p-5 flex flex-col gap-4 cursor-pointer group rounded-xl border border-[#C5DCC9]/40 bg-white hover:shadow-lg hover:-translate-y-2 transition-all"
                    onClick={() => navigate(item.url)}
                  >
                    {/* Preview */}
                    <div className="aspect-square rounded-lg bg-white p-4 flex items-center justify-center overflow-hidden relative">
                      <Image
                        src={item.preview || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg leading-tight text-[#1F3A26]">{item.title}</h3>
                      <div className="flex items-center gap-1.5 text-[#4A6857]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">{item.date}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 py-2 rounded-lg bg-[#E8F0E8] text-[#2D4D35] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#D4E8D8] transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                        {common("actions.view")}
                      </button>
                      <div className="relative inline-block w-auto">
                        <button
                          onClick={(e) => handleShare(e, item.title, item.url)}
                          className="py-2 px-3 rounded-lg bg-[#E8F0E8] text-[#2D4D35] font-semibold text-xs hover:bg-[#D4E8D8] transition-colors flex items-center justify-center"
                          aria-label={common("a11y.sharePage")}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {copied && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium text-white bg-emerald-600 rounded shadow-md pointer-events-none animate-fade-in whitespace-nowrap">
                            {common("messages.copiedLink")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </StaggerList>
            )}

            {/* CTA */}
            <div className="premium-card p-12 sm:p-16 text-center space-y-6 rounded-2xl border border-[#C5DCC9]/40 bg-white animate-fade-in-scale">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-lg bg-[#F0F7F0] border border-[#C5DCC9]">
                <Sparkles className="w-7 h-7 text-[#10A968]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1F3A26]">{t("ctaTitle")}</h3>
              <p className="text-base text-[#4A6857] max-w-md mx-auto">
                {t("ctaDescription")}
              </p>
              <button
                className="btn-primary mx-auto px-8"
                onClick={() => navigate("/contact-us")}
              >
                {t("contactUs")}
              </button>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
