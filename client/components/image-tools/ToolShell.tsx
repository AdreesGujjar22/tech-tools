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
  ImageIcon
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
      const active = await checkImageToolEnabled(toolId);
      setIsEnabled(active);
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
        <AlertTriangle className="w-16 h-16 text-indigo-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Tool Not Found</h1>
        <p className="text-neutral-400 mb-6 max-w-sm">The requested Image tool does not exist.</p>
        <Link to="/iloveimg" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition cursor-pointer">
          Return to Hub
        </Link>
      </div>
    );
  }

  if (isEnabled === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Tool Temporarily Offline</h1>
        <p className="text-neutral-400 max-w-sm mb-6 leading-relaxed text-sm">
          The <span className="font-semibold text-white">[{tool.name}]</span> tool has been temporarily disabled by the administrator. Please check back later.
        </p>
        <Link to="/iloveimg" className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition duration-200 border border-neutral-700/50">
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

          // Telemetry save
          await logImageToolUsage(toolId, file.name, file.size, true);
        } catch (fileErr: any) {
          console.error(`Failed to process ${file.name}:`, fileErr);
          toast.error(`Error processing ${file.name}: ${fileErr.message || fileErr}`);
          await logImageToolUsage(toolId, file.name, file.size, false, fileErr.message || String(fileErr));
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Route Back Header Link */}
      <div className="flex items-center justify-between mb-8">
        <Link 
          to="/iloveimg" 
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Image Dashboard
        </Link>
        <span className="text-3xs font-mono text-neutral-400 bg-neutral-900 px-2.5 py-1 border border-neutral-800 rounded-lg">
          SECURE CLIENT-SIDE PIPELINE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Work Area Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              {React.createElement(getImageToolIcon(tool.iconName), { className: "w-6 h-6" })}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none mb-2">
                {tool.name}
              </h1>
              <p className="text-[#C7C4D8]/80 text-sm leading-relaxed max-w-2xl">
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
                className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition relative overflow-hidden flex flex-col items-center justify-center min-h-[350px] ${
                  isDragActive 
                    ? "border-indigo-500 bg-indigo-500/[0.03]" 
                    : "border-neutral-805 bg-[#0E1528]/40 hover:border-indigo-500/50 hover:bg-[#121A33]/50"
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

                <div className="p-4 bg-neutral-900/80 border border-neutral-850 text-neutral-400 rounded-3xl mb-4 relative z-10 shadow-xl group-hover:text-indigo-400">
                  <Upload className="w-8 h-8 text-neutral-400 animate-pulse" />
                </div>

                <div className="space-y-2 relative z-10 max-w-sm">
                  <h3 className="text-white font-bold text-base">
                    {allowMultiple ? "Drag & drop your images here" : "Drag & drop an image here"}
                  </h3>
                  <p className="text-[#C7C4D8]/80 text-xs leading-relaxed">
                    or click to browse local files. Supports <span className="font-semibold text-neutral-300">{allowedExtensions.join(", ")}</span> formats.
                  </p>
                </div>

                {/* Secure Containment Badge */}
                <div className="absolute bottom-4 text-[10px] text-neutral-500 font-mono flex items-center gap-1.5 bg-neutral-950/60 p-1 px-2.5 border border-neutral-900 rounded-full">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  Your photos are secure. Zero cloud uploads.
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
                <div className="bg-[#0A0F1D] border border-neutral-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-800">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-450 font-mono">
                      Queue ({files.length} files in compile list)
                    </span>
                    {allowMultiple && (
                      <button 
                        onClick={triggerFileSelect}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold hover:underline cursor-pointer"
                      >
                        + Add More
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
                        className="flex items-center justify-between p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl"
                      >
                        <div className="flex items-center gap-3 truncate pr-4">
                          <FileImage className="w-5 h-5 text-indigo-400 shrink-0" />
                          <div className="truncate text-left">
                            <p className="text-xs font-semibold text-white truncate max-w-md">
                              {file.name}
                            </p>
                            <p className="text-4xs font-mono text-neutral-500 mt-0.5">
                              {formatSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition cursor-pointer"
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
                  <div className="bg-[#0A0F1D] border border-neutral-800 rounded-2xl p-6 space-y-6">
                    <h3 className="font-bold text-md text-white border-b border-neutral-800 pb-3">
                      {configTitle}
                    </h3>
                    {renderConfig && renderConfig(files, config, setConfig)}
                    <button
                      onClick={handleProcessSubmit}
                      className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-xl cursor-pointer"
                    >
                      Process {files.length} {files.length > 1 ? "Files" : "File"} Now
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
                className="border border-[#141B31] rounded-3xl p-16 text-center bg-[#090E1A]/40"
              >
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-6" />
                <h3 className="text-white font-extrabold text-lg mb-2">Executing Image Pipeline...</h3>
                <p className="text-neutral-400 text-xs mb-8 max-w-sm mx-auto font-medium">
                  {progressMsg}
                </p>

                {/* Progress Bar Container */}
                <div className="max-w-md mx-auto">
                  <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden mb-2">
                    <motion.div 
                      className="bg-gradient-to-r from-indigo-500 to-indigo-650 h-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span className="text-3xs font-mono text-neutral-500 font-bold">
                    {progress}% COMPLETION
                  </span>
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
                <div className="border border-indigo-950/80 bg-indigo-950/10 rounded-2xl p-6 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-indigo-400 mx-auto" />
                  <div>
                    <h3 className="text-white font-extrabold text-lg">Image Pipeline Complete!</h3>
                    <p className="text-[#C7C4D8]/80 text-xs mt-1">
                      {processedResults.length} {processedResults.length > 1 ? "files processed and optimized." : "file processed and optimized."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={handleDownloadAll}
                      disabled={!zipDownloadUrl || isZipping}
                      className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xl flex items-center gap-2 transition cursor-pointer"
                    >
                      {isZipping ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Zipping...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          {processedResults.length > 1 ? "Download ZIP Pack" : "Download Optimized Image"}
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Process Another
                    </button>
                  </div>
                </div>

                {/* Individual File List with Single Downloads */}
                <div className="bg-neutral-950/60 border border-neutral-900 rounded-2xl p-4">
                  <span className="text-xs font-bold font-mono tracking-wider text-[#C7C4D8] block mb-3 uppercase">
                    Processed Artifacts ({processedResults.length} files)
                  </span>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
                    {processedResults.map((res, index) => {
                      const fileRatio = res.originalSize > 0 
                        ? Math.round(100 - (res.newSize / res.originalSize * 100)) 
                        : 0;
                      
                      return (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3.5 bg-neutral-900/40 border border-neutral-900 rounded-xl"
                        >
                          <div className="flex items-center gap-3 truncate pr-4 text-left">
                            <FileImage className="w-5 h-5 text-indigo-400 shrink-0" />
                            <div className="truncate">
                              <p className="text-xs font-semibold text-white truncate max-w-xs md:max-w-md">
                                {res.fileName}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 font-mono text-3xs text-neutral-550">
                                <span>{formatSize(res.originalSize)}</span>
                                <span>→</span>
                                <span className="text-white font-semibold">{formatSize(res.newSize)}</span>
                                {fileRatio > 0 && (
                                  <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-900/50 px-1 rounded">
                                    -{fileRatio}% Saved
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDownloadSingle(res)}
                            className="p-1 px-3 text-2xs text-indigo-450 bg-indigo-950/60 hover:bg-indigo-950/90 border border-indigo-900 rounded-lg flex items-center gap-1 font-semibold transition cursor-pointer"
                          >
                            <Download className="w-3 h-3" /> Save
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
          <div className="hidden lg:block bg-neutral-950/60 border border-neutral-900 rounded-3xl p-6 shadow-xl leading-relaxed">
            <h3 className="font-extrabold text-neutral-200 text-base mb-4 pb-3 border-b border-neutral-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-505 rounded-full" />
              {configTitle}
            </h3>
            
            <AnimatePresence mode="wait">
              {stage === "select" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center text-xs text-neutral-500 font-mono leading-relaxed"
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
                    className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 hover:shadow-indigo-950/20 text-white font-bold text-sm rounded-xl transition shadow-xl mt-4 cursor-pointer"
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
                  <div className="p-4 bg-neutral-900/20 border border-neutral-900 rounded-2xl space-y-3.5">
                    <span className="text-2xs font-bold font-mono uppercase tracking-wider text-neutral-500 block">
                      Image Job Status Summary
                    </span>
                    
                    <div className="flex justify-between items-center text-xs text-neutral-400">
                      <span>Total Queue:</span>
                      <span className="text-white font-mono font-bold">{files.length} files</span>
                    </div>

                    {stage === "success" && (
                      <>
                        <div className="flex justify-between items-center text-xs text-neutral-400">
                          <span>Original size:</span>
                          <span className="text-white font-mono">{formatSize(originalTotalBytes)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-neutral-400">
                          <span>Compiled size:</span>
                          <span className="text-white font-mono">{formatSize(finalTotalBytes)}</span>
                        </div>
                        
                        {totalRatio > 0 && (
                          <div className="flex justify-between items-center text-xs text-neutral-400 pt-2 border-t border-neutral-900">
                            <span className="text-emerald-500 font-semibold flex items-center gap-1">
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
                    className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-800 transition cursor-pointer"
                  >
                    Clear and start over
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick FAQ / containment guidelines */}
          <div className="bg-neutral-950/40 border border-neutral-900 rounded-2xl p-5 text-left">
            <span className="text-2xs font-extrabold uppercase tracking-wider text-indigo-400 font-mono block mb-2">
              Technology containment
            </span>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Every crop, filter, upscale, and compression occurs sandbox-isolated within your local browser runtime. Assets are never transferred to a server, providing perfect security, ZERO lag, and offline functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
