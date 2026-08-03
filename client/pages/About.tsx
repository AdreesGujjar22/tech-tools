import { Link } from "@/lib/router-compat";
import { StaggerList } from "@/components/StaggerList";
import { useTranslations } from "next-intl";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
import {
  Barcode,
  FileText,
  Gauge,
  ImageIcon,
  Keyboard,
  LockKeyhole,
  Notebook,
  Palette,
  QrCode,
  Ruler,
  Smile,
} from "lucide-react";

export default function About() {
  const t = useTranslations("About");
  const faqs = getFaqsForRoute("unknown-slug");
  const common = useTranslations("Common");
  return (
    <div className="min-h-screen bg-transparent text-foreground">
      {/* Hero Section */}
      <section className="section-py section-px relative overflow-hidden">
        {/* Background Gradient */}
        <div
          className="absolute inset-0 w-full h-96 bg-hero-radial pointer-events-none"
          style={{ top: "0" }}
        />

        <div className="container-full relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight gradient-text">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("intro")}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t("mission")}
            </p>
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="section-py section-px bg-card/30">
        <div className="container-full">
          <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold">{t("popularTools")}</h2>
            <p className="text-muted-foreground">
              {t("popularDescription")}
            </p>
          </div>

          <StaggerList staggerDelay={0.1} className="grid-auto-fit">
            {/* Tool 1 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Gauge className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("tools.speed.name")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("tools.speed.description")}
                </p>
              </div>
              <Link
                to="/speed-test"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                {common("actions.tryNow")} →
              </Link>
            </div>

            {/* Tool 2 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("tools.color.name")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("tools.color.description")}
                </p>
              </div>
              <Link
                to="/color-picker"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                {common("actions.tryNow")} →
              </Link>
            </div>

            {/* Tool 3 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Keyboard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("tools.typing.name")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("tools.typing.description")}
                </p>
              </div>
              <Link
                to="/typing-speed"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                {common("actions.tryNow")} →
              </Link>
            </div>

            {/* Tool 4 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("tools.qr.name")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("tools.qr.description")}
                </p>
              </div>
              <Link
                to="/qr-generator"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                {common("actions.tryNow")} →
              </Link>
            </div>

            {/* Tool 5 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Barcode className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("tools.barcode.name")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("tools.barcode.description")}
                </p>
              </div>
              <Link
                to="/barcode-generator"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                {common("actions.tryNow")} →
              </Link>
            </div>

            {/* Tool 6 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <LockKeyhole className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("tools.password.name")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("tools.password.description")}
                </p>
              </div>
              <Link
                to="/password-generator"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                {common("actions.tryNow")} →
              </Link>
            </div>

            {/* Tool 7 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("tools.lorem.name")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("tools.lorem.description")}
                </p>
              </div>
              <Link
                to="/lorem-ipsum-generator"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                {common("actions.tryNow")} →
              </Link>
            </div>

            {/* Tool 8 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Smile className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("tools.emoji.name")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("tools.emoji.description")}
                </p>
              </div>
              <Link
                to="/emoji-picker"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                {common("actions.tryNow")} →
              </Link>
            </div>

            {/* Tool 9 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Notebook className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("tools.notepad.name")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("tools.notepad.description")}
                </p>
              </div>
              <Link
                to="/notepad"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                {common("actions.tryNow")} →
              </Link>
            </div>

            {/* Tool 10 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("tools.image.name")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("tools.image.description")}
                </p>
              </div>
              <Link
                to="/tools"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                {common("actions.tryNow")} →
              </Link>
            </div>

            {/* Tool 6 */}
            <div className="premium-card p-8 flex flex-col justify-between border border-border/40 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center">
                  <Ruler className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("tools.unit.name")}</h3>
                <p className="text-muted-foreground text-sm">
                  {t("tools.unit.description")}
                </p>
              </div>
              <Link
                to="/tools"
                className="mt-6 text-primary font-medium text-sm border-b border-primary/30 pb-1 hover:border-primary transition-colors w-fit"
              >
                {common("actions.tryNow")} →
              </Link>
            </div>
          </StaggerList>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-bg-alt section-py section-px">
        <div className="container-full">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold">{t("impact")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("impactDescription")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold gradient-text">50+</div>
              <div className="text-muted-foreground">{t("stats.tools")}</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold gradient-text">10K+</div>
              <div className="text-muted-foreground">{t("stats.monthlyUsers")}</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold gradient-text">Fast</div>
              <div className="text-muted-foreground">{t("stats.secure")}</div>
            </div>
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold gradient-text">24/7</div>
              <div className="text-muted-foreground">{t("stats.available")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-py section-px">
        <div className="container-wide">
          <div className="glass-card p-12 sm:p-16 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-cta pointer-events-none" />
            <div className="relative flex flex-col items-center gap-6 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold">{t("ctaTitle")}</h2>
              <p className="text-lg text-muted-foreground">
                {t("ctaDescription")}
              </p>
              <Link
                to="/tools"
                className="btn-primary px-8"
              >
                {t("exploreAll")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FaqSection items={faqs} title="Frequently Asked Questions" />
      )}
    </div>
  );
}
