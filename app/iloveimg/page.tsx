"use client";

"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/lib/router-compat";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Search,
  Settings,
  Lock,
  ShieldCheck,
  RefreshCw,
  Power,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { IMAGE_TOOLS, IMAGE_CATEGORY_LABELS, IMAGE_CATEGORY_COLORS, getImageToolIcon } from "@/components/image-tools/toolsData";
import { checkImageToolEnabled, setImageToolEnabled } from "@/components/image-tools/utils";
import { FeatureCard } from "@/components/ui/FeatureCard";

export default function LoveImgDashboard() {
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
      try {
        for (const tool of IMAGE_TOOLS) {
          try {
            statusMap[tool.id] = await checkImageToolEnabled(tool.id);
          } catch (err) {
            // If Firebase is offline, assume tool is enabled
            statusMap[tool.id] = true;
          }
        }
        setToolsStatus(statusMap);
      } catch (err) {
        // Enable all tools if Firebase is unavailable
        const allEnabled: { [id: string]: boolean } = {};
        IMAGE_TOOLS.forEach(tool => {
          allEnabled[tool.id] = true;
        });
        setToolsStatus(allEnabled);
      }
    }
    loadAllStatuses();
  }, []);

  // Fetch Firestore Analytics Telemetries
  const loadTelemetryLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const analyticsRef = collection(db, "image_tool_analytics");
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
    } catch (err: any) {
      console.error("Telemetry query failed:", err);
      // Handle offline gracefully
      if (err.message?.includes("offline")) {
        toast.error("Cannot load telemetry: Firebase is offline.");
      } else {
        toast.error("Administrator permissions required to pull live analytics stream.");
      }
      setTelemetryLogs([]);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const handleAdminAuth = () => {
    if (adminAuthPassword === "admin123" || adminAuthPassword === "developer") {
      setIsAdminAuthorized(true);
      toast.success("Admin clearance accepted! Image database telemetry unlocked.");
      loadTelemetryLogs();
    } else {
      toast.error("Invalid secret credential. Try 'admin123'.");
    }
  };

  const handleToggleTool = async (toolId: string, currentEnabled: boolean) => {
    const nextState = !currentEnabled;
    try {
      await setImageToolEnabled(toolId, nextState);
      setToolsStatus(prev => ({ ...prev, [toolId]: nextState }));
      toast.success(`[${toolId}] state saved to Firestore: ${nextState ? "ONLINE" : "OFFLINE"}`);
    } catch (err) {
      toast.error("Database sync failed. Verify permissions or settings rules.");
    }
  };

  // Filter criteria
  const filteredTools = IMAGE_TOOLS.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-transparent text-foreground selection:bg-[#10A968]/30">
      {/* Premium Header Hero Area */}
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
            100% Client-Side Image Processing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-[#1F3A26] mb-6"
          >
            SaaS Tools to compress, convert,
            <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10A968] to-[#10A968] ml-1.5">
              and edit images in batch
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="text-[#4A6857] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-10"
          >
            Unlock extremely fast cropping, scaling, watermarking, filters, background key subtraction, and conversions. Sandboxed entirely within your browser context.
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
              placeholder="Search image tools (e.g., crop, background, png)..."
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
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-tight transition duration-150 cursor-pointer ${selectedCategory === "all"
                  ? "brand-gradient text-white shadow-lg shadow-[#10A968]/20"
                  : "bg-[#E8F0E8] border border-[#C5DCC9] text-[#4A6857] hover:text-[#2D4D35]"
                }`}
            >
              All Tools
            </button>
            {Object.entries(IMAGE_CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-tight transition duration-150 cursor-pointer ${selectedCategory === key
                    ? "brand-gradient text-white shadow-lg shadow-[#10A968]/20"
                    : "bg-[#E8F0E8] border border-[#C5DCC9] text-[#4A6857] hover:text-[#2D4D35]"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`p-2.5 rounded-xl border transition duration-150 relative cursor-pointer ${isAdminMode
                ? "bg-[#F0F7F0] border-[#C5DCC9] text-[#10A968] shadow-xl"
                : "bg-[#E8F0E8] border border-[#C5DCC9] text-[#4A6857] hover:text-[#2D4D35]"
              }`}
            title="System Settings"
          >
            <Settings className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#10A968] rounded-full" />
          </button>
        </div>
      </section>

      {/* Main Grid Elements */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <AnimatePresence mode="popLayout">
          {/* Admin Control Panel */}
          {isAdminMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[#0A0F1D] border border-neutral-800 rounded-3xl p-6 mb-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/[0.02] blur-[80px] rounded-full pointer-events-none" />

              <div className="flex items-center justify-between border-b border-indigo-950/45 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-indigo-400" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Image Admin Diagnostics Panel</h3>
                    <p className="text-2xs text-indigo-350 font-mono">Status: {isAdminAuthorized ? "Clearance Active" : "Authorization Required"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAdminMode(false)}
                  className="p-1 px-2.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-neutral-400 hover:text-white text-[10px] rounded-lg transition font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>

              {!isAdminAuthorized ? (
                <div className="max-w-md mx-auto py-8 text-center space-y-4">
                  <Lock className="w-10 h-10 text-neutral-500 mx-auto animate-bounce" />
                  <div>
                    <h4 className="text-white font-semibold text-sm">Passcode Required</h4>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed mt-1">
                      Authenticate with secret configurations to bypass local restrictions and view Firestore live analytic streams.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Specify developer credential..."
                      value={adminAuthPassword}
                      onChange={(e) => setAdminAuthPassword(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAdminAuth()}
                      className="w-full px-4 py-2.5 bg-[#141B31]/60 border border-neutral-800 focus:border-indigo-500 rounded-xl text-xs text-white focus:outline-none"
                    />
                    <button
                      onClick={handleAdminAuth}
                      className="px-4 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                    >
                      Verify
                    </button>
                  </div>
                  <p className="text-3xs text-neutral-500 font-mono">Hint: Use password 'admin123'</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                  {/* Left Column: Toggles */}
                  <div className="lg:col-span-1 space-y-4">
                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#999B99]">Settings Panel</h4>
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scroll border border-neutral-900 bg-neutral-900/10 p-3 rounded-2xl">
                      {IMAGE_TOOLS.map((tool) => {
                        const isOffline = toolsStatus[tool.id] === false;
                        return (
                          <div key={tool.id} className="flex items-center justify-between text-xs font-mono p-2 bg-neutral-950/80 rounded-xl border border-neutral-900">
                            <span className="truncate max-w-[140px] text-[#4A6857] font-semibold">{tool.name}</span>
                            <button
                              onClick={() => handleToggleTool(tool.id, !isOffline)}
                              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold font-mono transition text-3xs cursor-pointer ${isOffline
                                  ? "bg-rose-950/60 border border-rose-905/60 text-rose-400"
                                  : "bg-emerald-950/60 border border-emerald-905/60 text-emerald-400"
                                }`}
                            >
                              <Power className="w-3 h-3" />
                              {isOffline ? "DISBLD" : "ACTIVE"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Operations live stream */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-500">Image Operations Telemetry Logs (Firestore)</h4>
                      <button
                        onClick={loadTelemetryLogs}
                        disabled={isLoadingLogs}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono hover:underline disabled:opacity-50 cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? "animate-spin" : ""}`} /> Refresh
                      </button>
                    </div>

                    <div className="bg-neutral-900/10 border border-neutral-900 rounded-2xl p-4 overflow-x-auto">
                      {isLoadingLogs ? (
                        <div className="py-12 text-center text-xs text-neutral-500 font-mono flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" /> Fetching live Firestore telemetry logs...
                        </div>
                      ) : telemetryLogs.length === 0 ? (
                        <div className="py-12 text-center text-xs text-neutral-500 font-mono">
                          No operations logged yet. Perform a conversion to populate metrics!
                        </div>
                      ) : (
                        <table className="w-full text-xs font-mono text-left whitespace-nowrap">
                          <thead>
                            <tr className="border-b border-[#C5DCC9] text-[#999B99]">
                              <th className="pb-2 font-semibold">Timestamp</th>
                              <th className="pb-2 font-semibold">Tool</th>
                              <th className="pb-2 font-semibold">Mime File</th>
                              <th className="pb-2 font-semibold">Size</th>
                              <th className="pb-2 font-semibold text-right">State</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#C5DCC9]/60">
                            {telemetryLogs.map((log) => (
                              <tr key={log.id} className="text-neutral-300">
                                <td className="py-2.5 text-neutral-500">{log.timestamp.toLocaleTimeString()}</td>
                                <td className="py-2.5 font-bold text-white">{log.toolId}</td>
                                <td className="py-2.5 max-w-[150px] truncate text-neutral-400">{log.fileName}</td>
                                <td className="py-2.5">{(log.fileSize / 1024).toFixed(1)} KB</td>
                                <td className={`py-2.5 text-right font-bold ${log.success ? "text-emerald-500" : "text-rose-500"}`}>
                                  {log.success ? "SUCCESS" : "FAIL"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tools Cards Listing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTools.map((tool) => {
            const ToolIcon = getImageToolIcon(tool.iconName);
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
