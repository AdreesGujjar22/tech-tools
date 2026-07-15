import { useNavigate } from "@/lib/router-compat";
import Image from "next/image";
import { useState } from "react";
import { Search, Clock, Eye, Share2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StaggerList } from "@/components/StaggerList";
import { Badge } from "@/components/ui/Badge";

const currentDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
}).format(new Date());

const qrItems = [
  {
    id: 5,
    title: "PDF Tools Dashboard",
    url: "/ilovepdf",
    type: "URL",
    date: currentDate,
    preview: "/images/pdf.png",
  },
  {
    id: 6,
    title: "Image Tools Dashboard",
    url: "/iloveimg",
    type: "URL",
    date: currentDate,
    preview: "/images/image.png",
  },
  {
    id: 1,
    title: "Internet Speed Testing",
    url: "/speed-test",
    type: "URL",
    date: currentDate,
    preview: "/images/speed-test.png",
  },
  {
    id: 2,
    title: "Typing Speed Results",
    url: "/typing-speed",
    type: "URL",
    date: currentDate,
    preview: "/images/typing-speed.png",
  },
  {
    id: 3,
    title: "Color Picker Palette",
    url: "/color-picker",
    type: "URL",
    date: currentDate,
    preview: "/images/color-picker.png",
  },
  {
    id: 4,
    title: "QR Code Generator",
    url: "/qr-generator",
    type: "URL",
    date: currentDate,
    preview: "https://api.builder.io/api/v1/image/assets/TEMP/297ee64dc0e7bfca7c4b6bcf1bc6a0361a742a79?width=320",
  },
  {
    id: 7,
    title: "Barcode Generator",
    url: "/barcode-generator",
    type: "URL",
    date: currentDate,
    preview: "/images/barcode.png",
  },
  {
    id: 8,
    title: "Password Generator",
    url: "/password-generator",
    type: "URL",
    date: currentDate,
    preview: "/images/password.png",
  },
  {
    id: 9,
    title: "Lorem Ipsum Generator",
    url: "/lorem-ipsum-generator",
    type: "URL",
    date: currentDate,
    preview: "/images/lorem-ipsum.png",
  },
  {
    id: 10,
    title: "Emoji Picker & Copier",
    url: "/emoji-picker",
    type: "URL",
    date: currentDate,
    preview: "/images/emoji-picker.png",
  },
  {
    id: 11,
    title: "Online NotePad",
    url: "/notepad",
    type: "URL",
    date: currentDate,
    preview: "/images/notepad.png",
  },
];

export default function History() {
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
      if (err instanceof Error && err.name === "NotAllowedError") {
        alert("Link: " + shareData.url);
      } else {
        console.error("Failed to copy link: ", err);
      }
    }
  };

  const filteredItems = qrItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-transparent text-foreground">
      <main className="section-py section-px">
        <div className="container-full">
          {/* Header */}
          <section className="relative overflow-hidden border-b border-[#C5DCC9] bg-gradient-to-b from-[#F0F7F0] via-white to-transparent pb-24">
            <div className="absolute inset-0 bg-radial-at-t from-[#10A968]/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-20 right-10 w-96 h-96 bg-[#10A968]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1 pb-1.5 rounded-full bg-[#10A968]/10 border border-[#10A968]/20 text-[#10A968] text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse"
              >
                <span className="w-1.5 h-1.5 bg-[#10A968] rounded-full" />
                All Utilities
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-[#1F3A26] mb-6"
              >
                Every tool you need to <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10A968] to-[#10A968]">
                  optimize and master
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="text-[#4A6857] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-10"
              >
                These are the following Tech tools we have. Click on any item to view details or export options.
              </motion.p>

              {/* Interactive Search Grid Controls */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="max-w-xl mx-auto flex items-center bg-white border border-[#C5DCC9] rounded-2xl p-1.5 shadow-lg focus-within:border-[#10A968]/40 transition"
              >
                <div className="flex items-center pl-3 text-[#4A6857]">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search tools (e.g., QR code, color picker)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 ring-0 focus:outline-none focus:ring-0 p-3 text-sm text-[#2D4D35] placeholder-[#999B99] font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 px-2.5 text-xs text-[#4A6857] bg-[#E8F0E8] hover:bg-[#D4E8D8] border border-[#C5DCC9] rounded-xl transition cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </motion.div>
            </div>
          </section>
          {/* <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full border border-border bg-secondary/50 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-semibold tracking-wider uppercase">All Utilities</span>
              </div>
              <h1 className="text-4xl font-bold">Tech Tools</h1>
              <p className="text-base text-muted-foreground max-w-xl">
                These are the following Tech tools we have. Click on any item to view details or export options.
              </p>
            </div>

            <div className="relative min-w-[280px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern w-full pl-11"
              />
            </div>
          </div> */}

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="premium-card p-12 text-center text-[#4A6857] mb-12 rounded-2xl border border-[#C5DCC9]/40 bg-white">
              No tools matching your search criteria were found.
            </div>
          ) : (
            <StaggerList staggerDelay={0.08} className="grid-auto-fit mb-12">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="premium-card p-5 flex flex-col gap-4 cursor-pointer group rounded-xl border border-[#C5DCC9]/40 bg-white hover:shadow-lg hover:-translate-y-2 transition-all"
                  onClick={() => navigate(item.url)}
                >
                  {/* Preview */}
                  <div className="aspect-square rounded-lg bg-white p-4 flex items-center justify-center overflow-hidden relative">
                    <Image
                      src={item.preview || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg leading-tight text-[#1F3A26]">{item.title}</h3>
                    <div className="flex items-center gap-1.5 text-[#4A6857]">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">{item.date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 py-2 rounded-lg bg-[#E8F0E8] text-[#2D4D35] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#D4E8D8] transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <div className="relative inline-block w-auto">
                      <button
                        onClick={(e) => handleShare(e, item.title, item.url)}
                        className="py-2 px-3 rounded-lg bg-[#E8F0E8] text-[#2D4D35] font-semibold text-xs hover:bg-[#D4E8D8] transition-colors flex items-center justify-center"
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
          <div className="premium-card p-12 sm:p-16 text-center space-y-6 rounded-2xl border border-[#C5DCC9]/40 bg-white animate-fade-in-scale">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-lg bg-[#F0F7F0] border border-[#C5DCC9]">
              <Sparkles className="w-7 h-7 text-[#10A968]" />
            </div>
            <h3 className="text-2xl font-bold text-[#1F3A26]">Ready for more?</h3>
            <p className="text-base text-[#4A6857] max-w-md mx-auto">
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
    </div>
  );
}
