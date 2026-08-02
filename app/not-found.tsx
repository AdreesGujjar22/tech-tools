import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0F7F0] via-white to-transparent">
      <div className="max-w-6xl mx-auto px-4 py-20 h-screen flex flex-col items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-9xl font-extrabold text-[#10A968]">404</h1>

          <div className="space-y-3">
            <h2 className="text-4xl font-bold text-[#1F3A26]">Page Not Found</h2>
            <p className="text-lg text-[#4A6857] leading-relaxed">
              Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#10A968] hover:bg-[#0d8f56] text-white font-bold rounded-xl transition duration-200 shadow-lg shadow-[#10A968]/20"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </div>

          <div className="pt-12 border-t border-[#C5DCC9] mt-12">
            <p className="text-sm font-semibold text-[#4A6857] mb-6">Explore Our Tools</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/iloveimg"
                className="px-6 py-3 bg-[#F0F7F0] hover:bg-[#E8F0E8] text-[#2D4D35] font-semibold rounded-xl transition border border-[#C5DCC9]"
              >
                Image Tools
              </Link>
              <Link
                href="/ilovepdf"
                className="px-6 py-3 bg-[#F0F7F0] hover:bg-[#E8F0E8] text-[#2D4D35] font-semibold rounded-xl transition border border-[#C5DCC9]"
              >
                PDF Tools
              </Link>
              <Link
                href="/tools"
                className="px-6 py-3 bg-[#F0F7F0] hover:bg-[#E8F0E8] text-[#2D4D35] font-semibold rounded-xl transition border border-[#C5DCC9]"
              >
                All Tools
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
