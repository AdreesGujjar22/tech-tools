import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "@/lib/router-compat";
import { Menu, X, LogIn, LogOut, ShieldAlert, HelpCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import Image from "next/image";

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

  return (
    <header
      className={`glass-nav fixed top-0 left-0 right-0 z-50 ${
        scrolled ? "shadow-[0_8px_30px_-12px_rgba(8,12,30,0.5)]" : ""
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="shrink-0 flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="Tech Tools home"
          >
            <Image src="/images/web-logo.png" alt="Tech tool logo" className="h-12 w-auto" width="140" height="100" />
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium tracking-[-0.01em] transition-colors ${
                    isActive
                      ? "text-foreground bg-accent/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  }`}
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

        <div className="hidden md:flex items-center gap-3">
          <button
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer"
            onClick={() => navigate("/help")}
            aria-label="FAQ Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/15 border border-destructive/20 text-sm font-semibold flex items-center gap-1.5 transition-all"
            >
              <ShieldAlert size={14} />
              Admin
            </Link>
          )}

          <Link
            to="/contact-us"
            className="px-6 py-2.5 rounded-full brand-gradient text-white text-sm font-semibold hover:brightness-110 transition-all shadow-[0_10px_24px_-10px_hsla(var(--brand-to),0.7)]"
          >
            Contact Us
          </Link>
        </div>

        <button
          className="md:hidden text-muted-foreground hover:text-foreground p-2 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-nav border-t border-border/60 px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-base py-2.5 px-3 rounded-lg transition-colors ${
                  isActive ? "text-foreground bg-accent/60 font-medium" : "text-muted-foreground hover:bg-accent/40"
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
              className="text-base py-2.5 px-3 rounded-lg text-destructive font-medium flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <ShieldAlert size={16} />
              Admin Panel
            </Link>
          )}

          <div className="flex flex-col gap-3 pt-3 mt-2 border-t border-border/60">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-center py-2.5 rounded-full bg-accent/60 text-foreground hover:bg-accent text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Sign Out ({user.email?.split("@")[0]})
              </button>
            ) : (
              <Link
                to="/admin"
                className="text-center py-2.5 rounded-full bg-accent/60 text-foreground hover:bg-accent text-sm font-semibold transition-all flex items-center justify-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={16} />
                Sign In / Admin
              </Link>
            )}

            <Link
              to="/contact-us"
              className="text-center py-3 rounded-full brand-gradient text-white font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
