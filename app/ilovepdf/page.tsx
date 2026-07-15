"use client";

"use client";

import React, { useState } from "react";
import { Link } from "@/lib/router-compat";
import {
  Search,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { motion } from "motion/react";
import { PDF_TOOLS, CATEGORY_LABELS } from "@/components/pdf-tools/toolsData";

// Icon components resolver
import { getToolIcon } from "@/components/pdf-tools/toolsData";
import { FeatureCard } from "@/components/ui/FeatureCard";

export default function LovePdfDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter criteria
  const filteredTools = PDF_TOOLS.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-transparent text-foreground selection:bg-[#10A968]/30">
      {/* SaaS Premium Header Title Section */}
      <section className="relative overflow-hidden border-b border-[#C5DCC9] bg-gradient-to-b from-[#F0F7F0] via-white to-transparent py-20 pb-24">
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
            100% Client-Side Compiler Hub
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-[#1F3A26] mb-6"
          >
            Every tool you need to <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10A968] to-[#10A968]">
              optimize and master PDFs
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-[#4A6857] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-10"
          >
            Perform lightning-fast PDF actions inside your browser. Your sensitive files never leave your computer, ensuring total containment.
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
              placeholder="Search PDF tools (e.g., merge, compress)..."
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

      {/* Category Tabs Selection Grid */}
      <section className="bg-white sticky top-0 z-40 border-b border-[#C5DCC9] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap custom-scroll">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-tight transition duration-150 cursor-pointer ${
                selectedCategory === "all"
                  ? "brand-gradient text-white shadow-lg shadow-[#10A968]/20"
                  : "bg-[#E8F0E8] border border-[#C5DCC9] text-[#4A6857] hover:text-[#2D4D35]"
              }`}
            >
              All Tools
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-tight transition duration-150 cursor-pointer ${
                  selectedCategory === key
                    ? "brand-gradient text-white shadow-lg shadow-[#10A968]/20"
                    : "bg-[#E8F0E8] border border-[#C5DCC9] text-[#4A6857] hover:text-[#2D4D35]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid Elements */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Tools Cards Listing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTools.map((tool) => {
            const ToolIcon = getToolIcon(tool.iconName);

            return (
              <Link to={tool.route} className="block hover:scale-[1.02] transition-transform min-h-[150px]"
                key={tool.id}>
                <FeatureCard
                  key={tool.id}
                  title={tool.name}
                  description={tool.shortDesc}
                  icon={tool.iconName ? ToolIcon : ChevronRight}
                />
              </Link>
            );
          })}
        </div>

        {/* Empty Search Fallback */}
        {filteredTools.length === 0 && (
          <div className="text-center py-20 border border-dashed border-[#C5DCC9] rounded-3xl bg-[#F0F7F0] max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-[#999B99] mx-auto mb-4" />
            <h4 className="text-[#1F3A26] font-semibold text-sm">No matched tools</h4>
            <p className="text-xs text-[#4A6857] max-w-xs mx-auto mt-1 leading-relaxed">
              We couldn't locate any converters or tools aligning with your parameters. Verify your searching terms.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
