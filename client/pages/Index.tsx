import { useNavigate, Link } from "@/lib/router-compat";
import SEO from "@/components/SEO";
import { useState } from "react";
import { Search, Clock, Eye, Share2, Sparkles, ShieldCheck, ShieldCheck as ShieldIcon, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StaggerList } from "@/components/StaggerList";

const qrItems = [
  {
    id: 5,
    title: "PDF Tools Dashboard",
    url: "/ilovepdf",
    type: "URL",
    date: "Oct 18, 2024",
    preview: "/images/pdf.png",
  },
  {
    id: 6,
    title: "Image Tools Dashboard",
    url: "/iloveimg",
    type: "URL",
    date: "Oct 18, 2024",
    preview: "/images/image.png",
  },
  {
    id: 1,
    title: "Internet Speed Testing",
    url: "/speed-test",
    type: "URL",
    date: "Oct 24, 2024",
    preview: "/images/speed-test.png",
  },
  {
    id: 2,
    title: "Typing Speed Results",
    url: "/typing-speed",
    type: "URL",
    date: "Oct 22, 2024",
    preview: "/images/typing-speed.png",
  },
  {
    id: 3,
    title: "Color Picker Palette",
    url: "/color-picker",
    type: "URL",
    date: "Oct 20, 2024",
    preview: "/images/color-picker.png",
  },
  {
    id: 4,
    title: "QR Code Generator",
    url: "/qr-generator",
    type: "URL",
    date: "Oct 18, 2024",
    preview: "https://api.builder.io/api/v1/image/assets/TEMP/297ee64dc0e7bfca7c4b6bcf1bc6a0361a742a79?width=320",
  },
];

export default function Index() {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>, title: string, url: string) => {
    e.stopPropagation();
    const shareData = {
      title: title,
      text: "Check out this tool!",
      url: url,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  const filteredItems = qrItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEO
        title="Modern Online Productivity Utilities"
        description="Fast, secure, and modern online tools for developers, creators, and daily digital workloads. Includes QR generation, typing speed test, internet speed test, color selector and more."
        keywords="developer utilities, scan qr code, typing tutor, internet speed test, code snippet tools, secure online converter"
      />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 w-full h-[20rem] sm:h-[28rem] bg-hero-radial pointer-events-none" style={{ top: 0 }} />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 w-fit px-3 sm:px-4 py-2 rounded-full border border-white/20 bg-white/5 dark:bg-white/[0.03] backdrop-blur-sm">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-primary" />
              <span className="text-primary text-xs font-semibold tracking-wide uppercase">Next-Gen Tools</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 sm:space-y-5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                All Your Essential <span className="gradient-text">Tech Tools</span> in One Place
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                Fast, free, and modern online tools for developers, students, creators. Everything designed for speed and simplicity.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="#tools"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-2xl brand-gradient text-white text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Start Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about-us"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-2xl border border-white/20 bg-white/5 dark:bg-white/[0.03] backdrop-blur-md text-foreground text-sm sm:text-base font-semibold hover:bg-white/10 hover:border-white/30 transition-all"
              >
                Learn More
              </Link>
            </div>

            {/* Short Intro Paragraph */}
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg leading-relaxed">
              QR generators, speed tests, image converters, color pickers, developer tools — all in your browser, securely.
            </p>
          </div>

          {/* Right Preview */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Glow */}
              <div className="absolute -inset-6 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="relative rounded-2xl sm:rounded-3xl backdrop-blur-md bg-white/10 dark:bg-white/[0.05] border border-white/10 p-6 sm:p-10 shadow-2xl">
                <div className="aspect-square rounded-2xl bg-white p-6 flex items-center justify-center">
                  <img
                    src="/images/hero-section.png"
                    alt="QR Code preview generated with TechTools"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Badge */}
                <div className="absolute bottom-6 left-6 p-3 rounded-2xl brand-gradient shadow-lg">
                  <ShieldIcon className="w-5 h-5 text-white" />
                </div>

                {/* Info Badge */}
                <div className="absolute top-6 right-6 px-4 py-2 rounded-2xl border border-border bg-card/70 backdrop-blur-md flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-foreground text-sm font-medium">AES-256 Encoded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="bg-transparent text-foreground">
        <main className="section-py section-px">
          <div className="container-full">
            {/* Header */}
            <section className="relative overflow-hidden border-b border-[rgba(255,255,255,0.06)] bg-gradient-to-at-t from-[#141B31]/40 via-[#060E20]/50 to-transparent pb-24">
              <div className="absolute inset-0 bg-radial-at-t from-indigo-950/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

              <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 px-3 py-1 pb-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  All Utilities
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-white mb-6"
                >
                  Every tool you need to <br className="hidden sm:inline" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#4CD7F6]">
                    optimize and master
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-[#C7C4D8]/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-10"
                >
                  These are the following Tech tools we have. Click on any item to view details or export options.
                </motion.p>

                {/* Interactive Search Grid Controls */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="max-w-xl mx-auto flex items-center bg-[#141B31]/60 border border-neutral-800 rounded-2xl p-1.5 shadow-2xl focus-within:border-indigo-500/40 transition"
                >
                  <div className="flex items-center pl-3 text-neutral-500">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search tools (e.g., QR code, color picker)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-0 ring-0 focus:outline-none focus:ring-0 p-3 text-sm text-white placeholder-[#6B7280] font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1 px-2.5 text-xs text-[#C7C4D8] bg-neutral-800 hover:bg-neutral-750 border border-neutral-700/65 rounded-xl transition cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </motion.div>
              </div>
            </section>

            {/* Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="premium-card p-12 text-center text-muted-foreground mb-12 rounded-2xl border border-border/40">
                No tools matching your search criteria were found.
              </div>
            ) : (
              <StaggerList staggerDelay={0.08} className="grid-auto-fit mb-12">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="premium-card p-5 flex flex-col gap-4 cursor-pointer group rounded-xl border border-border/40 hover:shadow-lg hover:-translate-y-2 transition-all"
                    onClick={() => navigate(item.url)}
                  >
                    {/* Preview */}
                    <div className="aspect-square rounded-lg bg-white p-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.preview || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">{item.date}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 py-2 rounded-lg bg-accent/60 text-foreground font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/20 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      <div className="relative inline-block w-auto">
                        <button
                          onClick={(e) => handleShare(e, item.title, item.url)}
                          className="py-2 px-3 rounded-lg bg-accent/60 text-foreground font-semibold text-xs hover:bg-primary/20 transition-colors flex items-center justify-center"
                          aria-label="Share page"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {copied && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium text-white bg-emerald-600 rounded shadow-md pointer-events-none animate-fade-in whitespace-nowrap">
                            Copied Link!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </StaggerList>
            )}

            {/* CTA */}
            <div className="premium-card p-12 sm:p-16 text-center space-y-6 rounded-2xl border border-border/40 animate-fade-in-scale">
              <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-lg bg-primary/10 border border-primary/15">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Ready for more?</h3>
              <p className="text-base text-muted-foreground max-w-md mx-auto">
                Let us know what you're looking for, and we'll build it!
              </p>
              <button
                className="btn-primary mx-auto px-8"
                onClick={() => navigate("/contact-us")}
              >
                Contact us
              </button>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
