"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronRight, Menu, PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { Link, stripLocalePrefix, useLocation } from "@/lib/router-compat";
import { DASHBOARD_CATEGORIES } from "@/lib/dashboards-config";
import { cn } from "@/lib/utils";

type NavbarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

const categoryLabels: Record<string, string> = {
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

export default function Navbar({ collapsed, onCollapsedChange }: NavbarProps) {
  const location = useLocation();
  const currentPath = stripLocalePrefix(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCategory = useMemo(
    () => DASHBOARD_CATEGORIES.find((category) => category.tools.some((tool) => tool.route === currentPath)),
    [currentPath]
  );
  const [openCategories, setOpenCategories] = useState<string[]>(activeCategory ? [activeCategory.slug] : []);

  useEffect(() => {
    if (!activeCategory) return;
    setOpenCategories((categories) => categories.includes(activeCategory.slug) ? categories : [...categories, activeCategory.slug]);
  }, [activeCategory]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const toggleCategory = (slug: string) => {
    setOpenCategories((categories) => categories.includes(slug)
      ? categories.filter((category) => category !== slug)
      : [...categories, slug]);
  };

  const navigation = (
    <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Tool categories">
      <div className="space-y-1">
        {DASHBOARD_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const expanded = openCategories.includes(category.slug);
          const hasActiveTool = category.tools.some((tool) => tool.route === currentPath);
          return (
            <div key={category.slug}>
              <div className={cn("flex items-center rounded-lg transition-colors", hasActiveTool && "bg-emerald-50 text-emerald-800")}>
                <button
                  type="button"
                  onClick={() => toggleCategory(category.slug)}
                  className="grid h-9 w-8 shrink-0 place-items-center text-slate-400 transition-colors hover:text-emerald-700"
                  aria-expanded={expanded}
                  aria-label={`${expanded ? "Collapse" : "Expand"} ${categoryLabels[category.slug]}`}
                >
                  {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                <Link
                  to={`/${category.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-w-0 flex-1 items-center gap-2 py-2 pr-2 text-sm font-medium text-slate-600 transition-colors hover:text-emerald-700"
                >
                  <Icon size={16} strokeWidth={1.8} className="shrink-0" />
                  <span className="truncate">{categoryLabels[category.slug]}</span>
                </Link>
              </div>
              {expanded && (
                <div className="ml-7 border-l border-slate-200 pb-1 pl-2">
                  {category.tools.map((tool) => {
                    const ToolIcon = tool.icon;
                    const isActive = tool.route === currentPath;
                    return (
                      <Link
                        key={`${category.slug}-${tool.id}`}
                        to={tool.route}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-2 text-[13px] leading-5 transition-colors",
                          isActive
                            ? "bg-emerald-100 font-semibold text-emerald-800"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        )}
                      >
                        <ToolIcon size={14} strokeWidth={1.8} className="shrink-0" />
                        <span className="truncate">{tool.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-slate-200 bg-white shadow-[4px_0_20px_rgba(15,23,42,0.04)] transition-transform duration-300 lg:flex",
          collapsed && "-translate-x-full"
        )}
      >
        <div className="relative h-36 shrink-0 overflow-hidden bg-gradient-to-br from-[#0b8060] via-[#0a9b70] to-[#18b887] px-4 pt-4">
          <div className="absolute -bottom-10 -left-8 h-20 w-56 rounded-[50%] bg-emerald-300/20" />
          <div className="absolute -bottom-10 left-20 h-16 w-64 rotate-[-6deg] rounded-[50%] bg-teal-200/20" />
          <div className="relative flex items-start justify-between">
            <Link to="/" className="block" aria-label="Tech Tools home">
              <Image src="/images/web-logo.png" alt="Tech Tools" width={112} height={52} className="h-[72px] w-auto object-contain object-left" priority />
              <p className="mt-1 text-[11px] font-medium tracking-wide text-white/85">Handy tools for developers</p>
            </Link>
            <button type="button" onClick={() => onCollapsedChange(true)} className="grid h-8 w-8 place-items-center rounded-md text-white/80 transition-colors hover:bg-white/15 hover:text-white" aria-label="Close tools sidebar">
              <PanelLeftClose size={19} />
            </button>
          </div>
        </div>
        {navigation}
      </aside>

      {collapsed && (
        <button
          type="button"
          onClick={() => onCollapsedChange(false)}
          className="fixed left-4 top-4 z-40 hidden h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-lg transition-colors hover:text-emerald-700 lg:grid"
          aria-label="Open tools sidebar"
        >
          <PanelLeftOpen size={20} />
        </button>
      )}

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <button type="button" onClick={() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg text-slate-600 hover:bg-slate-100" aria-label="Open tools sidebar" aria-expanded={mobileOpen}>
          <Menu size={23} />
        </button>
        <Link to="/" className="ml-3" aria-label="Tech Tools home">
          <Image src="/images/web-logo.png" alt="Tech Tools" width={104} height={52} className="h-9 w-auto" priority />
        </Link>
      </header>

      <div className={cn("fixed inset-0 z-50 bg-slate-950/35 transition-opacity lg:hidden", mobileOpen ? "opacity-100" : "pointer-events-none opacity-0")} onClick={() => setMobileOpen(false)} aria-hidden="true" />
      <aside className={cn("fixed inset-y-0 left-0 z-[60] flex w-[min(21rem,calc(100vw-1rem))] flex-col bg-white shadow-2xl transition-transform duration-300 lg:hidden", mobileOpen ? "translate-x-0" : "-translate-x-full")} aria-hidden={!mobileOpen}>
        <div className="relative h-36 shrink-0 overflow-hidden bg-gradient-to-br from-[#0b8060] via-[#0a9b70] to-[#18b887] px-5 pt-4">
          <div className="absolute -bottom-10 -left-8 h-20 w-56 rounded-[50%] bg-emerald-300/20" />
          <div className="absolute -bottom-10 left-20 h-16 w-64 rotate-[-6deg] rounded-[50%] bg-teal-200/20" />
          <div className="relative flex items-start justify-between">
            <Link to="/" className="block" aria-label="Tech Tools home" onClick={() => setMobileOpen(false)}>
              <Image src="/images/web-logo.png" alt="Tech Tools" width={112} height={52} className="h-[72px] w-auto object-contain object-left" priority />
              <p className="mt-1 text-[11px] font-medium tracking-wide text-white/85">Handy tools for developers</p>
            </Link>
            <button type="button" onClick={() => setMobileOpen(false)} className="grid h-8 w-8 place-items-center rounded-md text-white/80 transition-colors hover:bg-white/15 hover:text-white" aria-label="Close tools sidebar">
              <X size={20} />
            </button>
          </div>
        </div>
        {navigation}
      </aside>
    </>
  );
}
