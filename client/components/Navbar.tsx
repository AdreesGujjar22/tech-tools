import { useEffect, useRef, useState } from "react";
import { Link, stripLocalePrefix, useLocation, useNavigate } from "@/lib/router-compat";
import { ChevronDown, Menu, X, LogIn, LogOut, ShieldAlert, HelpCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useLocale } from "@/lib/locale";

type LanguageCode = "de" | "en" | "es" | "fr" | "id" | "it" | "nl" | "pt" | "tr";

type LanguageSelectorProps = {
  mobile?: boolean;
};

function FlagIcon({ code }: { code: LanguageCode }) {
  const svgProps = { viewBox: "0 0 24 16", className: "h-4 w-6 shrink-0 rounded-[2px] shadow-sm", "aria-hidden": true } as const;

  if (code === "de") {
    return <svg {...svgProps}><rect width="24" height="16" fill="#FFCE00" /><rect width="24" height="5.33" fill="#000" /><rect y="5.33" width="24" height="5.33" fill="#DD0000" /></svg>;
  }
  if (code === "es") {
    return <svg {...svgProps}><rect width="24" height="16" fill="#F1BF00" /><rect width="24" height="4" fill="#AA151B" /><rect y="12" width="24" height="4" fill="#AA151B" /></svg>;
  }
  if (code === "fr") {
    return <svg {...svgProps}><rect width="8" height="16" fill="#0055A4" /><rect x="8" width="8" height="16" fill="#fff" /><rect x="16" width="8" height="16" fill="#EF4135" /></svg>;
  }
  if (code === "id") {
    return <svg {...svgProps}><rect width="24" height="8" fill="#CE1126" /><rect y="8" width="24" height="8" fill="#fff" /></svg>;
  }
  if (code === "it") {
    return <svg {...svgProps}><rect width="8" height="16" fill="#009246" /><rect x="8" width="8" height="16" fill="#fff" /><rect x="16" width="8" height="16" fill="#CE2B37" /></svg>;
  }
  if (code === "nl") {
    return <svg {...svgProps}><rect width="24" height="16" fill="#21468B" /><rect width="24" height="5.33" fill="#AE1C28" /><rect y="5.33" width="24" height="5.33" fill="#fff" /></svg>;
  }
  if (code === "pt") {
    return <svg {...svgProps}><rect width="24" height="16" fill="#046A38" /><rect x="9" width="15" height="16" fill="#DA291C" /><circle cx="9" cy="8" r="4.2" fill="#FFCD00" /><circle cx="9" cy="8" r="2.7" fill="#fff" /></svg>;
  }
  if (code === "tr") {
    return <svg {...svgProps}><rect width="24" height="16" fill="#E30A17" /><circle cx="10" cy="8" r="4" fill="#fff" /><circle cx="11.2" cy="8" r="3.2" fill="#E30A17" /><path d="m15 8 3.2 1.05-1.98-2.62v3.14L18.2 6.95Z" fill="#fff" /></svg>;
  }
  return <svg {...svgProps}><rect width="24" height="16" fill="#B22234" /><path d="M0 2h24M0 4h24M0 6h24M0 8h24M0 10h24M0 12h24M0 14h24" stroke="#fff" strokeWidth="1.2" /><rect width="10" height="8.5" fill="#3C3B6E" /></svg>;
}

