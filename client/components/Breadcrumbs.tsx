"use client";

import Image from "next/image";
import { ChevronRight, Home, Languages } from "lucide-react";
import { Link, stripLocalePrefix, useLocation } from "@/lib/router-compat";
import { allDashboardTools, DASHBOARD_CATEGORIES } from "@/lib/dashboards-config";
import { useLocale } from "@/lib/locale";
import { supportedLocales, type Locale } from "../../messages";

const localeLabels: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  id: "Bahasa Indonesia",
  it: "Italiano",
  nl: "Nederlands",
  pt: "Português",
  tr: "Türkçe",
};

const categoryNames: Record<string, string> = {
  "pdf-tools-dashboard": "PDF Tools",
  "image-tools-dashboard": "Images & Videos",
  "crypto-security-dashboard": "Crypto & Security",
  "converter-tools-dashboard": "Converter",
  "web-tools-dashboard": "Web",
  "developer-tools-dashboard": "Development",
  "network-tools-dashboard": "Network",
  "text-data-dashboard": "Text & Data",
  "math-media-dashboard": "Math & Media",
};

function formatPath(path: string) {
  return path
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const { locale, setLocale } = useLocale();
  const path = stripLocalePrefix(pathname);
  if (path.startsWith("/admin")) return null;

  const dashboard = DASHBOARD_CATEGORIES.find((category) => `/${category.slug}` === path);
  const tool = allDashboardTools.find((item) => item.route === path);
  const items = path === "/"
    ? []
    : dashboard
      ? [{ label: categoryNames[dashboard.slug] ?? dashboard.title, href: path }]
      : tool
        ? [
            { label: categoryNames[tool.dashboard] ?? formatPath(tool.dashboard), href: `/${tool.dashboard}` },
            { label: tool.title, href: path },
          ]
        : [{ label: formatPath(path.slice(1)), href: path }];

  return (
    <div className="border-b border-[#C5DCC9] bg-gradient-to-r from-[#F0F7F0] via-white to-white">
      <nav aria-label="Breadcrumb" className="mx-auto flex max-w-[1280px] items-center gap-4 px-6 py-3 sm:gap-6">
        <Link to="/" className="shrink-0 transition-opacity hover:opacity-80" aria-label="Tech Tools home">
          <Image src="/images/web-logo.png" alt="Tech Tools" width={84} height={60} className="h-[72px] w-auto" priority />
        </Link>
        <div className="hidden h-7 w-px bg-[#C5DCC9] sm:block" />
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto text-xs text-slate-500">
          <Link to="/" className="inline-flex shrink-0 items-center gap-1.5 transition-colors hover:text-emerald-700">
            <Home size={13} />
            <span>Home</span>
          </Link>
          {items.map((item, index) => (
            <span key={`${item.href}-${item.label}`} className="inline-flex shrink-0 items-center gap-1.5">
              <ChevronRight size={13} className="text-slate-300" />
              {index === items.length - 1 ? (
                <span className="font-medium text-slate-700" aria-current="page">{item.label}</span>
              ) : (
                <Link to={item.href} className="transition-colors hover:text-emerald-700">{item.label}</Link>
              )}
            </span>
          ))}
        </div>
        <label className="relative flex shrink-0 items-center text-[#4A6857]">
          <Languages size={16} className="pointer-events-none absolute left-3" />
          <span className="sr-only">Select language</span>
          <select
            value={locale}
            onChange={(event) => setLocale(event.target.value as Locale)}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-[#C5DCC9] bg-white py-1 pl-9 pr-8 text-xs font-medium text-[#4A6857] outline-none transition-colors hover:border-[#10A968] focus:border-[#10A968] focus:ring-2 focus:ring-[#10A968]/20"
            aria-label="Select language"
          >
            {supportedLocales.map((supportedLocale) => (
              <option key={supportedLocale} value={supportedLocale}>{localeLabels[supportedLocale]}</option>
            ))}
          </select>
          <ChevronRight size={14} className="pointer-events-none absolute right-2 rotate-90" />
        </label>
      </nav>
    </div>
  );
}
