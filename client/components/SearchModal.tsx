"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, X, ChevronRight, Sparkles, FileText, ArrowRight, ShieldCheck, ArrowRightLeft, Globe2, Code2, Network, Type, Calculator } from "lucide-react";
import { Link, useNavigate } from "@/lib/router-compat";
import { allDashboardTools, DASHBOARD_CATEGORIES } from "@/lib/dashboards-config";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Reset search on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle ESC and Arrow key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredTools.length > 0 ? (prev + 1) % filteredTools.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredTools.length > 0 ? (prev - 1 + filteredTools.length) % filteredTools.length : 0));
      } else if (e.key === "Enter" && filteredTools[selectedIndex]) {
        e.preventDefault();
        navigate(filteredTools[selectedIndex].route);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, navigate, onClose]);

  const filteredTools = useMemo(() => {
    if (!query.trim()) return allDashboardTools.slice(0, 10); // Show top tools by default
    const q = query.toLowerCase();
    return allDashboardTools.filter(
      (tool) => tool.title.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md transition-all">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl transition-all">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-[#10A968]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search 90+ developer tools..."
            className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredTools.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {query.trim() ? `Search Results (${filteredTools.length})` : "Popular Utilities"}
              </div>
              {filteredTools.map((tool, index) => {
                const Icon = tool.icon || Sparkles;
                const isSelected = index === selectedIndex;
                return (
                  <Link
                    key={tool.id}
                    to={tool.route}
                    onClick={onClose}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 transition-all ${
                      isSelected
                        ? "bg-[#10A968]/10 text-[#10A968] font-semibold dark:bg-[#10A968]/20"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                        isSelected ? "bg-[#10A968] text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      }`}>
                        <Icon size={16} />
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-medium leading-tight">{tool.title}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{tool.description}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className={`shrink-0 ml-2 ${isSelected ? "text-[#10A968]" : "text-slate-400 opacity-0 group-hover:opacity-100"}`} />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No tools matching &quot;{query}&quot; found. Try searching for &quot;PDF&quot;, &quot;JSON&quot;, or &quot;QR&quot;.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold">↑</kbd> <kbd className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold">↓</kbd> navigate</span>
            <span><kbd className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold">↵</kbd> select</span>
            <span><kbd className="rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold">ESC</kbd> close</span>
          </div>
          <span className="font-semibold text-[#10A968]">90+ Tools Available</span>
        </div>
      </div>
    </div>
  );
}
