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
        <h1 className="text-2xl font-semibold mb-2 text-[#1F3A26]">Tool Not Found</h1>
        <p className="text-[#4A6857] mb-6">The requested PDF tool does not exist.</p>
        <Link to="/ilovepdf" className="px-6 py-2 bg-[#10A968] text-white rounded-lg hover:bg-[#0d8f56] transition">
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
        <p className="text-[#4A6857] max-w-md mb-6 leading-relaxed">
          The <span className="font-semibold text-[#2D4D35]">[{tool.name}]</span> tool has been temporarily disabled by the administrator. Please check back later or use other tools.
        </p>
        <Link to="/ilovepdf" className="px-5 py-2.5 bg-[#E8F0E8] hover:bg-[#D4E8D8] text-[#2D4D35] font-medium rounded-xl transition duration-200 border border-[#C5DCC9]">
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
          className="inline-flex items-center gap-2 text-sm text-[#4A6857] hover:text-[#2D4D35] transition group mb-4"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to all tools
        </Link>
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-[#F0F7F0] border border-[#C5DCC9] rounded-2xl text-[#10A968] shadow-xl shadow-[#10A968]/10">
            <ToolIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1F3A26] mb-2">{tool.name}</h1>
            <p className="text-[#4A6857] max-w-2xl text-sm md:text-base leading-relaxed">{tool.longDesc}</p>
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
                ? "border-[#10A968] bg-[#10A968]/5"
                : "border-[#C5DCC9] bg-[#F0F7F0] hover:border-[#10A968]/50 hover:bg-[#E8F0E8]"
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
            
            <div className="p-6 bg-[#F0F7F0] rounded-full border border-[#C5DCC9] mb-6 shadow-lg relative">
              <Upload className="w-12 h-12 text-[#10A968]" />
              <div className="absolute inset-0 bg-[#10A968]/10 blur-xl rounded-full" />
            </div>

            <h3 className="text-xl font-semibold text-[#1F3A26] mb-2 text-center">
              Drag & Drop your files here
            </h3>

            <p className="text-[#4A6857] text-sm mb-6 text-center max-w-md leading-relaxed">
              Accepting files: {allowedExtensions.join(", ")} (max {formatSize(50 * 1024 * 1024)})
            </p>

            <button
              onClick={handleManualSelect}
              id="select-files-btn"
              className="px-8 py-4 brand-gradient font-semibold text-white rounded-2xl hover:opacity-90 transition duration-200 shadow-lg shadow-[#10A968]/30 text-md active:scale-98 cursor-pointer"
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
                <h3 className="font-semibold text-[#1F3A26] flex items-center gap-2 text-lg">
                  Loaded Files <span>({files.length})</span>
                </h3>
                {allowMultiple && files.length < maxFiles && (
                  <button
                    onClick={handleManualSelect}
                    className="text-sm text-[#10A968] hover:text-[#0d8f56] flex items-center gap-1.5 font-medium transition cursor-pointer"
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
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#F0F7F0] border border-[#C5DCC9] hover:border-[#10A968]/50 transition relative group"
                  >
                    <div className="p-3 bg-[#E8F0E8] border border-[#C5DCC9] text-[#4A6857] rounded-xl relative overflow-hidden flex-shrink-0">
                      <File className="w-5 h-5 text-[#10A968] relative z-10" />
                    </div>
                    <div className="overflow-hidden flex-1 min-w-0 pr-6">
                      <p className="text-sm font-semibold text-[#1F3A26] truncate break-all mb-0.5">{file.name}</p>
                      <p className="text-xs text-[#999B99] font-mono">{formatSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 bg-red-100 hover:bg-red-200 border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right side: Config parameters Column */}
            <div className="bg-[#F0F7F0] border border-[#C5DCC9] rounded-3xl p-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="border-b border-[#C5DCC9] pb-4">
                  <h3 className="font-semibold text-[#1F3A26] text-md tracking-tight">{configTitle}</h3>
                </div>

                {renderConfig ? (
                  renderConfig(files, config, setConfig)
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-sm text-[#4A6857]">Ready to build your output file stream.</p>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-3 pt-6 border-t border-[#C5DCC9]">
                <button
                  onClick={handleProcessAction}
                  id="process-btn"
                  className="w-full py-4 brand-gradient font-semibold text-white rounded-2xl hover:opacity-90 transition duration-205 shadow-lg shadow-[#10A968]/30 flex items-center justify-center gap-2 text-md active:scale-98 cursor-pointer"
                >
                  {tool.name}
                </button>
                <button
                  onClick={resetAll}
                  className="w-full py-3 bg-[#E8F0E8] hover:bg-[#D4E8D8] border border-[#C5DCC9] hover:border-[#10A968]/50 hover:text-[#2D4D35] font-medium text-[#4A6857] rounded-2xl transition duration-200 cursor-pointer"
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
            className="max-w-xl mx-auto rounded-3xl bg-white border border-[#C5DCC9] p-8 text-center"
          >
            <div className="flex flex-col items-center justify-center p-8">
              <Loader2 className="w-14 h-14 text-[#10A968] animate-spin mb-6" />
              <h3 className="text-xl font-bold text-[#1F3A26] mb-2">Processing Document</h3>
              <p className="text-[#4A6857] text-sm max-w-sm mb-6 leading-relaxed">
                {progressMsg || "Assembling document components, running cryptographic rendering and matrix scaling..."}
              </p>

              {/* Progress visualizer */}
              <div className="w-full bg-[#E8F0E8] rounded-full h-2.5 overflow-hidden border border-[#C5DCC9] relative mb-4">
                <div
                  className="bg-[#10A968] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-[#999B99] font-mono">{progress}% Complete</span>
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
            className="max-w-xl mx-auto rounded-3xl bg-white border border-[#C5DCC9] p-8 text-center shadow-lg relative overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1.5 brand-gradient" />
            <div className="absolute inset-0 bg-[#10A968]/[0.01] pointer-events-none" />

            <div className="flex flex-col items-center justify-center p-4">
              <div className="p-4 bg-[#10A968]/10 border border-[#10A968]/20 text-[#10A968] rounded-full mb-6 relative">
                <CheckCircle2 className="w-12 h-12" />
                <div className="absolute inset-0 bg-[#10A968]/10 blur-xl rounded-full" />
              </div>

              <h3 className="text-2xl font-bold text-[#1F3A26] mb-2">Success! PDF is ready</h3>
              <p className="text-[#4A6857] text-sm max-w-sm mb-8 leading-relaxed">
                Your operation completed perfectly. You can download the processed container now.
              </p>

              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={downloadName}
                  id="download-link"
                  className="w-full inline-flex items-center justify-center gap-2.5 py-4.5 brand-gradient font-bold text-white rounded-2xl hover:opacity-90 transition duration-250 shadow-lg shadow-[#10A968]/30 text-md active:scale-98 mb-6"
                >
                  <Download className="w-5 h-5" />
                  Download File
                </a>
              )}

              {savedBytes && (
                <div className="w-full grid grid-cols-2 gap-4 bg-[#F0F7F0] border border-[#C5DCC9] rounded-2xl p-4 text-left font-mono text-xs mb-8">
                  <div>
                    <span className="text-[#999B99] block mb-0.5">Original Size:</span>
                    <span className="text-[#2D4D35] font-semibold">{formatSize(savedBytes.original)}</span>
                  </div>
                  <div>
                    {savedBytes.ratio !== undefined ? (
                      <>
                        <span className="text-[#999B99] block mb-0.5">Ratio Saved:</span>
                        <span className="text-[#10A968] font-semibold flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5" /> -{savedBytes.ratio}%
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#999B99] block mb-0.5">Final Size:</span>
                        <span className="text-[#2D4D35] font-semibold">{formatSize(savedBytes.final)}</span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={resetAll}
                className="w-full py-3 bg-[#E8F0E8] hover:bg-[#D4E8D8] border border-[#C5DCC9] hover:border-[#10A968]/50 hover:text-[#2D4D35] font-semibold text-[#4A6857] rounded-2xl transition duration-200"
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
