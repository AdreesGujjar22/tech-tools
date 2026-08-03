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

  const BASE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://www.ilovetechtools.com"
  ).replace(/\/$/, "");

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

  // Build breadcrumb schema itemListElement
  const breadcrumbItems: Array<{
    "@type": string;
    position: number;
    name: string;
    item: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${BASE_URL}/${locale}`,
    },
  ];

  items.forEach((item, index) => {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: index + 2,
      name: item.label,
      item: `${BASE_URL}/${locale}${item.href}`,
    });
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        suppressHydrationWarning
      />
      <div className="pt-20">
      </div>
    </>
  );
}
