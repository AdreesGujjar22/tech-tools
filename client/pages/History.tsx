import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "@/lib/router-compat";
import { useState } from "react";
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

const typeColors = {
  URL: "bg-[rgba(3,181,211,0.20)] text-[#4CD7F6]",
  WIFI: "bg-[rgba(79,70,229,0.20)] text-[#C3C0FF]",
  VCARD: "bg-[rgba(94,97,99,0.20)] text-[#C4C7C9]",
};

export default function Tools() {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>, title: string, url: string) => {
    e.stopPropagation()
    const shareData = {
      title: title,
      text: 'Check out this tool!',
      url: url,
    };

    // 1. Try Native Mobile/Browser Share Sheet first
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return; // Successfully shared via native UI
      } catch (error) {
        // Only log if it wasn't a user cancellation
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    }

    // 2. Fallback: Copy Link to Clipboard
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);

      // Reset the "Copied!" state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
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
            <div>
              <h1 className="text-4xl font-semibold mb-2">Tech Tools</h1>
              <p className="text-base text-[#C7C4D8]">
                These are the following Tech tools we have. Click on any item to view details or export options.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search archives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="min-w-[280px] px-10 py-4 rounded-[12px] border border-[rgba(70,69,85,0.30)] bg-[#131B2E] text-white placeholder-[#6B7280] focus:outline-none focus:border-[#4F46E5]"
                />
                <svg
                  className="absolute left-4 top-4"
                  width="18"
                  height="24"
                  viewBox="0 0 18 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18V18M6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11V11" fill="#C7C4D8"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* QR Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="glass-card-dark p-12 text-center text-muted-foreground mb-12">
              No tools matching your search criteria were found.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {filteredItems.map((item) => (
                <div key={item.id} className="glass-card-dark p-6 rounded-[12px] flex flex-col gap-4 hover:cursor-pointer" onClick={() => navigate(item.url)}>
                  {/* QR Preview */}
                  <div className="aspect-square rounded-[8px] bg-white p-4 flex items-center justify-center">
                    <img src={item.preview} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-[#DAE2FD] leading-tight">{item.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.86667 9.8L9.8 8.86667L7.33333 6.4V3.33333H6V6.93333L8.86667 9.8V9.8M6.66667 13.3333C5.74444 13.3333 4.87778 13.1583 4.06667 12.8083C3.25556 12.4583 2.55 11.9833 1.95 11.3833C1.35 10.7833 0.875 10.0778 0.525 9.26667C0.175 8.45556 0 7.58889 0 6.66667C0 5.74444 0.175 4.87778 0.525 4.06667C0.875 3.25556 1.35 2.55 1.95 1.95C2.55 1.35 3.25556 0.875 4.06667 0.525C4.87778 0.175 5.74444 0 6.66667 0C7.58889 0 8.45556 0.175 9.26667 0.525C10.0778 0.875 10.7833 1.35 11.3833 1.95C11.9833 2.55 12.4583 3.25556 12.8083 4.06667C13.1583 4.87778 13.3333 5.74444 13.3333 6.66667C13.3333 7.58889 13.1583 8.45556 12.8083 9.26667C12.4583 10.0778 11.9833 10.7833 11.3833 11.3833C10.7833 11.9833 10.0778 12.4583 9.26667 12.8083C8.45556 13.1583 7.58889 13.3333 6.66667 13.3333ZM6.66667 12C8.14444 12 9.40278 11.4806 10.4417 10.4417C11.4806 9.40278 12 8.14444 12 6.66667C12 5.18889 11.4806 3.93056 10.4417 2.89167C9.40278 1.85278 8.14444 1.33333 6.66667 1.33333C5.18889 1.33333 3.93056 1.85278 2.89167 2.89167C1.85278 3.93056 1.33333 5.18889 1.33333 6.66667C1.33333 8.14444 1.85278 9.40278 2.89167 10.4417C3.93056 11.4806 5.18889 12 6.66667 12Z" fill="#C7C4D8" />
                    </svg>
                    <span className="text-xs font-semibold text-[#C7C4D8] tracking-[0.48px]">{item.date}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-[8px] bg-[rgba(45,52,73,0.50)] text-[#DAE2FD] font-semibold text-xs flex items-center justify-center gap-1 hover:bg-[rgba(45,52,73,0.70)] transition-colors">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 2C3.5 2 1.37 3.55 0.5 5.75C1.37 7.95 3.5 9.5 6 9.5C8.5 9.5 10.63 7.95 11.5 5.75C10.63 3.55 8.5 2 6 2ZM6 8.25C4.62 8.25 3.5 7.13 3.5 5.75C3.5 4.37 4.62 3.25 6 3.25C7.38 3.25 8.5 4.37 8.5 5.75C8.5 7.13 7.38 8.25 6 8.25ZM6 4.5C5.31 4.5 4.75 5.06 4.75 5.75C4.75 6.44 5.31 7 6 7C6.69 7 7.25 6.44 7.25 5.75C7.25 5.06 6.69 4.5 6 4.5Z" fill="currentColor" />
                    </svg>

                    View
                  </button>
                  <div className="relative inline-block">
                    <button
                      onClick={(e) => handleShare(e, item.title, item.url)}
                      className="py-2 px-2 rounded-[8px] bg-[rgba(45,52,73,0.50)] text-[#DAE2FD] font-semibold text-xs hover:bg-[rgba(45,52,73,0.70)] transition-colors flex items-center justify-center gap-1"
                      aria-label="Share page"
                    >
                      <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.25 15C10.625 15 10.0938 14.7812 9.65625 14.3438C9.21875 13.9062 9 13.375 9 12.75C9 12.675 9.01875 12.5 9.05625 12.225L3.7875 9.15C3.5875 9.3375 3.35625 9.48437 3.09375 9.59062C2.83125 9.69687 2.55 9.75 2.25 9.75C1.625 9.75 1.09375 9.53125 0.65625 9.09375C0.21875 8.65625 0 8.125 0 7.5C0 6.875 0.21875 6.34375 0.65625 5.90625C1.09375 5.46875 1.625 5.25 2.25 5.25C2.55 5.25 2.83125 5.30313 3.09375 5.40938C3.35625 5.51563 3.5875 5.6625 3.7875 5.85L9.05625 2.775C9.03125 2.6875 9.01562 2.60312 9.00937 2.52187C9.00312 2.44062 9 2.35 9 2.25C9 1.625 9.21875 1.09375 9.65625 0.65625C10.0938 0.21875 10.625 0 11.25 0C11.875 0 12.4062 0.21875 12.8438 0.65625C13.2812 1.09375 13.5 1.625 13.5 2.25C13.5 2.875 13.2812 3.40625 12.8438 3.84375C12.4062 4.28125 11.875 4.5 11.25 4.5C10.95 4.5 10.6687 4.44687 10.4062 4.34062C10.1438 4.23437 9.9125 4.0875 9.7125 3.9L4.44375 6.975C4.46875 7.0625 4.48437 7.14688 4.49062 7.22813C4.49687 7.30938 4.5 7.4 4.5 7.5C4.5 7.6 4.49687 7.69062 4.49062 7.77187C4.48437 7.85312 4.46875 7.9375 4.44375 8.025L9.7125 11.1C9.9125 10.9125 10.1438 10.7656 10.4062 10.6594C10.6687 10.5531 10.95 10.5 11.25 10.5C11.875 10.5 12.4062 10.7188 12.8438 11.1562C13.2812 11.5938 13.5 12.125 13.5 12.75C13.5 13.375 13.2812 13.9062 12.8438 14.3438C12.4062 14.7812 11.875 15 11.25 15V15M11.25 13.5C11.4625 13.5 11.6406 13.4281 11.7844 13.2844C11.9281 13.1406 12 12.9625 12 12.75C12 12.5375 11.9281 12.3594 11.7844 12.2156C11.6406 12.0719 11.4625 12 11.25 12C11.0375 12 10.8594 12.0719 10.7156 12.2156C10.5719 12.3594 10.5 12.5375 10.5 12.75C10.5 12.9625 10.5719 13.1406 10.7156 13.2844C10.8594 13.4281 11.0375 13.5 11.25 13.5V13.5M2.25 8.25C2.4625 8.25 2.64062 8.17813 2.78437 8.03438C2.92812 7.89063 3 7.7125 3 7.5C3 7.2875 2.92812 7.10937 2.78437 6.96562C2.64062 6.82187 2.4625 6.75 2.25 6.75C2.0375 6.75 1.85938 6.82187 1.71563 6.96562C1.57188 7.10937 1.5 7.2875 1.5 7.5C1.5 7.7125 1.57188 7.89063 1.71563 8.03438C1.85938 8.17813 2.0375 8.25 2.25 8.25V8.25M11.25 3C11.4625 3 11.6406 2.92812 11.7844 2.78437C11.9281 2.64062 12 2.4625 12 2.25C12 2.0375 11.9281 1.85938 11.7844 1.71563C11.6406 1.57188 11.4625 1.5 11.25 1.5C11.0375 1.5 10.8594 1.57188 10.7156 1.71563C10.5719 1.85938 10.5 2.0375 10.5 2.25C10.5 2.4625 10.5719 2.64062 10.7156 2.78437C10.8594 2.92812 11.0375 3 11.25 3V3" fill="currentColor" />
                      </svg>
                    </button>

                    {/* Floating UI Tooltip indicator for fallback desktop mode */}
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
          <div className="glass-card-dark p-16 rounded-[16px] text-center space-y-6">
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-[rgba(79,70,229,0.10)]">
              <svg width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 17.3333V13.3333H16V10.6667H20V6.66667H22.6667V10.6667H26.6667V13.3333H22.6667V17.3333H20V17.3333M12 13.3333H6.66667C4.82222 13.3333 3.25 12.6833 1.95 11.3833C0.65 10.0833 0 8.51111 0 6.66667C0 4.82222 0.65 3.25 1.95 1.95C3.25 0.65 4.82222 0 6.66667 0H12V2.66667H6.66667C5.55556 2.66667 4.61111 3.05556 3.83333 3.83333C3.05556 4.61111 2.66667 5.55556 2.66667 6.66667C2.66667 7.77778 3.05556 8.72222 3.83333 9.5C4.61111 10.2778 5.55556 10.6667 6.66667 10.6667H12V13.3333V13.3333M8 8V5.33333H18.6667V8H8V8M26.6667 6.66667H24C24 5.55556 23.6111 4.61111 22.8333 3.83333C22.0556 3.05556 21.1111 2.66667 20 2.66667H14.6667V0H20C21.8444 0 23.4167 0.65 24.7167 1.95C26.0167 3.25 26.6667 4.82222 26.6667 6.66667V6.66667" fill="#C3C0FF" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-[#DAE2FD]">Ready for more?</h3>
            <p className="text-base text-[#C7C4D8] max-w-[448px] mx-auto">
              Let us know what you're looking for, and we'll build it!
            </p>
            <button className="px-16 py-4 rounded-[12px] bg-[#4F46E5] text-[#DAD7FF] font-medium text-base hover:bg-indigo-500 transition-colors shadow-[0_20px_25px_-5px_rgba(79,70,229,0.20)]"
            onClick={()=>navigate('/contact-us')}
            >
              Contact us
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}
