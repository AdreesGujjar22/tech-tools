import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@/lib/router-compat";
import { Menu, X, LogIn, LogOut, ShieldAlert, HelpCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
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
            aria-label="Tech Tools home"
          >
            <Image
              src="/images/web-logo.png"
              alt="Tech tool logo"
              className="h-20 sm:h-24 w-auto"
              width={168}
              height={120}
              sizes="168px"
            />
          </Link>
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
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
            onClick={() => navigate("/help")}
            aria-label="FAQ Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="px-3 sm:px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all duration-200"
            >
              <ShieldAlert size={14} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          <Link
            to="/contact-us"
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-full brand-gradient text-white text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
          >
            Contact
          </Link>
        </div>

        <button
          className="lg:hidden text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-lg transition-colors duration-200"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation-drawer"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
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
        aria-label="Mobile navigation"
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed left-0 top-0 bottom-0 z-20 w-[min(20rem,85vw)] overflow-y-auto overscroll-contain lg:hidden flex flex-col gap-1 border-r border-border/60 bg-background px-4 pb-6 pt-24 shadow-2xl transition-all duration-300 ease-out sm:px-6",
          mobileOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-full opacity-0"
        )}
      >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
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
              Admin
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
                <span className="text-xs sm:text-sm">Sign Out</span>
              </button>
            ) : (
              <Link
                to="/admin"
                className="text-center py-2.5 rounded-full bg-muted text-foreground hover:bg-muted/70 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={16} />
                Sign In
              </Link>
            )}

            <Link
              to="/contact-us"
              className="text-center py-3 rounded-full brand-gradient text-white text-sm font-semibold hover:shadow-lg transition-all"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
    </header>
  );
}