function LanguageSelector({ mobile = false }: LanguageSelectorProps) {
  const common = useTranslations("Common");
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const languages = [
    { code: "en" as const, label: common("languages.english") },
    { code: "es" as const, label: common("languages.spanish") },
    { code: "pt" as const, label: common("languages.portuguese") },
    { code: "de" as const, label: common("languages.german") },
    { code: "fr" as const, label: common("languages.french") },
    { code: "id" as const, label: common("languages.indonesian") },
    { code: "it" as const, label: common("languages.italian") },
    { code: "nl" as const, label: common("languages.dutch") },
    { code: "tr" as const, label: common("languages.turkish") },
  ];
  const selectedLanguage = languages.find((language) => language.code === locale) ?? languages[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={selectorRef} className={cn("relative", mobile && "w-full")}>
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        className={cn(
          "group flex items-center gap-2 rounded-xl border border-border/70 bg-background/80 text-foreground shadow-sm backdrop-blur transition-all duration-200",
          "hover:border-primary/50 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          mobile ? "w-full justify-center px-4 py-3" : "px-3 py-2"
        )}
        aria-label={common("language")}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <FlagIcon code={selectedLanguage.code} />
        <span className="text-xs font-semibold uppercase tracking-[0.12em]">{selectedLanguage.code}</span>
        <span className="hidden sm:inline text-xs font-medium text-muted-foreground">{selectedLanguage.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-[70] mt-2 min-w-[12.5rem] overflow-hidden rounded-2xl border border-border/70 bg-background/95 p-1.5 shadow-xl shadow-black/10 backdrop-blur-xl",
            mobile ? "left-0 right-0 w-full" : "right-0"
          )}
          role="listbox"
          aria-label={common("language")}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              role="option"
              aria-selected={language.code === locale}
              onClick={() => {
                setLocale(language.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                language.code === locale
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              <FlagIcon code={language.code} />
              <span className="w-6 text-xs font-semibold uppercase tracking-[0.12em]">{language.code}</span>
              <span className="text-sm font-medium">{language.label}</span>
              {language.code === locale && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const t = useTranslations("Navbar");
  const common = useTranslations("Common");
  const routes = useTranslations("Routes");
  const navLinks = [
    { label: t("links.about"), href: routes("about") },
    { label: t("links.tools"), href: routes("tools") },
    { label: t("links.blog"), href: routes("blog") },
    { label: t("links.pricing"), href: routes("pricing") },
  ];
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = stripLocalePrefix(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 isolate transition-all duration-300",
        "backdrop-blur-xl bg-background/95",
        scrolled && "shadow-lg border-b border-border/60"
      )}
    >
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            to="/"
            className="shrink-0 flex items-center gap-2 hover:opacity-70 transition-opacity duration-200"
            aria-label={common("a11y.techToolsHome")}
          >
            <Image
              src="/images/web-logo.png"
              alt="Tech tool logo"
              className="h-9 sm:h-10 w-auto"
              width={84}
              height={60}
              sizes="84px"
              quality={100}
              priority
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "relative px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-foreground bg-white/10 hover:bg-white/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute left-4 right-4 -bottom-px h-0.5 rounded-full brand-gradient" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-2 sm:gap-3">
          <button
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all duration-200 cursor-pointer"
            onClick={() => navigate(routes("help"))}
            aria-label={t("links.help")}
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="px-3 sm:px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-200"
            >
              <ShieldAlert size={14} />
              <span className="hidden sm:inline">{t("admin")}</span>
            </Link>
          )}

          <LanguageSelector />

          <Link
            to={routes("contact")}
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full brand-gradient text-white text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
          >
            {t("links.contact")}
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <LanguageSelector />
          <button
          className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg transition-colors duration-200"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? common("a11y.closeMenu") : common("a11y.openMenu")}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation-drawer"
        >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setMobileOpen(false)}
      />

      <div
        id="mobile-navigation-drawer"
        role="dialog"
        aria-label={common("a11y.mobileNavigation")}
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed top-0 bottom-0 left-0 z-[60] h-dvh max-h-dvh w-[min(22rem,calc(100vw-1rem))] overflow-y-auto overscroll-contain lg:hidden flex flex-col gap-1 border-r border-border/60 bg-background px-4 pb-6 pt-[20px] shadow-2xl transition-all duration-300 ease-out sm:px-6 sm:pt-28",
          mobileOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-full opacity-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4">
          <Link
            to="/"
            className="shrink-0 flex items-center"
            aria-label={common("a11y.techToolsHome")}
            onClick={() => setMobileOpen(false)}
          >
            <Image
              src="/images/web-logo.png"
              alt="Tech tool logo"
              className="h-10 w-auto"
              width={84}
              height={60}
              sizes="84px"
              quality={100}
            />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={common("a11y.closeMenu")}
          >
            <X size={22} />
          </button>
        </div>

        {navLinks.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm sm:text-base py-2.5 px-3 rounded-lg transition-all duration-200 ${
                  isActive ? "text-foreground bg-muted font-medium" : "text-muted-foreground hover:bg-muted/70"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm py-2.5 px-3 rounded-lg text-red-500 font-medium flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <ShieldAlert size={16} />
              {t("admin")}
            </Link>
          )}

          <div className="flex flex-col gap-3 pt-4 mt-3 border-t border-border/60">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-center py-2.5 rounded-full bg-muted text-foreground hover:bg-muted/70 text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                <span className="text-xs sm:text-sm">{t("signOut")}</span>
              </button>
            ) : (
              <Link
                to="/admin"
                className="text-center py-2.5 rounded-full bg-muted text-foreground hover:bg-muted/70 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={16} />
                {t("signIn")}
              </Link>
            )}

            <Link
              to={routes("contact")}
              className="text-center py-3 rounded-full brand-gradient text-white text-sm font-semibold hover:shadow-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {t("links.contact")}
            </Link>
          </div>
        </div>
    </header>
  );
}
