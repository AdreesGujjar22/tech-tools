import { Link } from "@/lib/router-compat";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";

export default function NotFound() {
  const t = useTranslations("NotFound");
  const faqs = getFaqsForRoute("unknown-slug");
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col">

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-[1280px] mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-7xl font-bold gradient-text">404</h1>
            <h2 className="text-4xl font-bold">{t("title")}</h2>
            <p className="text-lg text-[#4A6857] max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              to="/"
              className="px-8 py-3 rounded-[12px] brand-gradient text-white font-semibold hover:opacity-90 transition-opacity"
            >
              {t("backHome")}
            </Link>
            <Link
              to="/tools"
              className="px-8 py-3 rounded-[12px] border border-[#C5DCC9] text-[#2D4D35] bg-[#F0F7F0] font-semibold hover:bg-[#E8F0E8] transition-colors"
            >
              {t("goToTools")}
            </Link>
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
