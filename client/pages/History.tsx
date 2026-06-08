import { useNavigate } from "@/lib/router-compat";
import { useState } from "react";
import { Search, Clock, Eye, Share2, Sparkles } from "lucide-react";

const qrItems = [
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

export default function Tools() {
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

    // 1. Try Native Mobile/Browser Share Sheet first
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return; // Successfully shared via native UI
      } catch (error) {
        // Only log if it wasn't a user cancellation
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    }

    // 2. Fallback: Copy Link to Clipboard
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  // Dynamically filter matching tools
  const filteredItems = qrItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border border-border bg-secondary/50 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-primary text-xs font-semibold tracking-[1px] uppercase">All Utilities</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Tech Tools</h1>
              <p className="text-base text-muted-foreground max-w-[520px] text-pretty">
                These are the following Tech tools we have. Click on any item to view details or export options.
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glow min-w-[280px] pl-11 pr-4 py-3.5 rounded-2xl border border-border bg-card/60 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:outline-none transition-shadow"
              />
            </div>
          </div>

          {/* Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="glass-card p-12 text-center text-muted-foreground mb-12">
              No tools matching your search criteria were found.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="glass-card p-5 flex flex-col gap-4 cursor-pointer group"
                  onClick={() => navigate(item.url)}
                >
                  {/* Preview */}
                  <div className="aspect-square rounded-xl bg-white p-4 flex items-center justify-center overflow-hidden">
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
                      <span className="text-xs font-semibold tracking-[0.4px]">{item.date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 py-2 rounded-xl bg-secondary/60 text-foreground font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-accent transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <div className="relative inline-block">
                      <button
                        onClick={(e) => handleShare(e, item.title, item.url)}
                        className="py-2 px-3 rounded-xl bg-secondary/60 text-foreground font-semibold text-xs hover:bg-accent transition-colors flex items-center justify-center"
                        aria-label="Share page"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {copied && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] font-medium text-white bg-emerald-600 rounded shadow-md pointer-events-none animate-fade-in-up whitespace-nowrap">
                          Copied Link!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="glass-card p-12 sm:p-16 text-center space-y-6">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-primary/10 border border-primary/15">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Ready for more?</h3>
            <p className="text-base text-muted-foreground max-w-[448px] mx-auto text-pretty">
              Let us know what you&apos;re looking for, and we&apos;ll build it!
            </p>
            <button
              className="inline-flex items-center justify-center px-12 py-4 rounded-2xl brand-gradient text-white font-semibold hover:brightness-110 transition-all shadow-[0_20px_40px_-16px_hsla(var(--brand-to),0.8)]"
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
