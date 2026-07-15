import { Link } from "@/lib/router-compat";
import { Github, Twitter, Globe, Heart } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#F0F7F0] to-white border-t border-[#C5DCC9] overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#10A968]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#10A968]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link
              to="/"
              className="shrink-0 flex items-center gap-2 transition-opacity hover:opacity-80"
              aria-label="Tech Tools home"
            >
              <Image
                src="/images/web-logo.png"
                alt="Tech tool logo"
                className="h-20 w-auto"
                width={140}
                height={100}
                sizes="140px"
              />
            </Link>
            <p className="text-[#4A6857] text-sm max-w-sm leading-relaxed">
              Fast, secure, and modern online tools for developers, creators, and daily digital workloads. Sandboxed entirely inside your browser context for ultimate privacy configuration.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#E8F0E8] border border-[#C5DCC9] text-[#4A6857] hover:text-[#10A968] hover:border-[#10A968] hover:bg-[#D4E8D8] transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#E8F0E8] border border-[#C5DCC9] text-[#4A6857] hover:text-[#10A968] hover:border-[#10A968] hover:bg-[#D4E8D8] transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#E8F0E8] border border-[#C5DCC9] text-[#4A6857] hover:text-[#10A968] hover:border-[#10A968] hover:bg-[#D4E8D8] transition-all duration-200"
                aria-label="Website"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[#1F3A26] font-bold text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Productivity Tools
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Latest Blog Insights
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: PDF Tools */}
          <div className="space-y-4">
            <h4 className="text-[#1F3A26] font-bold text-sm uppercase tracking-wider">PDF Tools</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/ilovepdf" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200 font-semibold">
                  PDF Dashboard
                </Link>
              </li>
              <li>
                <Link to="/ilovepdf/merge-pdf" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link to="/ilovepdf/split-pdf" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link to="/ilovepdf/compress-pdf" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link to="/ilovepdf/pdf-to-word" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  PDF to Word
                </Link>
              </li>
              <li>
                <Link to="/ilovepdf/word-to-pdf" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Word to PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Image Tools */}
          <div className="space-y-4">
            <h4 className="text-[#1F3A26] font-bold text-sm uppercase tracking-wider">Image Tools</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/iloveimg" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200 font-semibold">
                  Image Dashboard
                </Link>
              </li>
              <li>
                <Link to="/iloveimg/compress-image" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Compress Image
                </Link>
              </li>
              <li>
                <Link to="/iloveimg/resize-image" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Resize Image
                </Link>
              </li>
              <li>
                <Link to="/iloveimg/crop-image" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Crop Image
                </Link>
              </li>
              <li>
                <Link to="/iloveimg/image-converter" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Image Converter
                </Link>
              </li>
              <li>
                <Link to="/iloveimg/background-remover" className="text-[#4A6857] hover:text-[#10A968] text-sm transition-colors duration-200">
                  Background Remover
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 border-t border-[#C5DCC9] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#4A6857]/80 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} TechTools. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-[#4A6857] hover:text-[#10A968] transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="text-[#4A6857] hover:text-[#10A968] transition-colors duration-200">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
