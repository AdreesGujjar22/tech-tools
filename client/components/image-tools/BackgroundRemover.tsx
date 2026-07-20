"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Download, Trash2, Loader2, Check, AlertCircle, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ProcessedImage {
  id: string;
  original: File;
  originalUrl: string;
  processedUrl: string | null;
  processedBlob: Blob | null;
  status: "idle" | "processing" | "success" | "error";
  progress: number;
  error: string | null;
}

export default function BackgroundRemover() {
  const t = useTranslations("Tools.BackgroundRemover");
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not an image file`);
        return;
      }

      const originalUrl = URL.createObjectURL(file);
      setImages(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        original: file,
        originalUrl,
        processedUrl: null,
        processedBlob: null,
        status: "idle",
        progress: 0,
        error: null
      }]);
    });
  };

  // Drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  // Remove background using AI model
  const removeBackgroundWithAI = async (file: File, onProgress?: (progress: number) => void) => {
    try {
      const bgModule = await import("@imgly/background-removal");
      const removeBackground = (bgModule as any).default || (bgModule as any).removeBackground || bgModule;

      if (typeof removeBackground !== "function") {
        throw new Error("Background removal function not found");
      }

      onProgress?.(20);

      // Try multiple CDN paths
      const cdnPaths = [
        "https://unpkg.com/@imgly/background-removal@1.7.0/dist/",
        "https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/dist/",
        "https://cdn.jsdelivr.net/npm/@imgly/background-removal/dist/"
      ];

      let resultBlob = null;
      let lastError = null;

      for (const publicPath of cdnPaths) {
        try {
          resultBlob = await (removeBackground as Function)(file, {
            publicPath,
            progress: (key: string, current: number, total: number) => {
              const percent = Math.round((current / total) * 80) + 20;
              onProgress?.(Math.min(percent, 95));
            }
          });
          onProgress?.(100);
          return resultBlob;
        } catch (err) {
          lastError = err;
          console.warn(`CDN path ${publicPath} failed, trying next...`, err);
        }
      }

      // If all CDN paths failed, throw error to trigger fallback
      throw lastError || new Error("All CDN paths failed for AI model");
    } catch (error) {
      console.warn("AI removal unavailable, using color detection instead:", error);
      // Fallback to chroma key - this is reliable and works offline
      return await removeBackgroundWithChroma(file, onProgress);
    }
  };

  // Remove background using flood fill from edges
  const removeBackgroundWithChroma = async (file: File, onProgress?: (progress: number) => void) => {
    return new Promise<Blob>((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const img = new Image();
            img.onload = () => {
              try {
                onProgress?.(30);
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (!ctx) throw new Error("Canvas context failed");

                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const data = imageData.data;

                onProgress?.(50);

                // Create visited map for flood fill
                const width = img.width;
                const height = img.height;
                const visited = new Uint8Array(width * height);

                // Helper to get color at position
                const getColor = (x: number, y: number) => {
                  if (x < 0 || x >= width || y < 0 || y >= height) return null;
                  const idx = (y * width + x) * 4;
                  return {
                    r: data[idx],
                    g: data[idx + 1],
                    b: data[idx + 2],
                    a: data[idx + 3]
                  };
                };

                // Calculate color similarity (Euclidean distance in RGB)
                const colorDistance = (c1: any, c2: any) => {
                  if (!c1 || !c2) return Infinity;
                  return Math.sqrt(
                    Math.pow(c1.r - c2.r, 2) +
                    Math.pow(c1.g - c2.g, 2) +
                    Math.pow(c1.b - c2.b, 2)
                  );
                };

                // Flood fill from all edges to find background
                const tolerance = 25;
                const backgroundPixels = new Set<number>();

                // Flood fill function
                const floodFill = (startX: number, startY: number) => {
                  const queue: [number, number][] = [[startX, startY]];
                  const startColor = getColor(startX, startY);

                  while (queue.length > 0) {
                    const [x, y] = queue.shift()!;
                    const idx = y * width + x;

                    if (visited[idx] || x < 0 || x >= width || y < 0 || y >= height) continue;

                    const color = getColor(x, y);
                    if (!color || colorDistance(color, startColor) > tolerance) continue;

                    visited[idx] = 1;
                    backgroundPixels.add(idx);

                    // Check 4-connected neighbors
                    queue.push([x + 1, y]);
                    queue.push([x - 1, y]);
                    queue.push([x, y + 1]);
                    queue.push([x, y - 1]);
                  }
                };

                // Start flood fill from all edges
                // Top edge
                for (let x = 0; x < width; x++) {
                  if (!visited[0 * width + x]) floodFill(x, 0);
                }
                onProgress?.(55);

                // Bottom edge
                for (let x = 0; x < width; x++) {
                  if (!visited[(height - 1) * width + x]) floodFill(x, height - 1);
                }
                onProgress?.(60);

                // Left edge
                for (let y = 0; y < height; y++) {
                  if (!visited[y * width + 0]) floodFill(0, y);
                }
                onProgress?.(65);

                // Right edge
                for (let y = 0; y < height; y++) {
                  if (!visited[y * width + (width - 1)]) floodFill(width - 1, y);
                }
                onProgress?.(70);

                // Apply transparency to background pixels
                backgroundPixels.forEach(idx => {
                  const dataIdx = idx * 4;
                  data[dataIdx + 3] = 0; // Set alpha to 0
                });

                onProgress?.(80);
                ctx.putImageData(imageData, 0, 0);
                canvas.toBlob((blob) => {
                  if (blob) {
                    onProgress?.(100);
                    resolve(blob);
                  } else {
                    reject(new Error("Canvas blob conversion failed"));
                  }
                }, "image/png");
              } catch (error) {
                console.error("Error in image processing:", error);
                reject(error);
              }
            };
            img.onerror = () => {
              console.error("Failed to load image");
              reject(new Error("Image load failed"));
            };
            img.src = e.target?.result as string;
          } catch (error) {
            console.error("Error setting image source:", error);
            reject(error);
          }
        };
        reader.onerror = () => {
          console.error("Failed to read file");
          reject(new Error("File read failed"));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error initializing reader:", error);
        reject(error);
      }
    });
  };

  // Process image
  const processImage = async (index: number) => {
    const image = images[index];
    if (!image) return;

    setImages(prev => prev.map((img, i) =>
      i === index ? { ...img, status: "processing" as const, progress: 0, error: null } : img
    ));

    try {
      console.log(`Processing image: ${image.original.name}`);
      const resultBlob = await removeBackgroundWithAI(image.original, (progress) => {
        setImages(prev => prev.map((img, i) =>
          i === index ? { ...img, progress } : img
        ));
      });

      if (!resultBlob) {
        throw new Error("No result blob returned from background removal");
      }

      const processedUrl = URL.createObjectURL(resultBlob);
      setImages(prev => prev.map((img, i) =>
        i === index ? {
          ...img,
          status: "success" as const,
          progress: 100,
          processedUrl,
          processedBlob: resultBlob,
          error: null
        } : img
      ));
      toast.success(`Background removed from ${image.original.name}`);
      console.log(`Successfully processed: ${image.original.name}`);
    } catch (error: any) {
      console.error(`Error processing image ${image.original.name}:`, error);
      setImages(prev => prev.map((img, i) =>
        i === index ? {
          ...img,
          status: "error" as const,
          error: error.message || "Failed to process image"
        } : img
      ));
      toast.error(`Failed to process ${image.original.name}`);
    }
  };

  // Process all
  const processAll = async () => {
    setIsProcessing(true);
    for (let i = 0; i < images.length; i++) {
      if (images[i].status !== "success") {
        await processImage(i);
      }
    }
    setIsProcessing(false);
  };

  // Download image
  const downloadImage = (index: number) => {
    const image = images[index];
    if (!image.processedBlob) return;

    const url = URL.createObjectURL(image.processedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${image.original.name.split(".")[0]}-nobg.png`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  // Delete image
  const deleteImage = (index: number) => {
    const image = images[index];
    URL.revokeObjectURL(image.originalUrl);
    if (image.processedUrl) URL.revokeObjectURL(image.processedUrl);
    
    setImages(prev => prev.filter((_, i) => i !== index));
    if (activeIndex >= images.length - 1 && images.length > 1) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const activeImage = images[activeIndex];

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wand2 className="w-8 h-8 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold">{t("title")}</h1>
          </div>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        {images.length === 0 ? (
          // Upload Area
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-secondary/20"
            }`}
          >
            <Upload className="w-16 h-16 mx-auto mb-4 text-primary opacity-75" />
            <h2 className="text-2xl font-bold mb-2">{t("dropImage")}</h2>
            <p className="text-muted-foreground mb-6">{t("orBrowse")}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-lg transition"
            >
              {t("chooseImage")}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Editor */}
            {activeImage && (
              <div className="lg:col-span-2">
                <div className="bg-card border-2 border-border rounded-2xl overflow-hidden shadow-sm">
                  {/* Image Preview */}
                  <div className="aspect-square sm:aspect-video bg-secondary relative overflow-hidden">
                    {activeImage.status === "processing" && (
                      <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-sm font-semibold">{activeImage.progress}%</p>
                      </div>
                    )}
                    {activeImage.processedUrl && (
                      <img src={activeImage.processedUrl} alt="Result" className="w-full h-full object-contain" />
                    )}
                    {!activeImage.processedUrl && activeImage.status !== "processing" && (
                      <img src={activeImage.originalUrl} alt="Original" className="w-full h-full object-contain" />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-6 border-t border-border flex gap-3 flex-wrap">
                    {activeImage.status === "success" && (
                      <>
                        <button
                          onClick={() => downloadImage(activeIndex)}
                          className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                        >
                          <Download className="w-5 h-5" />
                          {t("download")}
                        </button>
                        <button
                          onClick={() => processImage(activeIndex)}
                          className="flex-1 px-4 py-3 rounded-lg border-2 border-border text-foreground font-semibold hover:bg-secondary transition"
                        >
                          {t("reprocess")}
                        </button>
                      </>
                    )}
                    {activeImage.status === "idle" && (
                      <button
                        onClick={() => processImage(activeIndex)}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t("processing")}
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-5 h-5" />
                            {t("removeBackground")}
                          </>
                        )}
                      </button>
                    )}
                    {activeImage.status === "error" && (
                      <button
                        onClick={() => processImage(activeIndex)}
                        className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                      >
                        <AlertCircle className="w-5 h-5" />
                        {t("retry")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Sidebar - Image List */}
            <div className="lg:col-span-1">
              <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h3 className="font-bold text-lg mb-3">{t("images", { count: images.length })}</h3>
                  {images.some(img => img.status === "idle") && (
                    <button
                      onClick={processAll}
                      disabled={isProcessing}
                      className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg transition disabled:opacity-50 text-sm"
                    >
                      {t("processAll")}
                    </button>
                  )}
                </div>

                {/* Image thumbnails */}
                <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      onClick={() => setActiveIndex(idx)}
                      className={`p-3 cursor-pointer transition ${
                        activeIndex === idx ? "bg-primary/10 border-l-4 border-primary" : "hover:bg-secondary"
                      }`}
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-12 rounded bg-secondary flex-shrink-0 overflow-hidden">
                          <img src={img.originalUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{img.original.name}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {img.status === "processing" && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                            {img.status === "success" && <Check className="w-3 h-3 text-primary" />}
                            {img.status === "error" && <AlertCircle className="w-3 h-3 text-destructive" />}
                            <span className="text-xs text-muted-foreground capitalize">{img.status}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteImage(idx);
                          }}
                          className="p-1 hover:bg-destructive/20 rounded transition text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add more button */}
                <div className="p-4 border-t border-border">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 rounded-lg border-2 border-dashed border-border text-foreground font-semibold hover:border-primary hover:bg-primary/5 transition text-sm"
                  >
                    + Add More
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
