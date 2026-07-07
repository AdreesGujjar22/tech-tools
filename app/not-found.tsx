import { Link } from "@/lib/router-compat";
import { ArrowLeft, Search, Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0F7F0] via-white to-transparent flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="space-y-4">
          <div className="text-8xl font-extrabold text-[#10A968] opacity-20 tracking-tighter">
            404
          </div>
          <h1 className="text-4xl font-extrabold text-[#1F3A26] tracking-tight">
            Page Not Found
          </h1>
          <p className="text-[#4A6857] text-base leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-6 bg-[#10A968]/10 border border-[#10A968]/30 text-[#10A968] rounded-2xl">
            <Search className="w-12 h-12" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#10A968] hover:bg-[#0d8f56] text-white font-bold rounded-xl transition duration-200 shadow-lg shadow-[#10A968]/20"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E8F0E8] hover:bg-[#D4E8D8] text-[#2D4D35] font-bold rounded-xl transition duration-200 border border-[#C5DCC9]"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="pt-6 border-t border-[#C5DCC9] space-y-3">
          <p className="text-sm text-[#4A6857] font-medium">Quick Navigation</p>
          <div className="grid grid-cols-1 gap-2">
            <Link
              to="/iloveimg"
              className="text-sm text-[#10A968] hover:text-[#0d8f56] font-semibold transition"
            >
              Image Tools
            </Link>
            <Link
              to="/ilovepdf"
              className="text-sm text-[#10A968] hover:text-[#0d8f56] font-semibold transition"
            >
              PDF Tools
            </Link>
            <Link
              to="/tools"
              className="text-sm text-[#10A968] hover:text-[#0d8f56] font-semibold transition"
            >
              All Tools
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
