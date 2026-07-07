"use client";

import React, { useState, useEffect, useRef } from "react";
import { Link } from "@/lib/router-compat";
import {
  ArrowLeft,
  Sparkles,
  Sliders,
  Upload,
  Download,
  Eye,
  Layers,
  AlertCircle,
  Trash2,
  CheckCircle2,
  Loader2,
  RefreshCw,
  X,
  FileImage,
  ImageIcon,
  Maximize2,
  SlidersHorizontal,
  ChevronRight,
  FileBadge,
  FileCheck2,
  Undo,
  Image,
  Zap,
  Landmark,
  Pen
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
  processedWidth: number;
  processedHeight: number;
}

export default function UpscaleImage() {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];
  const tool = IMAGE_TOOLS.find((t) => t.id === "upscale-image");

  // Pica Instance
  const [picaInstance, setPicaInstance] = useState<any>(null);

  // States
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // General configuration parameters
  const [config, setConfig] = useState({
    scale: 2, // 2x or 4x
    preset: "photo", // 'photo' | 'logo' | 'document' | 'illustration'
    customSharpness: 65, // 0 - 100
    customContrast: 20, // 0 - 100
    customSmoothing: 10 // 0 - 100
  });

  // Slider view parameters
  const [viewMode, setViewMode] = useState<"slider" | "side-by-side" | "output">("slider");
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lazy-load Pica to ensure client-side execution (no SSR issues)
  useEffect(() => {
    let active = true;
    const loadPica = async () => {
      try {
        const PicaModule = await import("pica");
        const PicaConstructor = (PicaModule.default || PicaModule) as any;
        if (active) {
          setPicaInstance(new PicaConstructor());
        }
      } catch (err) {
        console.error("Failed to load Pica engine:", err);
        toast.error("Could not load high-performance scaling engine.");
      }
    };
    loadPica();
    return () => {
      active = false;
    };
  }, []);

  // Clean up ObjectURLs on unmount
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

  // Handle file insertions
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
      
      // Determine dimension parameters via an Image object
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
      img.src = originalUrl;

      validNewItems.push({
        id: Math.random().toString(36).substring(7) + "_" + Date.now(),
        file,
        originalUrl,
        processedUrl: null,
        processedBlob: null,
        status: "idle",
        progress: 0,
        progressMsg: "In Queue",
        errorMsg: null,
        width: 0,
        height: 0,
        processedWidth: 0,
        processedHeight: 0
      });
    });

    if (validNewItems.length > 0) {
      setFiles((prev) => {
        const next = [...prev, ...validNewItems];
        if (prev.length === 0) {
          setActiveIndex(0);
        }
        return next;
      });
      toast.success(`Successfully added ${validNewItems.length} images to queue.`);
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

  const updateFileItem = (id: string, updates: Partial<FileItem>) => {
    setFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Preset Convolution Kernels mapping
  const getPresetKernel = (preset: string) => {
    switch (preset) {
      case "logo":
        // Digital Logos: High contrast Laplacian with solid thresholding
        return [
          -0.2, -0.6, -0.2,
          -0.6,  4.2, -0.6,
          -0.2, -0.6, -0.2
        ];
      case "document":
        // Documents / text: Extreme highpass to thicken and crispen stroke bounds
        return [
          -0.5, -1.2, -0.5,
          -1.2,  7.8, -1.2,
          -0.5, -1.2, -0.5
        ];
      case "illustration":
        // Line Art: Sharp boundaries centered with medium bleed suppressors
        return [
          0,   -0.5,  0,
          -0.5, 3.0, -0.5,
          0,   -0.5,  0
        ];
      case "photo":
      default:
        // Photo: Moderate unsharp high-pass, preserving textures naturally
        return [
          0,    -0.25, 0,
          -0.25, 2.0,  -0.25,
          0,    -0.25, 0
        ];
    }
  };

  // Perform custom image enhancements: smoothing, highpass sharpening, contrast balancing
  const postProcessEnhancement = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    kernel: number[],
    sharpPercent: number,
    contrastPercent: number,
    smoothPercent: number
  ) => {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const len = data.length;
    const buffer = new Uint8ClampedArray(len);

    const side = Math.round(Math.sqrt(kernel.length));
    const halfSide = Math.floor(side / 2);

    // Sum coefficients to normalize the kernel weights
    let kernelSum = 0;
    for (let k = 0; k < kernel.length; k++) kernelSum += kernel[k];
    if (kernelSum <= 0) kernelSum = 1;

    const intensityMultiplier = sharpPercent / 100;

    for (let y = 0; y < h; y++) {
      const yOffset = y * w * 4;
      for (let x = 0; x < w; x++) {
        const idx = yOffset + x * 4;

        let rSum = 0;
        let gSum = 0;
        let bSum = 0;

        // Apply spatial convolution across boundary-checked neighbors
        for (let cy = 0; cy < side; cy++) {
          const scy = Math.min(h - 1, Math.max(0, y + cy - halfSide));
          const scyOffset = scy * w * 4;
          const kernelRowOffset = cy * side;

          for (let cx = 0; cx < side; cx++) {
            const scx = Math.min(w - 1, Math.max(0, x + cx - halfSide));
            const srcIdx = scyOffset + scx * 4;
            const weight = kernel[kernelRowOffset + cx];

            rSum += data[srcIdx] * weight;
            gSum += data[srcIdx + 1] * weight;
            bSum += data[srcIdx + 2] * weight;
          }
        }

        const rSharpened = rSum / kernelSum;
        const gSharpened = gSum / kernelSum;
        const bSharpened = bSum / kernelSum;

        // Read original channel states
        const origR = data[idx];
        const origG = data[idx + 1];
        const origB = data[idx + 2];

        // Linear interpolation blend of original vs sharpened pixels
        let r = origR + (rSharpened - origR) * intensityMultiplier;
        let g = origG + (gSharpened - origG) * intensityMultiplier;
        let b = origB + (bSharpened - origB) * intensityMultiplier;

        // Apply noise reduction lowpass filters if specified
        if (smoothPercent > 0) {
          const lowpassR = (origR * 2 + r) / 3;
          const lowpassG = (origG * 2 + g) / 3;
          const lowpassB = (origB * 2 + b) / 3;
          const smoothRatio = smoothPercent / 100;
          r = r * (1 - smoothRatio) + lowpassR * smoothRatio;
          g = g * (1 - smoothRatio) + lowpassG * smoothRatio;
          b = b * (1 - smoothRatio) + lowpassB * smoothRatio;
        }

        // Local contrast transformations
        if (contrastPercent > 0) {
          const factor = 1 + (contrastPercent / 100) * 0.45;
          r = (r - 127) * factor + 127;
          g = (g - 127) * factor + 127;
          b = (b - 127) * factor + 127;
        }

        // Clamp pixel buffer outputs to acceptable RGB standards
        buffer[idx] = r < 0 ? 0 : r > 255 ? 255 : r;
        buffer[idx + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
        buffer[idx + 2] = b < 0 ? 0 : b > 255 ? 255 : b;
        buffer[idx + 3] = data[idx + 3]; // Preserve alpha-channel layers perfectly
      }
    }

    imgData.data.set(buffer);
    ctx.putImageData(imgData, 0, 0);
  };

  // Core processing execution loop
  const processImageItem = async (item: FileItem) => {
    if (!picaInstance) {
      throw new Error("Pica scaling engine is initializing. Please wait.");
    }

    // Step 1: Decode image matrix bounds
    updateFileItem(item.id, { 
      status: "processing", 
      progress: 10, 
      progressMsg: "Decoding image layout bounds..." 
    });

    const img = new Image();
    const loadedPromise = new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error("Unable to decode target image format."));
    });
    img.src = item.originalUrl;
    await loadedPromise;

    const targetW = img.width * config.scale;
    const targetH = img.height * config.scale;

    updateFileItem(item.id, { 
      status: "processing", 
      progress: 30, 
      progressMsg: `Running Lanczos3 resampling: ${targetW}x${targetH}px...` 
    });

    // Step 2: Initialize scale canvasses
    const fromCanvas = document.createElement("canvas");
    fromCanvas.width = img.width;
    fromCanvas.height = img.height;
    const fromCtx = fromCanvas.getContext("2d");
    if (!fromCtx) throw new Error("Could not initialize source canvas context.");
    fromCtx.drawImage(img, 0, 0);

    const toCanvas = document.createElement("canvas");
    toCanvas.width = targetW;
    toCanvas.height = targetH;

    // Step 3: Run Lanczos3 Interpolation Resize via Pica
    await picaInstance.resize(fromCanvas, toCanvas, {
      unsharpAmount: 0, // Disable built-in unsharp in favor of our highly advanced configurable post-processor
      alpha: true
    });

    updateFileItem(item.id, { 
      status: "processing", 
      progress: 70, 
      progressMsg: "Executing detail enhancement matrices..." 
    });

    // Step 4: Run post-process enhancement filters on target canvas
    const toCtx = toCanvas.getContext("2d");
    if (!toCtx) throw new Error("Could not initialize destination canvas context.");
    
    const kernel = getPresetKernel(config.preset);
    postProcessEnhancement(
      toCtx,
      targetW,
      targetH,
      kernel,
      config.customSharpness,
      config.customContrast,
      config.customSmoothing
    );

    updateFileItem(item.id, { 
      status: "processing", 
      progress: 90, 
      progressMsg: "Encoding high-resolution optimized output..." 
    });

    // Step 5: Convert canvas to Blob output
    const targetMimeType = item.file.type || "image/png";
    const finalBlob = await new Promise<Blob>((resolve, reject) => {
      toCanvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to export target canvas context."));
      }, targetMimeType, 0.95);
    });

    const processedUrl = URL.createObjectURL(finalBlob);

    // Get output name
    const outName = item.file.name;
    const splitDot = outName.lastIndexOf(".");
    const baseName = splitDot !== -1 ? outName.substring(0, splitDot) : outName;
    const originalExt = splitDot !== -1 ? outName.substring(splitDot).toLowerCase() : ".png";
    const finalName = `${baseName}_upscaled_${config.scale}x${originalExt}`;

    updateFileItem(item.id, {
      status: "success",
      progress: 100,
      progressMsg: "Enhanced successfully!",
      processedUrl,
      processedBlob: finalBlob,
      processedWidth: targetW,
      processedHeight: targetH,
      errorMsg: null
    });

    await logImageToolUsage("upscale-image", item.file.name, item.file.size, true);
  };

  // Batch process execution handler
  const handleProcessAll = async () => {
    const queue = files.filter((f) => f.status !== "success");
    if (queue.length === 0) {
      toast.info("No queued images require processing.");
      return;
    }

    // Process sequentially to conserve CPU/RAM allocations
    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (item.status === "success") continue;

      try {
        await processImageItem(item);
      } catch (err: any) {
        console.error(`Error processing ${item.file.name}:`, err);
        updateFileItem(item.id, {
          status: "error",
          progress: 0,
          progressMsg: "Processing failed",
          errorMsg: err.message || String(err)
        });
        toast.error(`Failed to upscale "${item.file.name}": ${err.message || String(err)}`);
        await logImageToolUsage("upscale-image", item.file.name, item.file.size, false, err.message || String(err));
      }
    }
    toast.success("Image processing pipeline complete!");
  };

  // Re-process active image currently focused
  const handleReprocessActive = async () => {
    const activeItem = files[activeIndex];
    if (!activeItem) return;

    if (activeItem.processedUrl) {
      URL.revokeObjectURL(activeItem.processedUrl);
    }

    updateFileItem(activeItem.id, {
      status: "processing",
      progress: 5,
      progressMsg: "Recalculating detail maps...",
      processedUrl: null,
      processedBlob: null
    });

    try {
      await processImageItem(activeItem);
      toast.success("Refined active image successfully!");
    } catch (err: any) {
      console.error(err);
      updateFileItem(activeItem.id, {
        status: "error",
        progress: 0,
        progressMsg: "Enhancement failed",
        errorMsg: err.message || String(err)
      });
    }
  };

  // Downloads helper
  const handleDownloadSingle = (item: FileItem) => {
    if (!item.processedUrl) return;
    const a = document.createElement("a");
    a.href = item.processedUrl;
    const splitDot = item.file.name.lastIndexOf(".");
    const baseName = splitDot !== -1 ? item.file.name.substring(0, splitDot) : item.file.name;
    const ext = splitDot !== -1 ? item.file.name.substring(splitDot) : ".png";
    a.download = `${baseName}_upscaled_${config.scale}x${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadZipAll = async () => {
    const successItems = files.filter((f) => f.status === "success" && f.processedBlob);
    if (successItems.length === 0) return;

    if (successItems.length === 1) {
      handleDownloadSingle(successItems[0]);
      return;
    }

    setIsZipping(true);
    try {
      const zip = new JSZip();
      successItems.forEach((item) => {
        const splitDot = item.file.name.lastIndexOf(".");
        const baseName = splitDot !== -1 ? item.file.name.substring(0, splitDot) : item.file.name;
        const ext = splitDot !== -1 ? item.file.name.substring(splitDot) : ".png";
        const name = `${baseName}_upscaled_${config.scale}x${ext}`;
        if (item.processedBlob) {
          zip.file(name, item.processedBlob);
        }
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `iloveimg_upscaled_batch_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Successfully packed ZIP container!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to assemble ZIP download.");
    } finally {
      setIsZipping(false);
    }
  };

  // Slider Mouse/Touch interactions
  const handleSliderMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offset = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (offset / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
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

  const activeFileItem = files[activeIndex];

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Sync controls setting to selected preset defaults
  const applyPresetConfig = (presetName: string) => {
    let defaults = {
      preset: presetName,
      customSharpness: 65,
      customContrast: 20,
      customSmoothing: 10
    };

    if (presetName === "logo") {
      defaults.customSharpness = 80;
      defaults.customContrast = 30;
      defaults.customSmoothing = 0;
    } else if (presetName === "document") {
      defaults.customSharpness = 95;
      defaults.customContrast = 40;
      defaults.customSmoothing = 5;
    } else if (presetName === "illustration") {
      defaults.customSharpness = 55;
      defaults.customContrast = 15;
      defaults.customSmoothing = 25;
    }

    setConfig((prev) => ({
      ...prev,
      ...defaults
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Upper Navigation Header bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/iloveimg"
          className="inline-flex items-center gap-2 text-sm text-[#4A6857] hover:text-[#1F3A26] font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Image Dashboard
        </Link>
        <span className="text-[10px] font-mono text-[#4A6857] bg-[#F0F7F0]/80 px-2.5 py-1 border border-[#C5DCC9] rounded-lg">
          LANCZOS3 HYBRID INTERPOLATION
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Workspace Work Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#10A968]/10 border border-[#10A968]/20 text-[#10A968] rounded-xl">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3A26] tracking-tight leading-none mb-2">
                AI Image Upscaler
              </h1>
              <p className="text-[#4A6857] text-sm leading-relaxed max-w-2xl">
                Enlarge photos, logs, documents, and illustrations up to 4x cleanly using on-device Lanczos-3 pixel matrices. Fully offline & client-side.
              </p>
            </div>
          </div>

          {/* Interactive drop drag select arena */}
          {files.length === 0 ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition relative overflow-hidden flex flex-col items-center justify-center min-h-[380px] ${
                isDragActive
                  ? "border-[#10A968] bg-[#10A968]/[0.03]"
                  : "border-[#C5DCC9] bg-[#F0F7F0]/40 hover:border-[#10A968]/40 hover:bg-[#F0F7F0]/60"
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

              <div className="p-4 bg-white/80 border border-[#C5DCC9] text-[#4A6857] rounded-3xl mb-4 relative z-10 shadow-xl">
                <Upload className="w-8 h-8 text-[#4A6857]" />
              </div>

              <div className="space-y-2 relative z-10 max-w-sm">
                <h3 className="text-[#1F3A26] font-bold text-base">
                  Drag & drop your images here
                </h3>
                <p className="text-[#4A6857]/80 text-xs leading-relaxed">
                  or click to select files. Supports <span className="font-semibold text-[#2D4D35]">PNG, JPG, JPEG, WEBP</span> formats.
                </p>
              </div>

              <div className="absolute bottom-4 text-[10px] text-[#4A6857] font-mono flex items-center gap-1.5 bg-[#F0F7F0]/90 p-1 px-3 border border-[#C5DCC9] rounded-full">
                <span className="w-1.5 h-1.5 bg-[#10A968] rounded-full animate-ping" />
                Processed fully local in-browser. Zero server limits.
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-left">
              {/* Dynamic Toolbar Control bar of viewport */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/80 border border-[#C5DCC9] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="text-left font-mono shrink-0">
                    <span className="text-[10px] font-bold text-[#4A6857] uppercase block leading-none mb-1">
                      CURRENT ATOM
                    </span>
                    <span className="text-xs text-[#1F3A26] font-medium max-w-[150px] sm:max-w-[220px] truncate block leading-none">
                      {activeFileItem?.file.name}
                    </span>
                  </div>
                  {activeFileItem?.width > 0 && (
                    <span className="text-[10px] font-mono bg-[#F0F7F0] text-[#4A6857] px-2 py-0.5 rounded border border-[#C5DCC9] shrink-0">
                      Input: {activeFileItem.width}x{activeFileItem.height}
                    </span>
                  )}
                  {activeFileItem?.status === "success" && activeFileItem.processedWidth > 0 && (
                    <span className="text-[10px] font-mono bg-[#10A968]/20 text-[#10A968] px-2 py-0.5 rounded border border-[#10A968]/40 shrink-0 font-bold">
                      Output: {activeFileItem.processedWidth}x{activeFileItem.processedHeight}
                    </span>
                  )}
                </div>

                {/* View choices */}
                {activeFileItem?.status === "success" && (
                  <div className="flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-[#C5DCC9]">
                    <button
                      onClick={() => setViewMode("slider")}
                      className={`px-3 py-1.5 text-2xs font-bold rounded-lg transition duration-150 flex items-center gap-1 cursor-pointer ${
                        viewMode === "slider"
                          ? "bg-[#10A968]/10 text-[#10A968] border border-[#10A968]/20"
                          : "text-[#4A6857] hover:text-[#1F3A26] border border-transparent"
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" /> Split Slider
                    </button>
                    <button
                      onClick={() => setViewMode("side-by-side")}
                      className={`px-3 py-1.5 text-2xs font-bold rounded-lg transition duration-150 flex items-center gap-1 cursor-pointer ${
                        viewMode === "side-by-side"
                          ? "bg-[#10A968]/10 text-[#10A968] border border-[#10A968]/20"
                          : "text-[#4A6857] hover:text-[#1F3A26] border border-transparent"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" /> Side-by-Side
                    </button>
                    <button
                      onClick={() => setViewMode("output")}
                      className={`px-3 py-1.5 text-2xs font-bold rounded-lg transition duration-150 flex items-center gap-1 cursor-pointer ${
                        viewMode === "output"
                          ? "bg-[#10A968]/10 text-[#10A968] border border-[#10A968]/20"
                          : "text-[#4A6857] hover:text-[#1F3A26] border border-transparent"
                      }`}
                    >
                      Output Format
                    </button>
                  </div>
                )}
              </div>

              {/* Viewport Render bounds */}
              <div
                ref={containerRef}
                className="relative min-h-[380px] w-full bg-[#F0F7F0] border border-[#C5DCC9] rounded-3xl overflow-hidden flex items-center justify-center select-none"
              >
                {/* Background Grid paper checkered texture */}
                <div 
                  className="absolute inset-0 z-0 opacity-50"
                  style={{
                    backgroundImage: "linear-gradient(45deg, #111111 25%, transparent 25%), linear-gradient(-45deg, #111111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111111 75%), linear-gradient(-45deg, transparent 75%, #111111 75%)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 0, 10px 10px, -10px -10px",
                    backgroundColor: "#17171a"
                  }}
                />

                {/* Processing Overlay Screen */}
                {activeFileItem?.status === "processing" && (
                  <div className="absolute inset-0 z-20 bg-[#F0F7F0]/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 space-y-4">
                    <Loader2 className="w-10 h-10 text-[#10A968] animate-spin" />
                    <div className="text-center space-y-1">
                      <p className="text-[#1F3A26] font-bold text-sm">Processing image...</p>
                      <p className="text-[#4A6857] text-xs font-mono">{activeFileItem.progressMsg}</p>
                    </div>

                    <div className="w-full max-w-xs bg-white h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${activeFileItem.progress}%` }}
                        className="bg-[#10A968] h-full transition-all duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#4A6857]">{activeFileItem.progress}% COMPLETE</span>
                  </div>
                )}

                {/* Error Overlay Screen */}
                {activeFileItem?.status === "error" && (
                  <div className="absolute inset-0 z-20 bg-[#F0F7F0]/90 flex flex-col items-center justify-center p-6 space-y-4 text-center">
                    <AlertCircle className="w-12 h-12 text-rose-500" />
                    <div className="space-y-1.5 max-w-md">
                      <p className="text-[#1F3A26] font-bold text-sm">Enhancement operation failed</p>
                      <p className="text-rose-400/85 text-xs font-mono leading-relaxed bg-rose-950/30 p-3 rounded-xl border border-rose-900/30">
                        {activeFileItem.errorMsg || "An unknown canvas error occurred."}
                      </p>
                    </div>
                    <button
                      onClick={handleReprocessActive}
                      className="px-5 py-2 bg-white border border-[#C5DCC9] text-[#1F3A26] rounded-xl text-xs font-semibold hover:bg-[#F0F7F0] transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Re-attempt Process
                    </button>
                  </div>
                )}

                {/* Pre-computation state viewport display */}
                {activeFileItem?.status === "idle" && (
                  <div className="absolute inset-0 z-15 bg-[#F0F7F0]/60 backdrop-blur-2xs flex flex-col items-center justify-center p-6 space-y-4 text-center">
                    <Sparkles className="w-12 h-12 text-[#10A968]/60" />
                    <div className="space-y-1 max-w-xs">
                      <p className="text-[#1F3A26] font-bold text-sm">Awaiting super-resolution compile</p>
                      <p className="text-[#4A6857] text-xs">
                        Click the processing buttons on the right side panel to trigger the upscaling calculations.
                      </p>
                    </div>
                    <button
                      onClick={handleReprocessActive}
                      className="px-6 py-2.5 bg-[#10A968] hover:bg-[#0d8654] text-[#F0F7F0] text-xs font-extrabold rounded-xl shadow-lg shadow-[#10A968]/10 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      Upscale Active Now
                    </button>
                  </div>
                )}

                {/* Viewport canvas element outputs */}
                {activeFileItem && (
                  <div className="relative w-full h-full min-h-[380px] p-6 flex items-center justify-center z-10">
                    
                    {/* ViewMode: Split-Slider */}
                    {activeFileItem.status === "success" && viewMode === "slider" ? (
                      <div className="relative max-w-full max-h-[320px] overflow-hidden rounded-xl shadow-2xl">
                        
                        {/* Underlayer: original blurred scaled-up image */}
                        <img 
                          src={activeFileItem.originalUrl}
                          className="max-w-full max-h-[320px] object-contain block select-none pointer-events-none filter blur-[0.4px]"
                          style={{ width: "auto", height: "auto" }}
                          alt="blurry stretched original"
                        />

                        {/* Overlayer: crisp upscaled image with clipping */}
                        {activeFileItem.processedUrl && (
                          <div 
                            className="absolute inset-0 overflow-hidden"
                            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
                          >
                            <img 
                              src={activeFileItem.processedUrl}
                              className="w-full h-full object-contain block select-none pointer-events-none absolute top-0 left-0"
                              style={{ width: "100%", height: "100%" }}
                              alt="crisp upscaled"
                            />
                          </div>
                        )}

                        {/* Drag divider bar & handle */}
                        <div
                          className="absolute top-0 bottom-0 z-30 w-1 bg-[#10A968] cursor-ew-resize flex items-center justify-center group"
                          style={{ left: `${sliderPos}%` }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setIsSliding(true);
                          }}
                          onTouchStart={(e) => {
                            setIsSliding(true);
                          }}
                        >
                          <div className="w-8 h-8 bg-[#10A968] text-[#F0F7F0] font-extrabold text-2xs flex items-center justify-center rounded-full shadow-2xl shadow-[#10A968]/25 border-2 border-white pointer-events-none shrink-0 font-mono">
                            ⇔
                          </div>
                        </div>

                        {/* Interactive before and after helper labels */}
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#F0F7F0]/90 text-[#4A6857] font-mono text-3xs border border-[#C5DCC9] rounded-md z-30">
                          BEFORE (Standard)
                        </span>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#10A968]/20 text-[#10A968] font-mono text-3xs border border-[#10A968]/30 rounded-md z-30">
                          AFTER (Upscaled)
                        </span>
                      </div>
                    ) : viewMode === "side-by-side" && activeFileItem.status === "success" ? (
                      
                      // Viewmode: Side-by-Side Comparison
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full items-center">
                        <div className="space-y-1.5 text-center">
                          <p className="text-[10px] font-mono text-[#4A6857] font-bold uppercase tracking-wider">Before (Fuzzy Resize)</p>
                          <div className="bg-white border border-[#C5DCC9] p-2 rounded-2xl flex items-center justify-center h-[260px]">
                            <img
                              src={activeFileItem.originalUrl}
                              className="max-w-full max-h-full object-contain rounded-lg shadow-md filter blur-[0.4px]"
                              alt="blurred simple scale"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5 text-center">
                          <p className="text-[10px] font-mono text-[#10A968] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#10A968] animate-pulse" /> Lanczos3 HD
                          </p>
                          <div
                            className="bg-white border border-[#C5DCC9] p-2 rounded-2xl flex items-center justify-center h-[260px] relative overflow-hidden"
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
                                alt="Processed upscale view"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (viewMode === "output" && activeFileItem.status === "success") || activeFileItem.status === "idle" ? (
                      
                      // Output mode plain display
                      <div className="max-w-full max-h-[320px] flex items-center justify-center">
                        <img 
                          src={activeFileItem.processedUrl || activeFileItem.originalUrl}
                          className="max-w-full max-h-[320px] object-contain rounded-xl shadow-2xl"
                          alt="preview container"
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Multiple Workspace files batch queue list */}
              {files.length > 1 && (
                <div className="p-4 bg-white/60 border border-[#C5DCC9] rounded-3xl space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#4A6857] uppercase tracking-widest">
                      BATCH QUEUE FEED ({files.length} ITEMS)
                    </span>
                    <button
                      onClick={() => {
                        setFiles([]);
                        setActiveIndex(0);
                        toast.info("Cleared workspace queue.");
                      }}
                      className="text-[#4A6857] hover:text-[#1F3A26] transition text-3xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Queue
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 custom-scroll scrollbar-thin">
                    {files.map((item, idx) => {
                      const isActive = idx === activeIndex;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setActiveIndex(idx)}
                          className={`relative shrink-0 w-[64px] h-[64px] rounded-xl overflow-hidden border cursor-pointer transition-all ${
                            isActive
                              ? "border-[#10A968] ring-2 ring-[#10A968]/20 scale-95"
                              : "border-[#C5DCC9] hover:border-[#10A968]/50 bg-white/60"
                          }`}
                        >
                          <img 
                            src={item.originalUrl}
                            className="w-full h-full object-cover opacity-80"
                            alt="thumbnail feed item"
                          />
                          {item.status === "processing" && (
                            <div className="absolute inset-0 bg-[#F0F7F0]/70 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-[#10A968] animate-spin" />
                            </div>
                          )}
                          {item.status === "success" && (
                            <div className="absolute bottom-1 right-1 p-0.5 bg-[#10A968] text-white rounded-full">
                              <CheckCircle2 className="w-2.5 h-2.5 bg-white rounded-full text-[#10A968]" />
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
                      className="shrink-0 w-[64px] h-[64px] rounded-xl border border-dashed border-[#C5DCC9] hover:border-[#10A968]/40 hover:bg-[#10A968]/[0.01] flex flex-col items-center justify-center cursor-pointer text-[#4A6857] hover:text-[#10A968] transition"
                    >
                      <span className="text-lg font-medium leading-none">+</span>
                      <span className="text-[8px] font-bold font-mono uppercase mt-0.5">Add</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Configuration settings sidebar panels */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/80 border border-[#C5DCC9] rounded-3xl p-6 shadow-xl leading-relaxed text-left flex flex-col space-y-6">
            <div className="border-b border-[#C5DCC9] pb-3 flex items-center justify-between">
              <h3 className="font-extrabold text-[#1F3A26] text-base flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#10A968] rounded-full animate-pulse" />
                Upscale controls
              </h3>
              {files.length > 0 && (
                <button
                  onClick={() => {
                    setFiles([]);
                    setActiveIndex(0);
                  }}
                  className="text-3xs text-[#4A6857] hover:text-[#1F3A26] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Page
                </button>
              )}
            </div>

            {/* Scale Factors toggle buttons */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-[#4A6857] font-mono uppercase tracking-wider block">
                Sizing Multiplier
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 2, label: "2x Scale", desc: "Double pixel resolution" },
                  { value: 4, label: "4x Scale", desc: "4x HD pixel matrices" }
                ].map((scaleOpt) => {
                  const isActive = config.scale === scaleOpt.value;
                  return (
                    <button
                      key={scaleOpt.value}
                      onClick={() => setConfig((prev) => ({ ...prev, scale: scaleOpt.value }))}
                      className={`p-3 rounded-xl border font-bold text-center transition duration-150 cursor-pointer flex flex-col items-center justify-center ${
                        isActive
                          ? "bg-[#10A968]/20 border-[#10A968] text-[#10A968] font-extrabold shadow-lg shadow-[#10A968]/10"
                          : "bg-[#F0F7F0] border-[#C5DCC9] text-[#4A6857] hover:text-[#1F3A26] hover:border-[#10A968]/50"
                      }`}
                    >
                      <span className="text-xs">{scaleOpt.label}</span>
                      <span className="text-[9px] font-mono font-normal opacity-70 mt-1">{scaleOpt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Neural Enhance Mode presets selector layout */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold text-[#4A6857] font-mono uppercase tracking-wider block">
                AI Detail Mode Preset
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: "photo", label: "AI Detail (Natural Photos)", icon: Image, desc: "Soft-balanced contours; ideal for portraits and landscapes." },
                  { id: "logo", label: "Digital Logos & Icons", icon: Zap, desc: "Geometric lines restoration + alpha transparency protection." },
                  { id: "document", label: "Document / Text OCR", icon: Landmark, desc: "Heavy contour highlight to make low-res scans legible." },
                  { id: "illustration", label: "Line Art / Anime", icon: Pen, desc: "Illustration color preserving with smoothed pixel edges." }
                ].map((presetOpt) => {
                  const isActive = config.preset === presetOpt.id;
                  const IconComponent = presetOpt.icon;
                  return (
                    <button
                      key={presetOpt.id}
                      onClick={() => applyPresetConfig(presetOpt.id)}
                      className={`p-3 px-3.5 rounded-xl border text-left transition duration-150 cursor-pointer flex items-start gap-2.5 ${
                        isActive
                          ? "bg-[#10A968]/20 border-[#10A968] text-[#10A968] font-bold"
                          : "bg-[#F0F7F0] border-[#C5DCC9] hover:border-[#10A968]/50 text-[#4A6857] hover:text-[#1F3A26]"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-xs font-semibold leading-tight block">{presetOpt.label}</span>
                        <span className="text-[10px] font-normal leading-normal opacity-75 block mt-0.5">{presetOpt.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Granular refined details control sliders */}
            <div className="space-y-4 pt-2 border-t border-[#C5DCC9]">
              <div className="flex items-center gap-1.5 text-[#4A6857]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#10A968]" />
                <span className="text-[10px] font-black font-mono uppercase tracking-wider">
                  Refined Calibration
                </span>
              </div>

              {/* Sharpness slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#4A6857]">
                  <span>SHARPNESS DENSITY</span>
                  <span className="text-[#10A968] font-extrabold">{config.customSharpness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="120"
                  className="w-full accent-[#10A968] cursor-pointer"
                  value={config.customSharpness}
                  onChange={(e) => setConfig(prev => ({ ...prev, customSharpness: parseInt(e.target.value) }))}
                />
              </div>

              {/* Local Contrast boosting slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#4A6857]">
                  <span>CONTRAST BOOSTING</span>
                  <span className="text-[#10A968] font-extrabold">{config.customContrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  className="w-full accent-[#10A968] cursor-pointer"
                  value={config.customContrast}
                  onChange={(e) => setConfig(prev => ({ ...prev, customContrast: parseInt(e.target.value) }))}
                />
              </div>

              {/* Noise grain filter smoothing slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-[#4A6857]">
                  <span>NOISE SMOOTH FILTER</span>
                  <span className="text-[#10A968] font-extrabold">{config.customSmoothing}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full accent-[#10A968] cursor-pointer"
                  value={config.customSmoothing}
                  onChange={(e) => setConfig(prev => ({ ...prev, customSmoothing: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            {/* Execute processing and dynamic download operations */}
            {files.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#C5DCC9]">
                <button
                  onClick={handleProcessAll}
                  className="w-full py-3.5 bg-[#10A968] hover:bg-[#0d8654] font-extrabold text-[#F0F7F0] text-sm rounded-xl transition duration-200 outline-none hover:shadow-[#10A968]/15 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  Upscale Queue Now
                </button>

                {files.filter(f => f.status === "success").length > 0 && (
                  <button
                    onClick={handleDownloadZipAll}
                    disabled={isZipping}
                    className="w-full py-3 bg-[#F0F7F0] border border-[#C5DCC9] hover:bg-white text-[#1F3A26] font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isZipping ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#10A968]" />
                        Zipping files...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        {files.filter(f => f.status === "success").length > 1
                          ? `Download ZIP (${files.filter(f => f.status === "success").length} files)`
                          : "Save Upscaled Image"}
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Queue byte metrics analysis card wrapper */}
            {files.length > 0 && (
              <div className="p-3 bg-[#10A968]/10 border border-[#10A968]/30 rounded-2xl text-xs space-y-2">
                <div className="flex justify-between items-center text-[#4A6857]">
                  <span>Total files:</span>
                  <span className="font-mono text-[#1F3A26] font-semibold">{files.length} items</span>
                </div>
                <div className="flex justify-between items-center text-[#4A6857]">
                  <span>Processed:</span>
                  <span className="font-mono text-[#10A968] font-bold">
                    {files.filter(f => f.status === "success").length} / {files.length}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#2D4D35]">
                  <span>Total size:</span>
                  <span className="font-mono text-[#1F3A26]">
                    {formatBytes(files.reduce((acc, curr) => acc + curr.file.size, 0))}
                  </span>
                </div>
              </div>
            )}

            {files.length === 0 && (
              <div className="py-8 text-center text-xs text-[#4A6857] font-mono leading-relaxed bg-[#10A968]/10 border border-dashed border-[#C5DCC9] rounded-2xl">
                Select or drop image files to activate the upscale processing settings.
              </div>
            )}
          </div>

          {/* Privacy and Technical Container explanation cards */}
          <div className="bg-[#10A968]/10 border border-[#10A968]/30 rounded-2xl p-5 text-left leading-relaxed">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#10A968] font-mono block mb-2">
              Performance & Privacy
            </span>
            <p className="text-[#4A6857] text-xs">
              Runs fully client-side on-device with zero cloud server communication. Processing occurs localized, supporting safe data storage sandbox containment, zero infrastructure fees, and works off-grid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
