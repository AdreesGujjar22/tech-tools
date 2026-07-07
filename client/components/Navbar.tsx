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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "backdrop-blur-md bg-white/[0.03] dark:bg-white/[0.01]",
        scrolled && "shadow-lg border-b border-white/5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            to="/"
            className="shrink-0 flex items-center gap-2 hover:opacity-70 transition-opacity duration-200"
            aria-label="Tech Tools home"
          >
            <Image src="/images/web-logo.png" alt="Tech tool logo" className="h-16 sm:h-20 w-auto" width="140" height="100" />
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
          className="lg:hidden text-muted-foreground hover:text-foreground p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden backdrop-blur-md bg-white/[0.03] dark:bg-white/[0.01] border-t border-white/5 px-4 sm:px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm sm:text-base py-2.5 px-3 rounded-lg transition-all duration-200 ${
                  isActive ? "text-foreground bg-white/15 font-medium" : "text-muted-foreground hover:bg-white/5"
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

          <div className="flex flex-col gap-3 pt-3 mt-2 border-t border-white/5">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-center py-2.5 rounded-full bg-white/10 text-foreground hover:bg-white/15 text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                <span className="text-xs sm:text-sm">Sign Out</span>
              </button>
            ) : (
              <Link
                to="/admin"
                className="text-center py-2.5 rounded-full bg-white/10 text-foreground hover:bg-white/15 text-sm font-semibold transition-all flex items-center justify-center gap-2"
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
      )}
    </header>
  );
}
