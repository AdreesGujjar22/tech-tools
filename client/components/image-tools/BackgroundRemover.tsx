"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "@/lib/router-compat";
import {
  ArrowLeft,
  Sparkles,
  Pipette,
  Upload,
  Download,
  Eye,
  Layers,
  AlertCircle,
  Trash2,
  CheckCircle2,
  Loader2,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { IMAGE_TOOLS } from "./toolsData";
import { logImageToolUsage } from "./utils";
import JSZip from "jszip";

interface FileItem {
  id: string;
  file: File;
  originalUrl: string;
  processedUrl: string | null;
  processedBlob: Blob | null;
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  progressMsg: string;
  errorMsg: string | null;
  width: number;
  height: number;
}

export default function BackgroundRemover() {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

  // State
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [engine, setEngine] = useState<"ai" | "chroma">("chroma");
  const [isDragActive, setIsDragActive] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Chroma key configurations
  const [chromaConfig, setChromaConfig] = useState({
    keyR: 255,
    keyG: 255,
    keyB: 255,
    sensitivity: 100,
    feather: 15
  });

  // Slider view parameters
  const [viewMode, setViewMode] = useState<"slider" | "side-by-side" | "mask" | "transparent">("slider");
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up ObjectURLs only on unmount
  useEffect(() => {
    return () => {
      files.forEach((item) => {
        URL.revokeObjectURL(item.originalUrl);
        if (item.processedUrl) {
          URL.revokeObjectURL(item.processedUrl);
        }
      });
    };
  }, []);

  // Handle file list insertions
  const addFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const array = Array.from(selectedFiles);

    const validNewItems: FileItem[] = [];

    array.forEach((file) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        toast.error(`"${file.name}" is an unsupported format.`);
        return;
      }

      const originalUrl = URL.createObjectURL(file);

      // Pre-initialize dimension parameters using an Image layer
      const img = new Image();
      img.onload = () => {
        setFiles((prev) =>
          prev.map((item) =>
            item.originalUrl === originalUrl
              ? { ...item, width: img.width, height: img.height }
              : item
          )
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(originalUrl);
        toast.error(`"${file.name}" failed to load or is corrupted.`);
        setFiles((prev) => prev.filter((item) => item.originalUrl !== originalUrl));
      };
      img.src = originalUrl;

      validNewItems.push({
        id: Math.random().toString(36).substring(7) + "_" + Date.now(),
        file,
        originalUrl,
        processedUrl: null,
        processedBlob: null,
        status: "idle",
        progress: 0,
        progressMsg: "Queue initialized.",
        errorMsg: null,
        width: 0,
        height: 0
      });
    });

    if (validNewItems.length > 0) {
      setFiles((prev) => {
        const next = [...prev, ...validNewItems];
        // If there was no active file, swap focus to first new file
        if (prev.length === 0) {
          setActiveIndex(0);
        }
        return next;
      });
      toast.success(`Successfully queued ${validNewItems.length} images.`);
    }
  };

  // Drag and drop events
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
      addFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => {
      const target = prev[idx];
      URL.revokeObjectURL(target.originalUrl);
      if (target.processedUrl) {
        URL.revokeObjectURL(target.processedUrl);
      }
      const next = prev.filter((_, i) => i !== idx);
      
      if (next.length === 0) {
        setActiveIndex(0);
      } else if (activeIndex >= next.length) {
        setActiveIndex(next.length - 1);
      }
      return next;
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Update a single item in the file array
  const updateFileItem = (id: string, updates: Partial<FileItem>) => {
    setFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Run the background removal pipeline for all remaining idle / error files
  const processAllQueue = async () => {
    if (isProcessing) {
      toast.error("Processing already in progress. Please wait.");
      return;
    }

    const pendingItems = files.filter(f => f.status === "idle" || f.status === "error" || f.status === "processing");
    if (pendingItems.length === 0) {
      toast.info("No queue files need processing.");
      return;
    }

    setIsProcessing(true);

    // Process sequentially to protect browser memory limits
    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (item.status === "success") continue;

      updateFileItem(item.id, { 
        status: "processing", 
        progress: 10, 
        progressMsg: engine === "ai" ? "Starting on-device segmenter..." : "Preparing color wiping layers..." 
      });

      try {
        if (engine === "ai") {
          try {
            // Dynamic import to prevent Node JS server-side render parsing issues during Next build
            const bgModule = await import("@imgly/background-removal");

            // Try multiple export paths
            let removeBackground = bgModule.default || bgModule.removeBackground || bgModule;

            if (typeof removeBackground !== 'function') {
              throw new Error(`Background removal not exported as function. Got type: ${typeof removeBackground}`);
            }

            updateFileItem(item.id, {
              progress: 10,
              progressMsg: "Downloading AI model..."
            });

            const resultBlob = await removeBackground(item.file, {
              publicPath: "https://unpkg.com/@imgly/background-removal@1.7.0/dist/",
              progress: (key, current, total) => {
                const fraction = current / (total || 1);
                const pct = Math.round(fraction * 100);
                const message = key === "fetch"
                  ? `Loading neural parameters (${pct}%)`
                  : `Extracting subjects (${pct}%)`;

                updateFileItem(item.id, {
                  progress: 15 + Math.round(pct * 0.8),
                  progressMsg: message
                });
              }
            });

            const processedUrl = URL.createObjectURL(resultBlob);
            updateFileItem(item.id, {
              status: "success",
              progress: 100,
              progressMsg: "Background removed successfully!",
              processedUrl,
              processedBlob: resultBlob,
              errorMsg: null
            });

            logImageToolUsage("remove-background", item.file.name, item.file.size, true).catch(() => {});
          } catch (aiErr: any) {
            // AI model failed, fallback to Chroma Key
            console.warn("AI model failed, falling back to Chroma Key:", aiErr.message);
            const chromaResult = await onProcessChroma(item.file, chromaConfig);
            const processedUrl = URL.createObjectURL(chromaResult.blob);

            updateFileItem(item.id, {
              status: "success",
              progress: 100,
              progressMsg: "Background removed (using color detection)!",
              processedUrl,
              processedBlob: chromaResult.blob,
              errorMsg: null
            });

            logImageToolUsage("remove-background", item.file.name, item.file.size, true).catch(() => {});
          }
        } else {
          // Chroma Key Color Wipe approach
          const chromaResult = await onProcessChroma(item.file, chromaConfig);
          const processedUrl = URL.createObjectURL(chromaResult.blob);

          updateFileItem(item.id, {
            status: "success",
            progress: 100,
            progressMsg: "Background removed!",
            processedUrl,
            processedBlob: chromaResult.blob,
            errorMsg: null
          });

          logImageToolUsage("remove-background", item.file.name, item.file.size, true).catch(() => {});
        }
      } catch (err: any) {
        console.error("BG Removal Error for:", item.file.name, err);

        const errorMsg = err.message?.includes("metadata") || err.message?.includes("not found")
          ? "Could not process image. Try adjusting the color settings or use a different image."
          : err.message || String(err);

        updateFileItem(item.id, {
          status: "error",
          progress: 0,
          progressMsg: "Extraction failed",
          errorMsg: errorMsg
        });
        toast.error(`Failed to process "${item.file.name}": ${errorMsg}`);
        logImageToolUsage("remove-background", item.file.name, item.file.size, false, err.message || String(err)).catch(() => {});
      }
    }

    setIsProcessing(false);
  };

  // Re-process a single active file
  const reprocessActive = async () => {
    const item = files[activeIndex];
    if (!item) return;

    if (item.processedUrl) {
      URL.revokeObjectURL(item.processedUrl);
    }

    updateFileItem(item.id, { 
      status: "processing", 
      progress: 5, 
      progressMsg: "Restarting segmenter...",
      processedUrl: null,
      processedBlob: null
    });

    try {
      if (engine === "ai") {
        try {
          const bgModule = await import("@imgly/background-removal");
          let removeBackground = bgModule.default || bgModule.removeBackground || bgModule;

          if (typeof removeBackground !== 'function') {
            throw new Error(`Background removal not exported as function. Got type: ${typeof removeBackground}`);
          }

          const resultBlob = await removeBackground(item.file, {
            publicPath: "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/dist/",
            progress: (key, current, total) => {
              const fraction = current / (total || 1);
              const pct = Math.round(fraction * 100);
              updateFileItem(item.id, {
                progress: 20 + Math.round(pct * 0.75),
                progressMsg: key === "fetch" ? `Syncing model (${pct}%)` : `Preserving edges (${pct}%)`
              });
            }
          });

          const processedUrl = URL.createObjectURL(resultBlob);
          updateFileItem(item.id, {
            status: "success",
            progress: 100,
            progressMsg: "Clean AI mask generated!",
            processedUrl,
            processedBlob: resultBlob,
            errorMsg: null
          });
        } catch (aiErr: any) {
          // Fallback to Chroma Key
          console.warn("AI model failed, using Chroma Key instead:", aiErr.message);
          const chromaResult = await onProcessChroma(item.file, chromaConfig);
          const processedUrl = URL.createObjectURL(chromaResult.blob);
          updateFileItem(item.id, {
            status: "success",
            progress: 100,
            progressMsg: "Background removed (color detection)!",
            processedUrl,
            processedBlob: chromaResult.blob,
            errorMsg: null
          });
        }
      } else {
        const chromaResult = await onProcessChroma(item.file, chromaConfig);
        const processedUrl = URL.createObjectURL(chromaResult.blob);
        updateFileItem(item.id, {
          status: "success",
          progress: 100,
          progressMsg: "Background removed!",
          processedUrl,
          processedBlob: chromaResult.blob,
          errorMsg: null
        });
      }
      toast.success("Active file processed successfully!");
    } catch (err: any) {
      console.error(err);
      updateFileItem(item.id, {
        status: "error",
        progress: 0,
        progressMsg: "Compilation failed",
        errorMsg: err.message || String(err)
      });
    }
  };

  // RGB to HSL conversion for better color matching
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h, s, l };
  };

  // Calculate hue difference (accounts for circular nature of hue)
  const hueDistance = (h1: number, h2: number) => {
    const diff = Math.abs(h1 - h2);
    return Math.min(diff, 1 - diff);
  };

  // Pixel chroma wipe implementation
  const onProcessChroma = async (file: File, config: typeof chromaConfig) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to decode layered image."));
      };
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error("Unable to initialize browser canvas buffer.");
    }

    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const targetHsl = rgbToHsl(config.keyR, config.keyG, config.keyB);
    const sensitivity = config.sensitivity / 100; // Normalize to 0-1 range
    const feather = config.feather / 20; // Normalize feather

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const pixelHsl = rgbToHsl(r, g, b);

      // Use weighted HSL distance
      const hDist = hueDistance(targetHsl.h, pixelHsl.h) * 2; // Hue is most important
      const sDist = Math.abs(targetHsl.s - pixelHsl.s);
      const lDist = Math.abs(targetHsl.l - pixelHsl.l) * 0.5; // Lightness less important

      const distance = Math.sqrt(hDist * hDist + sDist * sDist + lDist * lDist);

      if (distance < sensitivity) {
        data[i + 3] = 0; // Completely transparent alpha
      } else if (feather > 0 && distance < sensitivity + feather) {
        // Feather transition
        const diff = distance - sensitivity;
        const ratio = diff / feather;
        data[i + 3] = Math.round(ratio * 255);
      }
    }

    ctx.putImageData(imgData, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (b) resolve(b);
        else reject(new Error("Failed to compile canvas transparency layers."));
      }, "image/png");
    });

    let outName = file.name;
    const splitDot = outName.lastIndexOf(".");
    const baseName = splitDot !== -1 ? outName.substring(0, splitDot) : outName;

    return {
      blob,
      fileName: `${baseName}_bg_removed.png`
    };
  };

  // Sample backdrop chroma-key color from corners and edges
  const sampleBackdropColor = () => {
    const activeItem = files[activeIndex];
    if (!activeItem) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);

        // Sample from multiple corners and edges to get dominant background color
        const samples = [
          ctx.getImageData(0, 0, 1, 1).data,           // top-left
          ctx.getImageData(img.width - 1, 0, 1, 1).data,  // top-right
          ctx.getImageData(0, img.height - 1, 1, 1).data, // bottom-left
          ctx.getImageData(img.width - 1, img.height - 1, 1, 1).data, // bottom-right
        ];

        // Average the samples
        let avgR = 0, avgG = 0, avgB = 0;
        samples.forEach(sample => {
          avgR += sample[0];
          avgG += sample[1];
          avgB += sample[2];
        });
        avgR = Math.round(avgR / samples.length);
        avgG = Math.round(avgG / samples.length);
        avgB = Math.round(avgB / samples.length);

        setChromaConfig((prev) => ({
          ...prev,
          keyR: avgR,
          keyG: avgG,
          keyB: avgB
        }));
        toast.success(`Sampled background color: RGB(${avgR}, ${avgG}, ${avgB})`);
      }
    };
    img.onerror = () => {
      toast.error("Failed to load image for color sampling.");
    };
    img.src = activeItem.originalUrl;
  };

  // Downloader
  const downloadSingle = (item: FileItem) => {
    if (!item.processedUrl) return;
    const a = document.createElement("a");
    a.href = item.processedUrl;
    a.download = `${item.file.name.substring(0, item.file.name.lastIndexOf(".")) || item.file.name}_transparent.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const packAndDownloadZip = async () => {
    const processedItems = files.filter(f => f.status === "success" && f.processedBlob);
    if (processedItems.length === 0) return;

    if (processedItems.length === 1) {
      downloadSingle(processedItems[0]);
      return;
    }

    setIsZipping(true);
    try {
      const zip = new JSZip();
      processedItems.forEach((item) => {
        const name = `${item.file.name.substring(0, item.file.name.lastIndexOf(".")) || item.file.name}_transparent.png`;
        if (item.processedBlob) {
          zip.file(name, item.processedBlob);
        }
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transparent_subjects_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download ZIP packed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to compile ZIP container.");
    } finally {
      setIsZipping(false);
    }
  };

  // Before/after split slider interactions
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offset = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (offset / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleSliderMove(e.clientX);
  };

  useEffect(() => {
    if (!isSliding) return;

    const stopSliding = () => setIsSliding(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("mouseup", stopSliding);
    window.addEventListener("touchend", stopSliding);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", stopSliding);
      window.removeEventListener("touchend", stopSliding);
    };
  }, [isSliding]);

  // Dimensions & human metrics helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const activeFileItem = files[activeIndex];

  // Hex generator
  const hexFromRgb = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back route link */}
      <div className="flex items-center justify-between mb-8">
        <Link 
          to="/iloveimg" 
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Image Dashboard
        </Link>
        <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900/80 px-2.5 py-1 border border-neutral-800 rounded-lg">
          SECURE ON-DEVICE WORKSPACE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main interactive viewport container */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none mb-2">
                Remove Background
              </h1>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
                Erase backdrops automatically or manually with state-of-the-art accuracy. Completely client-side, local, and private.
              </p>
            </div>
          </div>

          {/* Viewport canvas arena */}
          {files.length === 0 ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition relative overflow-hidden flex flex-col items-center justify-center min-h-[380px] ${
                isDragActive 
                  ? "border-teal-500 bg-teal-500/[0.03]" 
                  : "border-neutral-805 bg-neutral-950/40 hover:border-teal-500/40 hover:bg-neutral-950/60"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => addFiles(e.target.files)}
                multiple
                accept={allowedExtensions.join(", ")}
                className="hidden"
              />

              <div className="p-4 bg-neutral-900/80 border border-neutral-850 text-neutral-400 rounded-3xl mb-4 relative z-10 shadow-xl">
                <Upload className="w-8 h-8 text-neutral-400" />
              </div>

              <div className="space-y-2 relative z-10 max-w-sm">
                <h3 className="text-white font-bold text-base">
                  Drag & drop your images here
                </h3>
                <p className="text-[#C7C4D8]/80 text-xs leading-relaxed">
                  or click to browse local files. Supports <span className="font-semibold text-neutral-300">PNG, JPG, JPEG, WEBP, GIF</span> formats.
                </p>
              </div>

              <div className="absolute bottom-4 text-[10px] text-neutral-500 font-mono flex items-center gap-1.5 bg-neutral-950/90 p-1 px-3 border border-neutral-900 rounded-full">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
                Zero cloud uploads. Your photos never leave your device.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Top Viewport Header Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-neutral-950/80 border border-neutral-900 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="text-left font-mono shrink-0">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase block leading-none mb-1">
                      ACTIVE FILE
                    </span>
                    <span className="text-xs text-white font-medium max-w-[150px] sm:max-w-[220px] truncate block leading-none">
                      {activeFileItem?.file.name}
                    </span>
                  </div>
                  {activeFileItem?.width > 0 && (
                    <span className="text-[10px] font-mono bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded border border-neutral-800">
                      {activeFileItem.width}x{activeFileItem.height}
                    </span>
                  )}
                </div>

                {/* View Selection Row */}
                {activeFileItem?.status === "success" && (
                  <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
                    <button
                      onClick={() => setViewMode("slider")}
                      className={`px-3 py-1 text-2xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                        viewMode === "slider"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                          : "text-neutral-400 hover:text-white border border-transparent"
                      }`}
                    >
                      <Eye className="w-3 h-3" /> Split Slider
                    </button>
                    <button
                      onClick={() => setViewMode("side-by-side")}
                      className={`px-3 py-1 text-2xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                        viewMode === "side-by-side"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                          : "text-neutral-400 hover:text-white border border-transparent"
                      }`}
                    >
                      <Layers className="w-3 h-3" /> Side-by-Side
                    </button>
                    <button
                      onClick={() => setViewMode("transparent")}
                      className={`px-3 py-1 text-2xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                        viewMode === "transparent"
                          ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                          : "text-neutral-400 hover:text-white border border-transparent"
                      }`}
                    >
                      Output
                    </button>
                  </div>
                )}
              </div>

              {/* Viewport Canvas Frame */}
              <div 
                ref={containerRef}
                className="relative min-h-[380px] w-full bg-neutral-950 border border-neutral-900 rounded-3xl overflow-hidden flex items-center justify-center select-none"
              >
                {/* Checkered pattern definitions background */}
                <div 
                  className="absolute inset-0 z-0 opacity-60"
                  style={{
                    backgroundImage: "linear-gradient(45deg, #111111 25%, transparent 25%), linear-gradient(-45deg, #111111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111111 75%), linear-gradient(-45deg, transparent 75%, #111111 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 0, 10px 10px, -10px -10px",
                    backgroundColor: "#1c1c1f"
                  }}
                />

                {/* Status-specific overlayers */}
                {activeFileItem?.status === "processing" && (
                  <div className="absolute inset-0 z-20 bg-neutral-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 space-y-4">
                    <Loader2 className="w-10 h-10 text-teal-400 animate-spin" />
                    <div className="text-center space-y-1">
                      <p className="text-white font-bold text-sm">Processing image...</p>
                      <p className="text-neutral-400 text-xs font-mono">{activeFileItem.progressMsg}</p>
                    </div>

                    <div className="w-full max-w-xs bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${activeFileItem.progress}%` }}
                        className="bg-teal-400 h-full transition-all duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400">{activeFileItem.progress}% COMPLETED</span>
                  </div>
                )}

                {activeFileItem?.status === "error" && (
                  <div className="absolute inset-0 z-20 bg-neutral-950/90 flex flex-col items-center justify-center p-6 space-y-4 text-center">
                    <AlertCircle className="w-12 h-12 text-rose-500" />
                    <div className="space-y-1.5 max-w-md">
                      <p className="text-white font-bold text-sm">Pipeline extraction failed</p>
                      <p className="text-rose-400/85 text-xs font-mono leading-relaxed bg-rose-950/30 p-3 rounded-xl border border-rose-900/30">
                        {activeFileItem.errorMsg || "An unknown system constraint error occurred."}
                      </p>
                    </div>
                    <button
                      onClick={reprocessActive}
                      className="px-5 py-2 bg-neutral-900 border border-neutral-800 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retry Processing
                    </button>
                  </div>
                )}

                {/* Pre-computation state viewport */}
                {(activeFileItem?.status === "idle") && (
                  <div className="absolute inset-0 z-20 bg-neutral-950/70 backdrop-blur-2xs flex flex-col items-center justify-center p-6 space-y-4 text-center">
                    <Sparkles className="w-12 h-12 text-teal-400/60" />
                    <div className="space-y-1 max-w-xs">
                      <p className="text-white font-bold text-sm">Awaiting active compilation</p>
                      <p className="text-neutral-400 text-xs">
                        Click the processing buttons on the right margin to initiate the transparent mask output layers.
                      </p>
                    </div>
                    <button
                      onClick={reprocessActive}
                      className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-neutral-950 text-xs font-extrabold rounded-xl shadow-lg shadow-teal-500/10 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      Process Active Now
                    </button>
                  </div>
                )}

                {/* Visual view mode renderer */}
                {activeFileItem && (
                  <div className="relative w-full h-full min-h-[380px] p-6 flex items-center justify-center z-10">
                    {/* ORIGINAL IMAGE (only shown if not transparent output mode) */}
                    {activeFileItem.status === "success" && viewMode === "slider" ? (
                      <div className="relative max-w-full max-h-[320px] overflow-hidden rounded-xl shadow-2xl">
                        {/* Original component underlayer */}
                        <img 
                          src={activeFileItem.originalUrl}
                          className="max-w-full max-h-[320px] object-contain block select-none pointer-events-none"
                          alt="Under original"
                        />

                        {/* Top transparent overlayer with clipping */}
                        {activeFileItem.processedUrl && (
                          <div 
                            className="absolute inset-0 overflow-hidden"
                            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                          >
                            <img 
                              src={activeFileItem.processedUrl}
                              className="w-full h-full object-contain block select-none pointer-events-none absolute top-0 left-0"
                              style={{ width: "100%", height: "100%" }}
                              alt="Over transparent"
                            />
                          </div>
                        )}

                        {/* Middle Drag Slider Line & Pin */}
                        <div 
                          className="absolute top-0 bottom-0 z-30 w-1 bg-teal-400 cursor-ew-resize flex items-center justify-center group"
                          style={{ left: `${sliderPos}%` }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIsSliding(true);
                          }}
                          onTouchStart={(e) => {
                            setIsSliding(true);
                          }}
                        >
                          <div className="w-7 h-7 bg-teal-400 text-neutral-950 font-bold text-3xs flex items-center justify-center rounded-full shadow-xl shadow-teal-950/20 active:scale-90 select-none cursor-ew-resize border-2 border-white pointer-events-none shrink-0 font-mono">
                            ⇔
                          </div>
                        </div>
                      </div>
                    ) : viewMode === "side-by-side" && activeFileItem.status === "success" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full items-center">
                        <div className="space-y-1.5 text-center">
                          <p className="text-[10px] font-mono text-neutral-400 font-bold uppercase">Original Frame</p>
                          <div className="bg-neutral-900 border border-neutral-850 p-2 rounded-2xl flex items-center justify-center h-[260px]">
                            <img 
                              src={activeFileItem.originalUrl}
                              className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                              alt="Original view"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5 text-center">
                          <p className="text-[10px] font-mono text-teal-400 font-bold uppercase">Transparent Subject</p>
                          <div 
                            className="bg-neutral-900 border border-neutral-850 p-2 rounded-2xl flex items-center justify-center h-[260px] relative overflow-hidden"
                            style={{
                              backgroundImage: "linear-gradient(45deg, #111111 25%, transparent 25%), linear-gradient(-45deg, #111111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111111 75%), linear-gradient(-45deg, transparent 75%, #111111 75%)",
                              backgroundSize: "16px 16px",
                              backgroundPosition: "0 0, 0 0, 8px 8px, -8px -8px",
                              backgroundColor: "#161618"
                            }}
                          >
                            {activeFileItem.processedUrl && (
                              <img 
                                src={activeFileItem.processedUrl}
                                className="max-w-full max-h-full object-contain rounded-lg drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                                alt="Processed view"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (viewMode === "transparent" && activeFileItem.status === "success") || activeFileItem.status === "idle" ? (
                      <div className="max-w-full max-h-[320px] flex items-center justify-center">
                        <img 
                          src={activeFileItem.processedUrl || activeFileItem.originalUrl}
                          className="max-w-full max-h-[320px] object-contain rounded-xl shadow-2xl"
                          alt="Raw preview"
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Dynamic Queue Bar showing below workspace */}
              {files.length > 1 && (
                <div className="p-4 bg-neutral-950/60 border border-neutral-900 rounded-3xl space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      BATCH PIPELINE QUEUE ({files.length} ITEMS)
                    </span>
                    <button
                      onClick={() => {
                        setFiles([]);
                        setActiveIndex(0);
                        toast.info("Cleared entire queue.");
                      }}
                      className="text-neutral-500 hover:text-white transition text-3xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Queue
                    </button>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1.5 custom-scroll scrollbar-thin">
                    {files.map((item, idx) => {
                      const isActive = idx === activeIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setActiveIndex(idx)}
                          className={`relative shrink-0 width-[68px] h-[68px] rounded-xl overflow-hidden border cursor-pointer transition-all ${
                            isActive 
                              ? "border-teal-400 ring-2 ring-teal-500/20 scale-95" 
                              : "border-neutral-800 hover:border-neutral-700 bg-neutral-900/60"
                          }`}
                        >
                          <img 
                            src={item.originalUrl}
                            className="w-full h-full object-cover opacity-80"
                            alt="thumb"
                          />
                          {item.status === "processing" && (
                            <div className="absolute inset-0 bg-neutral-950/70 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                            </div>
                          )}
                          {item.status === "success" && (
                            <div className="absolute bottom-1 right-1 p-0.5 bg-teal-500 text-neutral-950 rounded-full">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            </div>
                          )}
                          {item.status === "error" && (
                            <div className="absolute bottom-1 right-1 p-0.5 bg-rose-500 text-white rounded-full">
                              <AlertCircle className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="shrink-0 width-[68px] h-[68px] rounded-xl border border-dashed border-neutral-700 hover:border-teal-500/40 hover:bg-teal-500/[0.01] flex flex-col items-center justify-center cursor-pointer text-neutral-400 hover:text-teal-400 transition"
                    >
                      <span className="text-xl font-medium">+</span>
                      <span className="text-[8px] font-bold font-mono">ADD ENY</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right configuration sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-neutral-950/80 border border-neutral-905 rounded-3xl p-6 shadow-xl leading-relaxed text-left flex flex-col space-y-6">
            <div className="border-b border-neutral-900 pb-3">
              <h3 className="font-extrabold text-neutral-200 text-base flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
                Pipeline Settings
              </h3>
            </div>

            {/* Segmentation Method Tab Row */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-neutral-400 font-mono uppercase tracking-wider block">
                Detection Engine
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-850">
                <button
                  onClick={() => setEngine("ai")}
                  className={`py-2 text-2xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    engine === "ai"
                      ? "bg-teal-500 text-neutral-950 shadow-md font-black"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3 h-3" /> AI Model
                </button>
                <button
                  onClick={() => setEngine("chroma")}
                  className={`py-2 text-2xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    engine === "chroma"
                      ? "bg-teal-500 text-neutral-950 shadow-md font-black"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <Pipette className="w-3 h-3" /> Chroma wiping
                </button>
              </div>
            </div>

            {/* AI specific visual specs */}
            {engine === "ai" && (
              <div className="p-4 bg-teal-950/10 border border-teal-900/20 rounded-2xl space-y-3.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span className="text-[10px] font-bold font-mono tracking-wide text-teal-400 block uppercase">
                    Neural Edge Detection
                  </span>
                </div>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Processes and isolates portraits, products, and complex scenes. Excels in hair, transparency, and high-fidelity edge preservation entirely in-browser.
                </p>
                <div className="text-[9px] font-mono text-neutral-500 flex items-center gap-1 leading-normal">
                  <span className="w-1 h-1 bg-neutral-600 rounded-full shrink-0" />
                  Powered by Web Assembly segmenter pipeline.
                </div>
              </div>
            )}

            {/* Chroma configurations rendering */}
            {engine === "chroma" && (
              <div className="space-y-4 pt-1">
                {/* sampled backdrop rendering block */}
                <div className="p-3.5 bg-neutral-900/60 border border-neutral-850 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-400 font-mono uppercase">
                      Samplers Color Match
                    </span>
                    <button
                      onClick={sampleBackdropColor}
                      disabled={files.length === 0}
                      className="text-[9px] font-mono text-teal-400 hover:underline disabled:opacity-40"
                    >
                      🧪 Auto Corner
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl border border-neutral-700 shadow-inner shrink-0"
                      style={{ backgroundColor: `rgb(${chromaConfig.keyR}, ${chromaConfig.keyG}, ${chromaConfig.keyB})` }}
                    />
                    <div className="font-mono text-3xs text-neutral-400 space-y-0.5">
                      <p className="font-semibold text-white">RGB: {chromaConfig.keyR}, {chromaConfig.keyG}, {chromaConfig.keyB}</p>
                      <p>Hex: {hexFromRgb(chromaConfig.keyR, chromaConfig.keyG, chromaConfig.keyB).toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="pt-1 select-none">
                    <label className="text-[9px] font-bold font-mono text-neutral-500 uppercase block mb-1">
                      Pick Custom Mask Color
                    </label>
                    <input 
                      type="color"
                      className="w-full h-8 bg-neutral-950 border border-neutral-800 rounded-lg cursor-pointer"
                      value={hexFromRgb(chromaConfig.keyR, chromaConfig.keyG, chromaConfig.keyB)}
                      onChange={(e) => {
                        const rgb = hexToRgb(e.target.value);
                        setChromaConfig(prev => ({ ...prev, ...rgb }));
                      }}
                    />
                  </div>
                </div>

                {/* Chroma sliders */}
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-neutral-400">
                      <span>COLOR TOLERANCE</span>
                      <span className="text-teal-400 font-extrabold">{chromaConfig.sensitivity}</span>
                    </div>
                    <input 
                      type="range"
                      min="5"
                      max="160"
                      className="w-full accent-teal-500 cursor-pointer"
                      value={chromaConfig.sensitivity}
                      onChange={(e) => setChromaConfig(prev => ({ ...prev, sensitivity: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-neutral-400">
                      <span>EDGE FEATHER SMOOTHNESS</span>
                      <span className="text-teal-400 font-extrabold">{chromaConfig.feather}px</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="12"
                      className="w-full accent-teal-500 cursor-pointer"
                      value={chromaConfig.feather}
                      onChange={(e) => setChromaConfig(prev => ({ ...prev, feather: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Main Action Process Block */}
            {files.length > 0 && (
              <div className="space-y-3 pt-2">
                <button
                  onClick={processAllQueue}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed font-extrabold text-neutral-950 text-sm rounded-xl transition duration-200 outline-none hover:shadow-teal-900/20 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
                      Processing Queue...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 shrink-0" />
                      Remove Background Now
                    </>
                  )}
                </button>

                {files.filter(f => f.status === "success").length > 0 && (
                  <button
                    onClick={packAndDownloadZip}
                    disabled={isZipping}
                    className="w-full py-3 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isZipping ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                        Packaging ZIP...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        {files.filter(f => f.status === "success").length > 1 
                          ? `Download ZIP (${files.filter(f => f.status === "success").length} Files)` 
                          : "Download Transformed PNG"}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Status Queue overview panels */}
            {files.length > 0 && (
              <div className="p-3 bg-neutral-900/30 border border-neutral-900 rounded-2xl text-xs space-y-2">
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Queued files:</span>
                  <span className="font-mono text-white font-semibold">{files.length} items</span>
                </div>
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Processed:</span>
                  <span className="font-mono text-teal-400 font-bold">
                    {files.filter(f => f.status === "success").length} / {files.length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-neutral-405">
                  <span>Batch file size:</span>
                  <span className="font-mono text-neutral-300">
                    {formatBytes(files.reduce((acc, current) => acc + current.file.size, 0))}
                  </span>
                </div>
              </div>
            )}

            {files.length > 0 && (
              <button
                onClick={() => {
                  setFiles([]);
                  setActiveIndex(0);
                }}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 hover:border-neutral-800 rounded-xl text-neutral-400 hover:text-white transition text-xs font-semibold cursor-pointer"
              >
                Clear Workspace
              </button>
            )}

            {files.length === 0 && (
              <div className="py-8 text-center text-xs text-neutral-500 font-mono leading-relaxed">
                Please drag and drop image files onto the select box to initiate process commands.
              </div>
            )}
          </div>

          {/* Quick FAQ info panel */}
          <div className="bg-neutral-950/40 border border-neutral-900 rounded-2xl p-5 text-left leading-relaxed">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-teal-400 font-mono block mb-2">
              Privacy and Containment Guard
            </span>
            <p className="text-neutral-400 text-xs">
              Every crop, segment, model load, and alpha rendering occurs 100% locally within your secure browser cache. Perfect isolation guarantees total security and works fully offline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
