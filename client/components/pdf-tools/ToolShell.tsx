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
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { PDF_TOOLS, getToolIcon } from "./toolsData";
import { logPdfToolUsage, checkPdfToolEnabled } from "./utils";

// Map tool ID to standard icon resolver
export function resolveToolIcon(iconName: string) {
  const IconComponent = getToolIcon(iconName);
  return <IconComponent className="w-8 h-8" />;
}

interface ToolShellProps {
  toolId: string;
  allowedExtensions: string[]; // e.g. ['.pdf', '.docx']
  allowMultiple?: boolean;
  maxFiles?: number;
  configTitle?: string;
  renderConfig?: (
    files: File[], 
    config: any, 
    setConfig: React.Dispatch<React.SetStateAction<any>>
  ) => React.ReactNode;
  defaultConfig?: any;
  onProcess: (files: File[], config: any, updateProgress: (percentage: number, msg?: string) => void) => Promise<{ blob: Blob; fileName: string; meta?: any }>;
}

export default function ToolShell({
  toolId,
  allowedExtensions,
  allowMultiple = false,
  maxFiles = 50,
  configTitle = "Settings",
  renderConfig,
  defaultConfig = {},
  onProcess
}: ToolShellProps) {
  const tool = PDF_TOOLS.find((t) => t.id === toolId);
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const [stage, setStage] = useState<"select" | "config" | "processing" | "success">("select");
  const [files, setFiles] = useState<File[]>([]);
  const [config, setConfig] = useState<any>(defaultConfig);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Progress states
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  
  // Success states
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadName, setDownloadName] = useState("");
  const [savedBytes, setSavedBytes] = useState<{ original: number; final: number; ratio?: number } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync / check tool active on startup
  useEffect(() => {
    async function loadStatus() {
      const active = await checkPdfToolEnabled(toolId);
      setIsEnabled(active);
    }
    loadStatus();
  }, [toolId]);

  // Clean up ObjectURL
  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Tool Not Found</h1>
        <p className="text-gray-400 mb-6">The requested PDF tool does not exist.</p>
        <Link to="/ilovepdf" className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
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
        <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
          The <span className="font-semibold text-white">[{tool.name}]</span> tool has been temporarily disabled by the administrator. Please check back later or use other tools.
        </p>
        <Link to="/ilovepdf" className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition duration-200 border border-neutral-700/50">
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

  const handleManualSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    filterAndAddFiles(e.target.files);
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

  const handleProcessAction = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }
    
    setProgress(0);
    setProgressMsg("Preparing streams...");
    setStage("processing");

    let statusSuccess = false;
    let errMsg: string | null = null;
    let originalTotalSize = files.reduce((sum, f) => sum + f.size, 0);

    try {
      const response = await onProcess(files, config, (percentage, msg) => {
        setProgress(percentage);
        if (msg) setProgressMsg(msg);
      });

      const url = URL.createObjectURL(response.blob);
      setDownloadUrl(url);
      setDownloadName(response.fileName);

      if (response.meta?.originalSize !== undefined && response.meta?.finalSize !== undefined) {
        setSavedBytes({
          original: response.meta.originalSize,
          final: response.meta.finalSize,
          ratio: Number((100 - (response.meta.finalSize / response.meta.originalSize) * 100).toFixed(1))
        });
      } else {
        setSavedBytes({
          original: originalTotalSize,
          final: response.blob.size
        });
      }

      setStage("success");
      statusSuccess = true;
      toast.success(`${tool.name} completed successfully!`);
    } catch (err: any) {
      console.error(err);
      errMsg = err.message || "An exception occurred during PDF conversion process.";
      toast.error(errMsg);
      setStage("config");
    } finally {
      // Telemetry hook
      await logPdfToolUsage(toolId, files[0]?.name || "multi_files", originalTotalSize, statusSuccess, errMsg);
    }
  };

  const resetAll = () => {
    setFiles([]);
    setProgress(0);
    setProgressMsg("");
    setDownloadUrl(null);
    setDownloadName("");
    setSavedBytes(null);
    setConfig(defaultConfig);
    setStage("select");
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const ToolIcon = getToolIcon(tool.iconName);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Shell Header */}
      <div className="mb-8">
        <Link 
          to="/ilovepdf" 
          className="inline-flex items-center gap-2 text-sm text-[#C7C4D8]/80 hover:text-white transition group mb-4"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to all tools
        </Link>
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl text-indigo-400 shadow-xl shadow-indigo-950/20">
            <ToolIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{tool.name}</h1>
            <p className="text-[#C7C4D8]/80 max-w-2xl text-sm md:text-base leading-relaxed">{tool.longDesc}</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Stage 1: File Upload Selector */}
        {stage === "select" && (
          <motion.div
            key="select-stage"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className={`relative min-h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 transition-colors duration-300 ${
              isDragActive 
                ? "border-indigo-500 bg-indigo-500/5" 
                : "border-neutral-800 bg-[rgba(20,27,49,0.4)] hover:border-neutral-700 hover:bg-[rgba(20,27,49,0.5)]"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={allowedExtensions.join(", ")}
              multiple={allowMultiple}
              onChange={handleFileChange}
            />
            
            <div className="p-6 bg-neutral-900 rounded-full border border-neutral-800 mb-6 shadow-2xl relative">
              <Upload className="w-12 h-12 text-[#C7C4D8]" />
              <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full" />
            </div>

            <h3 className="text-xl font-semibold text-white mb-2 text-center">
              Drag & Drop your files here
            </h3>
            
            <p className="text-[#C7C4D8]/80 text-sm mb-6 text-center max-w-md leading-relaxed">
              Accepting files: {allowedExtensions.join(", ")} (max {formatSize(50 * 1024 * 1024)})
            </p>

            <button
              onClick={handleManualSelect}
              id="select-files-btn"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 font-semibold text-white rounded-2xl hover:from-indigo-600 hover:to-indigo-700 transition duration-200 shadow-xl shadow-indigo-950/40 text-md active:scale-98 cursor-pointer"
            >
              Select {allowMultiple ? "Files" : "File"}
            </button>
          </motion.div>
        )}

        {/* Stage 2: Configuration & Preview Layer */}
        {stage === "config" && (
          <motion.div
            key="config-stage"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left side: Uploaded file List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2 text-lg">
                  Loaded Files <span>({files.length})</span>
                </h3>
                {allowMultiple && files.length < maxFiles && (
                  <button
                    onClick={handleManualSelect}
                    className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-medium transition cursor-pointer"
                  >
                    <Upload className="w-4 h-4" /> Add Files
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={allowedExtensions.join(", ")}
                multiple={allowMultiple}
                onChange={handleFileChange}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scroll">
                {files.map((file, idx) => (
                  <motion.div
                    key={`${file.name}-${idx}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition relative group"
                  >
                    <div className="p-3 bg-neutral-800 border border-neutral-750 text-neutral-300 rounded-xl relative overflow-hidden flex-shrink-0">
                      <File className="w-5 h-5 text-indigo-400 relative z-10" />
                    </div>
                    <div className="overflow-hidden flex-1 min-w-0 pr-6">
                      <p className="text-sm font-semibold text-white truncate break-all mb-0.5">{file.name}</p>
                      <p className="text-xs text-[#C7C4D8]/60 font-mono">{formatSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 bg-neutral-950/80 hover:bg-rose-950 border border-neutral-800 hover:border-rose-900/60 text-neutral-400 hover:text-rose-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right side: Config parameters Column */}
            <div className="bg-[#141B31]/60 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="border-b border-neutral-800 pb-4">
                  <h3 className="font-semibold text-white text-md tracking-tight">{configTitle}</h3>
                </div>

                {renderConfig ? (
                  renderConfig(files, config, setConfig)
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-sm text-[#C7C4D8]/80">Ready to build your output file stream.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-neutral-800">
                <button
                  onClick={handleProcessAction}
                  id="process-btn"
                  className="w-full py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 font-semibold text-white rounded-2xl hover:from-indigo-600 hover:to-indigo-700 transition duration-205 shadow-xl shadow-indigo-950/40 flex items-center justify-center gap-2 text-md active:scale-98 cursor-pointer"
                >
                  {tool.name}
                </button>
                <button
                  onClick={resetAll}
                  className="w-full py-3 bg-neutral-800/40 hover:bg-neutral-800 border border-neutral-850 hover:border-neutral-700 hover:text-white font-medium text-[#C7C4D8]/80 rounded-2xl transition duration-200 cursor-pointer"
                >
                  Clear & Choose Different
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage 3: Dynamic processing meter panel */}
        {stage === "processing" && (
          <motion.div
            key="processing-stage"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-xl mx-auto rounded-3xl bg-neutral-900 border border-neutral-800 p-8 text-center"
          >
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="w-14 h-14 text-indigo-400 animate-spin mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Processing Document</h3>
              <p className="text-[#C7C4D8]/80 text-sm max-w-sm mb-6 leading-relaxed">
                {progressMsg || "Assembling document components, running cryptographic rendering and matrix scaling..."}
              </p>

              {/* Progress visualizer */}
              <div className="w-full bg-neutral-850 rounded-full h-2.5 overflow-hidden border border-neutral-800 relative mb-4">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-[#C7C4D8]/60 font-mono">{progress}% Complete</span>
            </div>
          </motion.div>
        )}

        {/* Stage 4: Conversion success CTA banner */}
        {stage === "success" && (
          <motion.div
            key="success-stage"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="max-w-xl mx-auto rounded-3xl bg-neutral-900 border border-neutral-850 p-8 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600" />
            <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none" />

            <div className="flex flex-col items-center justify-center p-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full mb-6 relative">
                <CheckCircle2 className="w-12 h-12" />
                <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Success! PDF is ready</h3>
              <p className="text-[#C7C4D8]/80 text-sm max-w-sm mb-8 leading-relaxed">
                Your operation completed perfectly. You can download the processed container now.
              </p>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={downloadName}
                  id="download-link"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4.5 bg-gradient-to-r from-indigo-500 to-indigo-600 font-bold text-white rounded-2xl hover:from-indigo-600 hover:to-indigo-700 transition duration-250 shadow-xl shadow-indigo-950/40 text-md active:scale-98 mb-6"
                >
                  <Download className="w-5 h-5" />
                  Download File
                </a>
              )}

              {savedBytes && (
                <div className="w-full grid grid-cols-2 gap-4 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-4 text-left font-mono text-xs mb-8">
                  <div>
                    <span className="text-neutral-500 block mb-0.5">Original Size:</span>
                    <span className="text-neutral-300 font-semibold">{formatSize(savedBytes.original)}</span>
                  </div>
                  <div>
                    {savedBytes.ratio !== undefined ? (
                      <>
                        <span className="text-neutral-500 block mb-0.5">Ratio Saved:</span>
                        <span className="text-emerald-500 font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" /> -{savedBytes.ratio}%
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-neutral-500 block mb-0.5">Final Size:</span>
                        <span className="text-neutral-300 font-semibold">{formatSize(savedBytes.final)}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={resetAll}
                className="w-full py-3 bg-neutral-850 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 hover:text-white font-semibold text-neutral-400 rounded-2xl transition duration-200"
              >
                Perform another action
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
