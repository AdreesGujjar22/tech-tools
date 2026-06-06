import { useState } from "react";
import { Link, useLocation, useNavigate } from "@/lib/router-compat";
import { Menu, X, LogIn, LogOut, ShieldAlert, HelpCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "Customization", href: "/customization" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-white hover:text-[#4CD7F6] font-bold text-2xl tracking-tight shrink-0 flex items-center gap-2 transition-colors"
          >
            <span className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-mono text-lg font-black shadow-lg shadow-red-950/20">TT</span>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight">TechTools</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-base leading-[1.6] tracking-[-0.025em] transition-colors ${
                    isActive
                      ? "text-[#E2DFFF] border-b-2 border-[#E2DFFF] pb-1"
                      : "text-[#C7C4D8] hover:text-[#E2DFFF]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full text-[#C7C4D8] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-all cursor-pointer"
            onClick={()=>navigate('/help')}
            aria-label="FAQ Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Admin link if isAdmin */}
          {isAdmin && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg bg-[rgba(239,68,68,0.15)] text-red-400 hover:text-red-300 border border-red-500/20 text-sm font-semibold flex items-center gap-1.5 transition-all"
            >
              <ShieldAlert size={14} />
              Admin
            </Link>
          )}

          {user ? (
            <button
              onClick={() => logout()}
              className="px-4 py-2 rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] text-[#E2DFFF] text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          ) : (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-full bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] text-[#E2DFFF] text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <LogIn size={14} />
              Sign In
            </Link>
          )}

          <Link
            to="/contact-us"
            className="px-6 py-2 rounded-full bg-[#4F46E5] text-[#DAD7FF] text-sm font-bold hover:bg-indigo-500 transition-colors shadow-[0_10px_15px_-3px_rgba(79,70,229,0.2)]"
          >
            Contact Us
          </Link>
        </div>

        <button
          className="md:hidden text-[#C7C4D8] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#131B2E] border-t border-[rgba(70,69,85,0.2)] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-base py-2 ${
                  isActive ? "text-[#E2DFFF] font-medium" : "text-[#C7C4D8]"
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
              className="text-base py-2 text-red-400 font-medium flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <ShieldAlert size={16} />
              Admin Panel
            </Link>
          )}

          <div className="flex flex-col gap-3 pt-2 border-t border-border">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-center py-2.5 rounded-full bg-[rgba(255,255,255,0.06)] text-[#DAD7FF] hover:bg-[rgba(255,255,255,0.1)] text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Sign Out ({user.email?.split("@")[0]})
              </button>
            ) : (
              <Link
                to="/admin"
                className="text-center py-2.5 rounded-full bg-[rgba(255,255,255,0.06)] text-[#DAD7FF] hover:bg-[rgba(255,255,255,0.1)] text-sm font-bold transition-all flex items-center justify-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <LogIn size={16} />
                Sign In / Admin
              </Link>
            )}

            <Link
              to="/contact-us"
              className="text-center py-3 rounded-full bg-[#4F46E5] text-[#DAD7FF] font-bold"
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
