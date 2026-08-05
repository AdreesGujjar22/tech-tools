"use client";

import { ChevronRight, Home } from "lucide-react";
import { Link, stripLocalePrefix, useLocation } from "@/lib/router-compat";
import { allDashboardTools, DASHBOARD_CATEGORIES } from "@/lib/dashboards-config";
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
      item: `${BASE_URL}/`,
    },
  ];

  items.forEach((item, index) => {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: index + 2,
      name: item.label,
      item: `${BASE_URL}${item.href}`,
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
      <nav
        aria-label="Breadcrumb"
        className="border-b border-slate-200/80 bg-white/70 px-4 pb-3 pt-16 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/70 sm:px-6"
      >
        <ol className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
          <li>
            <Link
              to="/"
              aria-label="Home"
              className="inline-flex items-center rounded-md p-1.5 transition-colors hover:bg-emerald-50 hover:text-[#10A968] dark:hover:bg-emerald-950/40"
            >
              <Home size={16} aria-hidden="true" />
            </Link>
          </li>
          {items.map((item) => (
            <li key={`${item.href}-${item.label}`} className="flex items-center gap-2">
              <ChevronRight size={14} aria-hidden="true" className="shrink-0 text-slate-400" />
              <Link
                to={item.href}
                aria-current={item.href === path ? "page" : undefined}
                className="rounded-md px-1.5 py-1 transition-colors hover:text-[#10A968]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
