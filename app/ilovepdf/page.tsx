"use client";

"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Search, 
  Settings, 
  Activity, 
  Check, 
  X, 
  FileCheck, 
  Bookmark, 
  Lock, 
  Clock, 
  BarChart4, 
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Power,
  Trash2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { PDF_TOOLS, CATEGORY_LABELS, CATEGORY_COLORS } from "@/components/pdf-tools/toolsData";
import { checkPdfToolEnabled, setPdfToolEnabled } from "@/components/pdf-tools/utils";

// Icon components resolver
import { getToolIcon } from "@/components/pdf-tools/toolsData";
import { FeatureCard } from "@/components/ui/FeatureCard";

export default function LovePdfDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminAuthPassword, setAdminAuthPassword] = useState("");
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  
  // Real-time admin settings & analytics caches
  const [toolsStatus, setToolsStatus] = useState<{ [toolId: string]: boolean }>({});
  const [telemetryLogs, setTelemetryLogs] = useState<any[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Sync tools enabled/disabled states
  useEffect(() => {
    async function loadAllStatuses() {
      const statusMap: { [id: string]: boolean } = {};
      for (const tool of PDF_TOOLS) {
        statusMap[tool.id] = await checkPdfToolEnabled(tool.id);
      }
      setToolsStatus(statusMap);
    }
    loadAllStatuses();
  }, []);

  // Fetch Firestore Analytics Telemetries
  const loadTelemetryLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const analyticsRef = collection(db, "pdf_tool_analytics");
      const q = query(analyticsRef, orderBy("timestamp", "desc"), limit(25));
      const querySnapshot = await getDocs(q);
      const logs: any[] = [];
      querySnapshot.forEach((doc) => {
        const item = doc.data();
        logs.push({
          id: doc.id,
          ...item,
          timestamp: item.timestamp?.toDate() || new Date()
        });
      });
      setTelemetryLogs(logs);
    } catch (err) {
      console.error("Telemetry query failed (Admins only permissions):", err);
      toast.error("Administrators permission requested to pull live telemetries.");
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleAdminAuth = () => {
    // Simple secure gate password to trigger developer panel
    if (adminAuthPassword === "admin123" || adminAuthPassword === "developer") {
      setIsAdminAuthorized(true);
      toast.success("Admin clearance accepted! Database parameters unlocked.");
      loadTelemetryLogs();
    } else {
      toast.error("Invalid secret credential. Try 'admin123'.");
    }
  };

  const handleToggleTool = async (toolId: string, currentEnabled: boolean) => {
    const nextState = !currentEnabled;
    try {
      await setPdfToolEnabled(toolId, nextState);
      setToolsStatus(prev => ({ ...prev, [toolId]: nextState }));
      toast.success(`[${toolId}] state saved to Firestore: ${nextState ? "ONLINE" : "OFFLINE"}`);
    } catch (err) {
      toast.error("Database sync failed. Verify permissions or settings rules.");
    }
  };

  // Filter criteria
  const filteredTools = PDF_TOOLS.filter((tool) => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-transparent text-foreground selection:bg-indigo-500/30">
      {/* SaaS Premium Header Title Section */}
      <section className="relative overflow-hidden border-b border-[rgba(255,255,255,0.06)] bg-gradient-to-at-t from-[#141B31]/40 via-[#060E20]/50 to-transparent py-20 pb-24">
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
            100% Client-Side Compiler Hub
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-white mb-6"
          >
            Every tool you need to <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4F46E5] to-[#4CD7F6]">
              optimize and master PDFs
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-[#C7C4D8]/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-10"
          >
            Perform lightning-fast PDF actions inside your browser. Your sensitive files never leave your computer, ensuring total containment.
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
              placeholder="Search PDF tools (e.g., merge, compress)..."
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

      {/* Category Tabs Selection Grid */}
      <section className="bg-[#060E20]/80 sticky top-0 z-40 border-b border-[rgba(255,255,255,0.06)] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap custom-scroll">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-tight transition duration-150 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-950/20"
                  : "bg-neutral-900 border border-neutral-800 text-[#C7C4D8]/80 hover:text-white"
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
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-950/20"
                    : "bg-neutral-900 border border-neutral-800 text-[#C7C4D8]/80 hover:text-white"
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
            const isOffline = toolsStatus[tool.id] === false;

            return (
              <Link to={tool.route} className={`block ${isOffline ? "pointer-events-none opacity-50" : "hover:scale-[1.02]"} transition-transform min-h-[150px]`}
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
          <div className="text-center py-20 border border-dashed border-neutral-900 rounded-3xl bg-neutral-950/20 max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
            <h4 className="text-white font-semibold text-sm">No matched tools</h4>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto mt-1 leading-relaxed">
              We couldn't locate any converters or tools aligning with your parameters. Verify your searching terms.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
