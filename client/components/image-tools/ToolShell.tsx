"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link } from "@/lib/router-compat";
import {
  Upload,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  X,
  File,
  Download,
  AlertTriangle,
  RotateCw,
  TrendingDown,
  FileImage,
  ImageIcon,
  Lock,
  Settings,
  Zap,
  Package,
  Plus,
  Shield,
  Settings2,
  Cpu,
  Wifi,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { IMAGE_TOOLS, getImageToolIcon } from "./toolsData";
import { logImageToolUsage, checkImageToolEnabled } from "./utils";
import JSZip from "jszip";

// Map tool ID to standard icon resolver
export function resolveToolIcon(iconName: string) {
  const IconComponent = getImageToolIcon(iconName);
  return <IconComponent className="w-8 h-8" />;
}

interface ProcessedFileResult {
  blob: Blob;
  fileName: string;
  originalSize: number;
  newSize: number;
}

interface ToolShellProps {
  toolId: string;
  allowedExtensions: string[]; // e.g. ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']
  allowMultiple?: boolean;
  maxFiles?: number;
  configTitle?: string;
  renderConfig?: (
    files: File[], 
    config: any, 
    setConfig: React.Dispatch<React.SetStateAction<any>>
  ) => React.ReactNode;
  defaultConfig?: any;
  onProcessFile: (
    file: File, 
    config: any, 
    index: number, 
    updateProgress: (percentage: number, msg?: string) => void
  ) => Promise<{ blob: Blob; fileName: string }>;
}

export default function ToolShell({
  toolId,
  allowedExtensions,
  allowMultiple = false,
  maxFiles = 50,
  configTitle = "Settings",
  renderConfig,
  defaultConfig = {},
  onProcessFile
}: ToolShellProps) {
  const tool = IMAGE_TOOLS.find((t) => t.id === toolId);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [stage, setStage] = useState<"select" | "config" | "processing" | "success">("select");
  const [files, setFiles] = useState<File[]>([]);
  const [config, setConfig] = useState<any>(defaultConfig);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Progress states
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  
  // Success states
  const [processedResults, setProcessedResults] = useState<ProcessedFileResult[]>([]);
  const [zipDownloadUrl, setZipDownloadUrl] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync / check tool active on startup
  useEffect(() => {
    async function loadStatus() {
      try {
        const active = await checkImageToolEnabled(toolId);
        setIsEnabled(active);
      } catch (err) {
        // If Firebase is offline or unavailable, assume tool is enabled
        console.warn("Could not check tool status from Firebase, assuming enabled:", err);
        setIsEnabled(true);
      }
    }
    loadStatus();
  }, [toolId]);

  // Clean up ObjectURLs
  useEffect(() => {
    return () => {
      if (zipDownloadUrl) {
        URL.revokeObjectURL(zipDownloadUrl);
      }
    };
  }, [zipDownloadUrl]);

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertTriangle className="w-16 h-16 text-[#10A968] mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold tracking-tight text-[#1F3A26] mb-2">Tool Not Found</h1>
        <p className="text-[#4A6857] mb-6 max-w-sm">The requested Image tool does not exist.</p>
        <Link to="/iloveimg" className="px-6 py-2 bg-[#10A968] hover:bg-[#0d8f56] text-white rounded-xl font-semibold transition cursor-pointer">
          Return to Hub
        </Link>
      </div>
    );
  }

  if (isEnabled === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold tracking-tight text-[#1F3A26] mb-2">Tool Temporarily Offline</h1>
        <p className="text-[#4A6857] max-w-sm mb-6 leading-relaxed text-sm">
          The <span className="font-semibold text-[#2D4D35]">[{tool.name}]</span> tool has been temporarily disabled by the administrator. Please check back later.
        </p>
        <Link to="/iloveimg" className="px-5 py-2.5 bg-[#E8F0E8] hover:bg-[#D4E8D8] text-[#2D4D35] font-medium rounded-xl transition duration-200 border border-[#C5DCC9]">
          Back to Hub
        </Link>
      </div>
    );
  }

  // File Handling
  const filterAndAddFiles = (newFileList: FileList | null) => {
    if (!newFileList) return;
    const fileArray = Array.from(newFileList);
    
    const validFiles = fileArray.filter((file) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      const isAllowed = allowedExtensions.includes(ext) || allowedExtensions.includes("*");
      if (!isAllowed) {
        toast.error(`Invalid extension for "${file.name}". Supported: ${allowedExtensions.join(", ")}`);
      }
      return isAllowed;
    });

    if (validFiles.length === 0) return;

    if (!allowMultiple) {
      setFiles([validFiles[0]]);
      setStage("config");
    } else {
      setFiles((prev) => {
        const merged = [...prev, ...validFiles].slice(0, maxFiles);
        return merged;
      });
      setStage("config");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files) {
      filterAndAddFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        setStage("select");
      }
      return updated;
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Convert size to human readable
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Process files sequentially or in batch
  const handleProcessSubmit = async () => {
    if (files.length === 0) return;
    setStage("processing");
    setProgress(0);
    setProgressMsg("Preparing compiler pipeline...");
    
    const results: ProcessedFileResult[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const stepWeight = 100 / files.length;
        
        const updateItemProgress = (itemPercent: number, msg?: string) => {
          const totalBase = i * stepWeight;
          const totalPercent = Math.min(Math.round(totalBase + (itemPercent * stepWeight / 100)), 95);
          setProgress(totalPercent);
          setProgressMsg(msg || `Processing image [${i+1}/${files.length}]: ${file.name}`);
        };
        
        try {
          const res = await onProcessFile(file, config, i, updateItemProgress);
          results.push({
            blob: res.blob,
            fileName: res.fileName,
            originalSize: file.size,
            newSize: res.blob.size
          });

          // Telemetry save (non-blocking)
          logImageToolUsage(toolId, file.name, file.size, true).catch(() => {
            // Silently fail on Firebase offline or connection errors
          });
        } catch (fileErr: any) {
          console.error(`Failed to process ${file.name}:`, fileErr);
          toast.error(`Error processing ${file.name}: ${fileErr.message || fileErr}`);
          logImageToolUsage(toolId, file.name, file.size, false, fileErr.message || String(fileErr)).catch(() => {
            // Silently fail on Firebase offline or connection errors
          });
        }
      }

      if (results.length === 0) {
        throw new Error("No files were successfully compiled.");
      }

      setProgress(100);
      setProgressMsg("Finished compilation processing!");
      setProcessedResults(results);
      
      // If single file, create instant url
      if (results.length === 1) {
        const url = URL.createObjectURL(results[0].blob);
        setZipDownloadUrl(url);
      } else {
        // Prepare Zip download dynamically backgrounded
        triggerZipGeneration(results);
      }
      
      setStage("success");
      toast.success("Images compiled fully in-browser!");
    } catch (err: any) {
      toast.error(err.message || "An error occurred during compilation.");
      setStage("config");
    }
  };

  const triggerZipGeneration = async (resultsList: ProcessedFileResult[]) => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      resultsList.forEach((item, idx) => {
        // Deduplicate filename just in case
        zip.file(item.fileName, item.blob);
      });
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      setZipDownloadUrl(url);
    } catch (err) {
      console.error("ZIP creation failed:", err);
      toast.error("Failed to package files as a dynamic ZIP.");
    } finally {
      setIsZipping(false);
    }
  };

  const handleDownloadAll = () => {
    if (!zipDownloadUrl) return;
    const a = document.createElement("a");
    a.href = zipDownloadUrl;
    if (processedResults.length === 1) {
      a.download = processedResults[0].fileName;
    } else {
      a.download = `iloveimg_compiled_${Date.now()}.zip`;
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSingle = (res: ProcessedFileResult) => {
    const singleUrl = URL.createObjectURL(res.blob);
    const a = document.createElement("a");
    a.href = singleUrl;
    a.download = res.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(singleUrl);
  };

  const handleReset = () => {
    setFiles([]);
    setProcessedResults([]);
    if (zipDownloadUrl && processedResults.length > 1) {
      URL.revokeObjectURL(zipDownloadUrl);
    }
    setZipDownloadUrl(null);
    setStage("select");
  };

  // Aggregated size changes
  const originalTotalBytes = processedResults.reduce((acc, f) => acc + f.originalSize, 0);
  const finalTotalBytes = processedResults.reduce((acc, f) => acc + f.newSize, 0);
  const totalRatio = originalTotalBytes > 0 
    ? Math.round(100 - (finalTotalBytes / originalTotalBytes * 100)) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
      {/* Route Back Header Link */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/iloveimg"
          className="inline-flex items-center gap-2 text-sm text-[#4A6857] hover:text-[#2D4D35] font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Image Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Work Area Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-start gap-4 rounded-2xl border border-[#C5DCC9] bg-white p-5 shadow-sm">
            <div className="p-3 bg-[#E8F0E8] border border-[#C5DCC9] text-[#10A968] rounded-xl shrink-0">
              {React.createElement(getImageToolIcon(tool.iconName), { className: "w-6 h-6" })}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3A26] tracking-tight leading-none mb-2">
                {tool.name}
              </h1>
              <p className="text-[#4A6857] text-sm leading-relaxed max-w-2xl">
                {tool.longDesc}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {stage === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileSelect}
                className={`border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[350px] bg-white shadow-sm group ${
                  isDragActive
                    ? "border-[#10A968] bg-[#10A968]/[0.05] scale-[1.01]"
                    : "border-[#C5DCC9] bg-[#F0F7F0] hover:border-[#10A968]/70 hover:bg-[#E8F0E8] hover:shadow-lg hover:shadow-[#10A968]/10"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => filterAndAddFiles(e.target.value ? e.target.files : null)}
                  multiple={allowMultiple}
                  key={files.length}
                  accept={allowedExtensions.join(", ")}
                  className="hidden"
                />

                <div className="p-4 bg-[#10A968]/20 border border-[#10A968]/30 text-[#10A968] rounded-3xl mb-4 relative z-10 shadow-lg shadow-[#10A968]/10 group-hover:bg-[#10A968]/30 group-hover:border-[#10A968]/50 transition-all">
                  <Upload className="w-8 h-8 text-[#10A968] animate-bounce" />
                </div>

                <div className="space-y-3 relative z-10 max-w-sm">
                  <h3 className="text-[#1F3A26] font-bold text-lg group-hover:text-[#10A968] transition">
                    {allowMultiple ? "Drag & drop your images" : "Drag & drop an image"}
                  </h3>
                  <p className="text-[#4A6857] text-sm leading-relaxed group-hover:text-[#2D4D35] transition">
                    or <span className="text-[#10A968] font-semibold cursor-pointer hover:text-[#0d8f56]">click to browse</span> your files
                  </p>
                  <div className="flex flex-wrap gap-1 text-3xs text-[#999B99] font-mono mt-2 pt-1 border-t border-[#C5DCC9]">
                    {allowedExtensions.map((ext) => (
                      <span key={ext} className="text-[#4A6857] font-semibold bg-[#E8F0E8] px-2 py-0.5 rounded">
                        {ext.replace(".", "").toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Secure Containment Badge */}
                <div className="absolute bottom-4 flex items-center gap-2 bg-[#F0F7F0]/80 backdrop-blur-sm p-2 px-3 border border-[#C5DCC9] rounded-full hover:border-[#10A968]/50 hover:bg-[#E8F0E8] transition">
                  <Lock className="w-3 h-3 text-[#10A968] animate-pulse" />
                  <span className="text-3xs text-[#4A6857] font-mono">Local processing • Private</span>
                </div>
              </motion.div>
            )}

            {stage === "config" && (
              <motion.div
                key="config"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* File Previews List */}
                <div className="bg-white border border-[#C5DCC9] rounded-2xl p-5 shadow-sm hover:border-[#10A968]/50 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#C5DCC9]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#10A968]/20 border border-[#10A968]/30 rounded-lg">
                        <Package className="w-4 h-4 text-[#10A968]" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-[#1F3A26] block">Files Ready</span>
                        <span className="text-xs text-[#10A968] font-mono">
                          {files.length} file{files.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    {allowMultiple && (
                      <button
                        onClick={triggerFileSelect}
                        className="flex items-center gap-2 text-sm text-[#10A968] hover:text-[#0d8f56] font-semibold hover:bg-[#10A968]/10 px-3 py-2 rounded-lg transition border border-transparent hover:border-[#10A968]/30 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                        Add More
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => filterAndAddFiles(e.target.files)}
                    multiple={allowMultiple}
                    accept={allowedExtensions.join(", ")}
                    className="hidden"
                  />

                  <div className="space-y-2 max-h-[290px] overflow-y-auto pr-2 custom-scroll">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3.5 bg-[#F0F7F0] border border-[#C5DCC9] rounded-xl hover:border-[#10A968]/50 hover:bg-[#E8F0E8] transition group"
                      >
                        <div className="flex items-center gap-3 truncate flex-1 min-w-0">
                          <FileImage className="w-5 h-5 text-[#10A968] shrink-0 group-hover:text-[#0d8f56] transition" />
                          <div className="truncate text-left min-w-0">
                            <p className="text-xs font-semibold text-[#1F3A26] truncate group-hover:text-[#10A968] transition" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-3xs font-mono text-[#4A6857] mt-0.5 group-hover:text-[#2D4D35] transition">
                              {formatSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-2 text-[#4A6857] hover:text-red-600 hover:bg-red-100 rounded-lg transition cursor-pointer border border-transparent hover:border-red-300 shrink-0 ml-2"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* For smaller screen layouts, settings can be placed under as well */}
                <div className="lg:hidden">
                  <div className="bg-white border border-[#C5DCC9] rounded-2xl p-6 space-y-6 shadow-sm">
                    <h3 className="font-bold text-lg text-[#1F3A26] border-b border-[#C5DCC9] pb-3 flex items-center gap-2">
                      <Settings2 className="w-5 h-5" />
                      {configTitle}
                    </h3>
                    {renderConfig && renderConfig(files, config, setConfig)}
                    <button
                    onClick={handleProcessSubmit}
                    className="w-full py-3 bg-[#10A968] hover:bg-[#0d8f56] text-white font-bold text-sm rounded-xl transition shadow-lg shadow-[#10A968]/20 hover:shadow-[#10A968]/40 cursor-pointer border border-[#10A968]/20 hover:border-[#10A968]/50 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Process {files.length} {files.length > 1 ? "Files" : "File"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border border-[#C5DCC9] rounded-3xl p-16 text-center bg-white shadow-sm"
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-full">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-[#10A968]" />
                  <h3 className="text-[#1F3A26] font-extrabold text-xl">Processing Your Images</h3>
                </div>
                <p className="text-[#4A6857] text-sm mb-8 max-w-sm mx-auto font-medium line-clamp-2">
                  {progressMsg}
                </p>

                {/* Progress Bar Container */}
                <div className="max-w-md mx-auto">
                  <div className="w-full bg-[#E8F0E8] rounded-full h-3.5 overflow-hidden mb-3 border border-[#C5DCC9] p-0.5 shadow-inner">
                    <motion.div
                      className="bg-gradient-to-r from-[#0D8F56] via-[#10A968] to-[#54C98A] h-full rounded-full shadow-[0_0_12px_rgba(16,169,104,0.45)]"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-[#1F3A26]">
                      {progress}%
                    </span>
                    <span className="text-2xs font-mono text-[#4A6857]">
                      Optimizing quality & size...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {stage === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Result Hero Header */}
                <div className="border border-[#8DCE9B] bg-gradient-to-br from-[#F0F9F1] to-[#E8F4F7] rounded-3xl p-8 text-center space-y-5 shadow-sm">
                  <div className="flex justify-center">
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-full">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[#1F3A26] font-extrabold text-2xl">All Done!</h3>
                    <p className="text-[#10A968] text-sm mt-2 font-medium">
                      {processedResults.length} {processedResults.length > 1 ? "files optimized" : "file optimized"} and ready to download
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleDownloadAll}
                      disabled={!zipDownloadUrl || isZipping}
                      className="px-6 py-3 bg-[#10A968] hover:bg-[#0d8f56] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-lg shadow-[#10A968]/20 hover:shadow-[#10A968]/40 flex items-center gap-2 transition cursor-pointer border border-[#10A968]/20 hover:border-[#10A968]/50 active:scale-95"
                    >
                      {isZipping ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating package...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          {processedResults.length > 1 ? "Download ZIP" : "Download Image"}
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-white hover:bg-[#F0F7F0] text-[#1F3A26] text-sm font-bold rounded-xl transition cursor-pointer border border-[#9CBDA2] hover:border-[#10A968] active:scale-95 flex items-center gap-2"
                    >
                      <RotateCw className="w-4 h-4" />
                      Process More
                    </button>
                  </div>
                </div>

                {/* Individual File List with Single Downloads */}
                <div className="bg-white border border-[#C5DCC9] rounded-2xl p-5 shadow-sm transition">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg">
                      <FileImage className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#1F3A26] block">Your Files</span>
                      <span className="text-xs text-[#10A968] font-mono">
                        {processedResults.length} file{processedResults.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
                    {processedResults.map((res, index) => {
                      const fileRatio = res.originalSize > 0 
                        ? Math.round(100 - (res.newSize / res.originalSize * 100)) 
                        : 0;
                      
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-[#F7FBF7] border border-[#C5DCC9] rounded-xl hover:border-[#10A968]/60 hover:bg-[#F0F7F0] transition group"
                        >
                          <div className="flex items-center gap-3 truncate pr-4 text-left flex-1">
                            <FileImage className="w-5 h-5 text-indigo-400 shrink-0 group-hover:text-indigo-300 transition" />
                            <div className="truncate flex-1">
                              <p className="text-sm font-semibold text-[#1F3A26] truncate max-w-xs md:max-w-md group-hover:text-[#0D7A4A] transition">
                                {res.fileName}
                              </p>
                              <div className="flex items-center gap-2 mt-1 font-mono text-3xs text-neutral-500 group-hover:text-neutral-400 transition">
                                <span className="text-[#4A6857]">{formatSize(res.originalSize)}</span>
                                <TrendingDown className="w-3 h-3 text-[#6E9277]" />
                                <span className="text-[#1F3A26] font-semibold">{formatSize(res.newSize)}</span>
                                {fileRatio > 0 && (
                                  <span className="text-[#0D7A4A] font-bold bg-[#E1F4E5] border border-[#8DCE9B] px-2 py-0.5 rounded-md ml-1 text-2xs flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {fileRatio}% saved
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDownloadSingle(res)}
                            className="px-4 py-2 text-sm text-white bg-[#10A968] hover:bg-[#0d8f56] border border-[#10A968]/50 rounded-lg flex items-center gap-1.5 font-semibold transition cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                          >
                            <Download className="w-4 h-4" /> Download
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar Column - Configuration and stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main Desktop Configuration Box */}
          <div className="hidden lg:block bg-white border border-[#C5DCC9] rounded-3xl p-6 shadow-sm leading-relaxed">
            <h3 className="font-extrabold text-[#1F3A26] text-base mb-4 pb-3 border-b border-[#C5DCC9] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-505 rounded-full" />
              {configTitle}
            </h3>
            
            <AnimatePresence mode="wait">
              {stage === "select" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center text-xs text-[#4A6857] font-mono leading-relaxed"
                >
                  Please choose or drop image files onto the canvas to configure setting parameters.
                </motion.div>
              )}

              {stage === "config" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {renderConfig && renderConfig(files, config, setConfig)}

                  <button
                    onClick={handleProcessSubmit}
                    className="w-full py-3 bg-[#10A968] hover:bg-[#0d8f56] text-white font-bold text-sm rounded-xl transition shadow-lg shadow-[#10A968]/20 hover:shadow-[#10A968]/40 mt-4 cursor-pointer"
                  >
                    Process {files.length} {files.length > 1 ? "Files" : "File"} Now
                  </button>
                </motion.div>
              )}

              {(stage === "processing" || stage === "success") && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-[#F0F7F0] border border-[#C5DCC9] rounded-2xl space-y-3.5">
                    <span className="text-2xs font-bold font-mono uppercase tracking-wider text-[#4A6857] block">
                      Image Job Status Summary
                    </span>
                    
                    <div className="flex justify-between items-center text-xs text-[#4A6857]">
                      <span>Total Queue:</span>
                      <span className="text-[#1F3A26] font-mono font-bold">{files.length} files</span>
                    </div>

                    {stage === "success" && (
                      <>
                        <div className="flex justify-between items-center text-xs text-[#4A6857]">
                          <span>Original size:</span>
                          <span className="text-[#1F3A26] font-mono">{formatSize(originalTotalBytes)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-[#4A6857]">
                          <span>Compiled size:</span>
                          <span className="text-[#1F3A26] font-mono">{formatSize(finalTotalBytes)}</span>
                        </div>
                        
                        {totalRatio > 0 && (
                          <div className="flex justify-between items-center text-xs text-[#4A6857] pt-2 border-t border-[#C5DCC9]">
                            <span className="text-[#10A968] font-semibold flex items-center gap-1">
                              <TrendingDown className="w-3.5 h-3.5" /> Ratio Saved:
                            </span>
                            <span className="text-emerald-500 font-bold font-mono">-{totalRatio}%</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleReset}
                    className="w-full py-2.5 bg-white hover:bg-[#F0F7F0] text-[#2D4D35] text-xs font-semibold rounded-xl border border-[#9CBDA2] hover:border-[#10A968] transition cursor-pointer"
                  >
                    Clear and start over
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Technology Containment Card */}
          <div className="bg-[#F0F7F0] border border-[#C5DCC9] rounded-2xl p-5 text-left backdrop-blur-sm hover:border-[#10A968]/50 transition">
            <div className="flex items-start gap-3 mb-3 pb-3 border-b border-[#C5DCC9]">
              <div className="p-2.5 bg-[#10A968]/20 border border-[#10A968]/30 rounded-lg shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-[#10A968]" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-[#10A968] block">Technology Containment</span>
                <span className="text-2xs text-[#4A6857] font-mono">Secure Local Processing</span>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 text-sm">
                <Cpu className="w-4 h-4 text-[#10A968] shrink-0 mt-0.5" />
                <p className="text-[#2D4D35] font-medium">All processing runs in your browser sandbox</p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Lock className="w-4 h-4 text-[#10A968] shrink-0 mt-0.5" />
                <p className="text-[#2D4D35] font-medium">Zero data transmission to any server</p>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Wifi className="w-4 h-4 text-[#10A968] shrink-0 mt-0.5" />
                <p className="text-[#2D4D35] font-medium">Works completely offline</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
