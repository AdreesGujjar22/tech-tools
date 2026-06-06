import { Link } from "@/lib/router-compat";
import { Github, Twitter, Globe, Heart } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-[#060E20] border-t border-[rgba(255,255,255,0.06)] overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-rose-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link
              to="/"
              className="text-white hover:text-[#4CD7F6] font-bold text-2xl tracking-tight shrink-0 flex items-center gap-2 transition-colors"
            >
            <Image src="/images/web-logo.png" alt="Tech tool logo" className="h-12" width="140" height="100" />
            </Link>
            <p className="text-[#C7C4D8]/80 text-sm max-w-sm leading-relaxed">
              Fast, secure, and modern online tools for developers, creators, and daily digital workloads. Sandboxed entirely inside your browser context for ultimate privacy configuration.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-[#C7C4D8] hover:text-white hover:border-neutral-700 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-[#C7C4D8] hover:text-white hover:border-neutral-700 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 text-[#C7C4D8] hover:text-white hover:border-neutral-700 transition-all duration-200"
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Productivity Tools
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Latest Blog Insights
                </Link>
              </li>
              <li>
                <Link to="/customization" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  System Settings
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: PDF Tools */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">PDF Tools</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/ilovepdf" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200 font-semibold">
                  PDF Dashboard
                </Link>
              </li>
              <li>
                <Link to="/ilovepdf/merge-pdf" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link to="/ilovepdf/split-pdf" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link to="/ilovepdf/compress-pdf" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link to="/ilovepdf/pdf-to-word" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  PDF to Word
                </Link>
              </li>
              <li>
                <Link to="/ilovepdf/word-to-pdf" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Word to PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Image Tools */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Image Tools</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/iloveimg" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200 font-semibold">
                  Image Dashboard
                </Link>
              </li>
              <li>
                <Link to="/iloveimg/compress-image" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Compress Image
                </Link>
              </li>
              <li>
                <Link to="/iloveimg/resize-image" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Resize Image
                </Link>
              </li>
              <li>
                <Link to="/iloveimg/crop-image" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Crop Image
                </Link>
              </li>
              <li>
                <Link to="/iloveimg/image-converter" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Image Converter
                </Link>
              </li>
              <li>
                <Link to="/iloveimg/background-remover" className="text-[#C7C4D8]/80 hover:text-white text-sm transition-colors duration-200">
                  Background Remover
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#C7C4D8]/60 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} TechTools. All rights reserved.</span>
            <span className="hidden sm:inline-block">•</span>
            <span className="hidden sm:flex items-center gap-1">
              Crafted secure offline with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> for all
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors duration-200">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
