"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
  Moon,
  Globe,
  Heart,
  X,
  Sparkles,
  LayoutGrid,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  ArrowRightLeft,
  Code2,
  Network,
  Type,
  Calculator,
  HelpCircle,
  FolderTree
} from "lucide-react";
import { Link, stripLocalePrefix, useLocation } from "@/lib/router-compat";
import { DASHBOARD_CATEGORIES } from "@/lib/dashboards-config";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/locale";
import { useTheme } from "@/lib/theme";
import SearchModal from "@/components/SearchModal";

type NavbarProps = {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
};

const categoryLabels: Record<string, string> = {
  "pdf-tools-dashboard": "PDF Tools",
  "image-tools-dashboard": "Images & Videos",
  "crypto-security-dashboard": "Crypto & Security",
  "converter-tools-dashboard": "Converter",
  "web-tools-dashboard": "Web Tools",
  "developer-tools-dashboard": "Developer Tools",
  "network-tools-dashboard": "Network Tools",
  "text-data-dashboard": "Text & Data",
  "math-media-dashboard": "Math & Media",
};

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "id", label: "Indonesia", flag: "🇮🇩" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
] as const;

export default function Navbar({ collapsed, onCollapsedChange }: NavbarProps) {
  const location = useLocation();
  const currentPath = stripLocalePrefix(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [sidebarFilter, setSidebarFilter] = useState("");
  const [favoritesCount, setFavoritesCount] = useState(0);

  const { locale, setLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();

  // Load favorites count
  useEffect(() => {
    const updateFavorites = () => {
      try {
        const stored = window.localStorage.getItem("dashboard-favorites");
        if (stored) {
          const parsed = JSON.parse(stored);
          setFavoritesCount(Array.isArray(parsed) ? parsed.length : 0);
        }
      } catch (e) {
        setFavoritesCount(0);
      }
    };
    updateFavorites();
    window.addEventListener("storage", updateFavorites);
    return () => window.removeEventListener("storage", updateFavorites);
  }, [currentPath]);

  // Command+K or Ctrl+K shortcut listener for global search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const activeCategory = useMemo(
    () => DASHBOARD_CATEGORIES.find((category) => category.tools.some((tool) => tool.route === currentPath)),
    [currentPath]
  );

  const [openCategories, setOpenCategories] = useState<string[]>(
    activeCategory ? [activeCategory.slug] : ["pdf-tools-dashboard", "developer-tools-dashboard"]
  );

  useEffect(() => {
    if (!activeCategory) return;
    setOpenCategories((categories) =>
      categories.includes(activeCategory.slug) ? categories : [...categories, activeCategory.slug]
    );
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
    setOpenCategories((categories) =>
      categories.includes(slug) ? categories.filter((category) => category !== slug) : [...categories, slug]
    );
  };

  // Filter categories and tools in sidebar
  const filteredCategories = useMemo(() => {
    if (!sidebarFilter.trim()) return DASHBOARD_CATEGORIES;
    const term = sidebarFilter.toLowerCase();
    return DASHBOARD_CATEGORIES.map((cat) => ({
      ...cat,
      tools: cat.tools.filter(
        (tool) => tool.title.toLowerCase().includes(term) || tool.description.toLowerCase().includes(term)
      ),
    })).filter((cat) => cat.tools.length > 0 || cat.title.toLowerCase().includes(term));
  }, [sidebarFilter]);

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  const sidebarNavigation = (
    <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900">
      {/* Quick Filter in Sidebar */}
      <div className="px-3 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={sidebarFilter}
            onChange={(e) => setSidebarFilter(e.target.value)}
            placeholder="Filter tools..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-1.5 pl-8 pr-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-[#10A968]"
          />
          {sidebarFilter && (
            <button
              onClick={() => setSidebarFilter("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Main Links */}
      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 space-y-0.5">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
            currentPath === "/"
              ? "bg-[#10A968]/15 text-[#10A968] dark:bg-[#10A968]/25"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <LayoutGrid size={15} className="text-[#10A968]" />
          <span>Home Hub</span>
        </Link>
        <Link
          to="/tools"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
            currentPath === "/tools"
              ? "bg-[#10A968]/15 text-[#10A968] dark:bg-[#10A968]/25"
              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <FolderTree size={15} className="text-emerald-500" />
          <span>All 90+ Tools</span>
        </Link>
      </div>

      {/* Category Accordion Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1" aria-label="Tool categories">
        {filteredCategories.map((category) => {
          const Icon = category.icon;
          const expanded = openCategories.includes(category.slug) || Boolean(sidebarFilter.trim());
          const hasActiveTool = category.tools.some((tool) => tool.route === currentPath);
          return (
            <div key={category.slug} className="rounded-xl transition-all">
              <div
                className={cn(
                  "flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors",
                  hasActiveTool
                    ? "bg-[#10A968]/10 text-[#10A968] font-bold dark:bg-[#10A968]/20"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(category.slug)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <Icon size={16} className={cn("shrink-0", hasActiveTool ? "text-[#10A968]" : "text-slate-400")} />
                  <span className="truncate text-xs font-semibold">
                    {categoryLabels[category.slug] || category.title}
                  </span>
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    {category.badgeCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.slug)}
                    className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                </div>
              </div>

              {expanded && (
                <div className="ml-3.5 my-1 border-l-2 border-slate-200 dark:border-slate-800 pl-2 space-y-0.5">
                  {category.tools.map((tool) => {
                    const ToolIcon = tool.icon;
                    const isActive = tool.route === currentPath;
                    return (
                      <Link
                        key={`${category.slug}-${tool.id}`}
                        to={tool.route}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] leading-4 transition-all",
                          isActive
                            ? "bg-[#10A968] font-bold text-white shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                        )}
                      >
                        <ToolIcon size={13} className={cn("shrink-0", isActive ? "text-white" : "text-slate-400")} />
                        <span className="truncate">{tool.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          100% Browser Private
        </span>
        <div className="flex items-center gap-2">
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <span>•</span>
          <Link to="/help" className="hover:underline">Help</Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Search Modal (Cmd+K) */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Top Navbar Header (Fixed Across Top) */}
      <header
        className={cn(
          "fixed top-0 right-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 px-4 backdrop-blur-md transition-all duration-300",
          collapsed ? "left-0" : "left-0 lg:left-72"
        )}
      >
        {/* Left Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open navigation sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Desktop Toggle Sidebar Button */}
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className="hidden h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#10A968] hover:text-[#10A968] transition-colors lg:grid"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>

          {/* Logo in top navbar when sidebar collapsed */}
          {collapsed && (
            <Link to="/" className="hidden lg:flex items-center gap-2" aria-label="Tech Tools Home">
              <Image src="/images/web-logo.png" alt="Tech Tools" width={100} height={36} className="h-8 w-auto object-contain" priority />
            </Link>
          )}
        </div>

        {/* Center: Search Trigger Input */}
        <div className="flex-1 max-w-md mx-4">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-3.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:border-[#10A968] hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm group"
          >
            <span className="flex items-center gap-2 truncate">
              <Search size={14} className="text-[#10A968] group-hover:scale-110 transition-transform" />
              <span className="truncate">Search 90+ developer tools...</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
              ⌘K
            </span>
          </button>
        </div>

        {/* Right Actions: Favorites, Language Selector, Theme Switch */}
        <div className="flex items-center gap-2">
          {/* Favorites Button */}
          <Link
            to="/tools"
            className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors"
            title="Favorite tools"
            aria-label="Favorite tools"
          >
            <Heart size={18} className={favoritesCount > 0 ? "text-red-500 fill-red-500" : ""} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#10A968] transition-colors"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} theme`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} className="text-amber-400" />}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#10A968] transition-colors"
              aria-label="Select language"
              aria-expanded={langMenuOpen}
            >
              <Globe size={15} className="text-[#10A968]" />
              <span className="uppercase">{currentLang.code}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {langMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setLangMenuOpen(false)} aria-hidden="true" />
                <div className="absolute right-0 top-11 z-20 w-44 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-2xl space-y-0.5">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Language
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code as any);
                        setLangMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors",
                        locale === lang.code
                          ? "bg-[#10A968]/15 text-[#10A968] font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {locale === lang.code && <span className="h-1.5 w-1.5 rounded-full bg-[#10A968]" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Desktop Fixed Left Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl transition-transform duration-300 lg:flex",
          collapsed && "-translate-x-full"
        )}
      >
        {/* Sidebar Header Banner */}
        <div className="relative h-32 shrink-0 overflow-hidden bg-gradient-to-br from-[#0b8060] via-[#0a9b70] to-[#18b887] px-4 pt-3.5">
          <div className="absolute -bottom-10 -left-8 h-20 w-56 rounded-[50%] bg-emerald-300/20" />
          <div className="absolute -bottom-10 left-20 h-16 w-64 rotate-[-6deg] rounded-[50%] bg-teal-200/20" />
          <div className="relative flex items-start justify-between">
            <Link to="/" className="block" aria-label="Tech Tools home">
              <Image
                src="/images/web-logo.png"
                alt="Tech Tools"
                width={112}
                height={52}
                className="h-[60px] w-auto object-contain object-left"
                priority
              />
              <p className="mt-0.5 text-[11px] font-medium tracking-wide text-white/90">Handy tools for developers</p>
            </Link>
            <button
              type="button"
              onClick={() => onCollapsedChange(true)}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close tools sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        {sidebarNavigation}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[60] flex w-[min(21rem,calc(100vw-1rem))] flex-col bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="relative h-32 shrink-0 overflow-hidden bg-gradient-to-br from-[#0b8060] via-[#0a9b70] to-[#18b887] px-5 pt-3.5">
          <div className="absolute -bottom-10 -left-8 h-20 w-56 rounded-[50%] bg-emerald-300/20" />
          <div className="relative flex items-start justify-between">
            <Link to="/" className="block" aria-label="Tech Tools home" onClick={() => setMobileOpen(false)}>
              <Image
                src="/images/web-logo.png"
                alt="Tech Tools"
                width={112}
                height={52}
                className="h-[60px] w-auto object-contain object-left"
                priority
              />
              <p className="mt-0.5 text-[11px] font-medium tracking-wide text-white/90">Handy tools for developers</p>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              aria-label="Close tools sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        {sidebarNavigation}
      </aside>
    </>
  );
}
