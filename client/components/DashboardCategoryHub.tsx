"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Heart, Search, ChevronRight } from "lucide-react";
import { Link, useLocation, stripLocalePrefix } from "@/lib/router-compat";
import SEO from "@/components/SEO";
import FaqSection from "@/components/FaqSection";
import { getFaqsForRoute } from "@/lib/faq-data";
import { dashboardBySlug } from "@/lib/dashboards-config";
import { useTranslations } from "next-intl";

const supportedLocales = ["de", "en", "es", "fr", "id", "it", "nl", "pt", "tr"] as const;

export default function DashboardCategoryHub({ slug }: { slug: string }) {
  const t = useTranslations("Tools.DashboardCategories");
  const category = dashboardBySlug[slug];
  const location = useLocation();
  const rawPath = location.pathname;
  const locale = supportedLocales.find((l) => rawPath.startsWith(`/${l}`)) || "en";

  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("dashboard-favorites");
    if (stored) setFavorites(JSON.parse(stored) as string[]);
  }, []);

  const filtered = useMemo(
    () =>
      category?.tools.filter((item) =>
        `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()),
      ) || [],
    [category, query],
  );

  if (!category) {
    return (
      <main className="min-h-screen px-6 pt-32 text-center text-foreground">
        Dashboard not found.
      </main>
    );
  }

  const toggleFavorite = (route: string) => {
    const next = favorites.includes(route)
      ? favorites.filter((item) => item !== route)
      : [...favorites, route];
    setFavorites(next);
    window.localStorage.setItem("dashboard-favorites", JSON.stringify(next));
  };

  const copyRoute = async (route: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}${route}`);
    setCopied(route);
    window.setTimeout(() => setCopied(""), 1400);
  };

  const Icon = category.icon;
  const faqs = getFaqsForRoute(category.slug, locale);

  return (
    <main className="min-h-screen bg-transparent pb-20 pt-4 text-foreground">
      <SEO
        title={t(`${category.titleKey}.title`)}
        description={t(`${category.titleKey}.description`)}
        keywords={`${category.titleKey} tools dashboard, developer utilities`}
        categoryName={category.title}
        isDashboard={true}
      />

      {/* Header Section */}
      <section className="border-b border-[#C5DCC9] bg-gradient-to-b from-[#F0F7F0] via-white to-transparent px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#10A968]/20 bg-[#10A968]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#10A968]">
                <Icon size={15} />
                <span>{t("dashboardBadge")}</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-[#1F3A26] sm:text-5xl">
                {t(`${category.titleKey}.title`)}
              </h1>
              <p className="mt-4 max-w-2xl text-[#4A6857]">
                {t(`${category.titleKey}.description`)}
              </p>
            </div>
            <div className="rounded-2xl border border-[#C5DCC9] bg-white px-5 py-4 text-center shadow-sm">
              <strong className="block text-2xl text-[#10A968]">{category.badgeCount}</strong>
              <span className="text-xs font-semibold text-[#4A6857]">{t("toolsCount")}</span>
            </div>
          </div>

          <div className="relative mt-10 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A6857]" size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-2xl border border-[#C5DCC9] bg-white py-4 pl-12 pr-4 text-[#2D4D35] shadow-lg outline-none focus:border-[#10A968]"
            />
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1F3A26]">
            {filtered.length} {t("matchingTools")}
          </h2>
          <Link to="/" className="text-sm font-semibold text-[#10A968]">
            {t("backToHub")}
          </Link>
        </div>

        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const ToolIcon = item.icon;
              const favorite = favorites.includes(item.route);
              return (
                <article
                  key={item.id}
                  className="group relative rounded-2xl border border-[#C5DCC9] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#10A968]/50 hover:shadow-xl"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0E8] text-[#10A968]">
                      <ToolIcon size={24} />
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.route)}
                        aria-label={t("favorite")}
                        className={`rounded-lg p-2 ${
                          favorite ? "text-red-500" : "text-[#8AA08F] hover:text-red-500"
                        }`}
                      >
                        <Heart size={18} fill={favorite ? "currentColor" : "none"} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void copyRoute(item.route)}
                        aria-label={t("copyLink")}
                        className="rounded-lg p-2 text-[#8AA08F] hover:text-[#10A968]"
                      >
                        {copied === item.route ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  <Link to={item.route} className="block">
                    <h3 className="text-lg font-bold text-[#1F3A26] group-hover:text-[#10A968]">
                      {item.title}
                    </h3>
                    <p className="mt-2 min-h-12 text-sm leading-relaxed text-[#4A6857]">
                      {item.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#10A968]">
                      {t("openTool")}
                      <ChevronRight size={16} />
                    </span>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#C5DCC9] bg-[#F0F7F0] p-16 text-center text-[#4A6857]">
            {t("noMatches")}
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <FaqSection items={faqs} title={`${category.title} FAQs`} />
    </main>
  );
}
