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
  if (path === "/" || path.startsWith("/admin")) return null;

  const dashboard = DASHBOARD_CATEGORIES.find((category) => `/${category.slug}` === path);
  const tool = allDashboardTools.find((item) => item.route === path);
  const items = dashboard
    ? [{ label: categoryNames[dashboard.slug] ?? dashboard.title, href: path }]
    : tool
      ? [
          { label: categoryNames[tool.dashboard] ?? formatPath(tool.dashboard), href: `/${tool.dashboard}` },
          { label: tool.title, href: path },
        ]
      : [{ label: formatPath(path.slice(1)), href: path }];

  return (
    <nav aria-label="Breadcrumb" className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-4 py-3 text-xs text-slate-500 sm:px-6 lg:px-8">
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
    </nav>
  );
}
