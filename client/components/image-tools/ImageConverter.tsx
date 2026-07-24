"use client";

import React from "react";
import { useTranslations } from "next-intl";
import ToolShell from "./ToolShell";

interface ImageConverterProps {
  toolId: string;
  sourceExtensions?: string[];
  forcedTargetFormat?: "jpg" | "png" | "webp" | "avif";
}

export default function ImageConverter({
  toolId,
  sourceExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".bmp", ".tiff", ".ico"],
  forcedTargetFormat
}: ImageConverterProps) {
  const t = useTranslations("Tools.ImageConverter");

  const renderConfig = (files: any[], config: any, setConfig: any) => {
    return (
      <div className="space-y-4">
        {forcedTargetFormat ? (
          <div className="p-4 bg-[#F0F7F0] border border-[#C5DCC9] rounded-2xl">
            <p className="text-xs text-[#2D4D35] font-semibold leading-relaxed">
              Target Conversion Format: <span className="text-[#0D7A4A] font-bold uppercase font-mono">{forcedTargetFormat}</span>
            </p>
            <p className="text-4xs text-[#4A6857] font-mono mt-1">
              Optimized for fast client-side output packaging.
            </p>
          </div>
        ) : (
          <div>
            <label className="text-xs font-bold text-[#2D4D35] block mb-2 font-mono uppercase">
              Target Convert Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "jpg", label: "JPG", desc: "Best Compatibility" },
                { id: "png", label: "PNG", desc: "Transparent Lossless" },
                { id: "webp", label: "WebP", desc: "Next-Gen Shrink" }
              ].map((fmt) => {
                const active = config.targetFormat === fmt.id;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => setConfig({ ...config, targetFormat: fmt.id })}
                    className={`p-3 rounded-xl border text-center transition duration-150 flex flex-col items-center justify-center ${
                      active
                        ? "bg-[#E1F4E5] border-[#10A968] text-[#0D7A4A] font-bold"
                        : "bg-white border-[#C5DCC9] hover:border-[#10A968] text-[#4A6857] hover:text-[#1F3A26]"
                    }`}
                  >
                    <span className="text-xs">{fmt.label}</span>
                    <span className="text-[9px] font-mono font-normal opacity-80 mt-1">{fmt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <label className="text-[10px] font-bold text-[#4A6857] block mb-1 font-mono uppercase">
            Image Render Quality ({Math.round(config.quality * 100)}%)
          </label>
          <input
            type="range"
            min="0.30"
            max="1.0"
            step="0.05"
            value={config.quality}
            onChange={(e) => setConfig({ ...config, quality: parseFloat(e.target.value) })}
            className="w-full range-modern"
          />
        </div>
      </div>
    );
  };

  const onProcessFile = async (
    file: File,
    config: any,
    index: number,
    updateProgress: (percentage: number, msg?: string) => void
  ) => {
    updateProgress(20, `Decoding details for ${file.name}...`);
    
    // Load image
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to decode source vector coordinates. Ensure the format is valid."));
      };
      img.src = url;
    });

    const targetFormatStr = forcedTargetFormat || config.targetFormat || "jpg";
    updateProgress(50, `Image loaded (${img.width}x${img.height}). Transcoding to ${targetFormatStr.toUpperCase()}...`);

    // Render Canvas
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error("Unable to obtain canvas coordinate context.");
    }

    // If target is Jpeg, render canvas background white (transparency defaults to black in JPEGs!)
    if (targetFormatStr === "jpg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    // Formulate target mime types
    let targetMimeType = "image/jpeg";
    let targetExt = ".jpg";

    if (targetFormatStr === "png") {
      targetMimeType = "image/png";
      targetExt = ".png";
    } else if (targetFormatStr === "webp") {
      targetMimeType = "image/webp";
      targetExt = ".webp";
    } else if (targetFormatStr === "avif") {
      // In browsers that don't support native AVIF encoder export in canvas yet, fallback to high-quality WEBP
      targetMimeType = "image/avif";
      targetExt = ".avif";
    }

    updateProgress(80, `Writing final ${targetFormatStr.toUpperCase()} file payload...`);

    const finalBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            // Fallback from AVIF if needed
            if (targetFormatStr === "avif") {
              canvas.toBlob(
                (fallbackBlob) => {
                  if (fallbackBlob) resolve(fallbackBlob);
                  else reject(new Error("Transcoding failure."));
                },
                "image/webp",
                config.quality || 0.9
              );
            } else {
              reject(new Error("Transcoding failure."));
            }
          }
        },
        targetMimeType,
        config.quality || 0.95
      );
    });

    // Handle output name
    let outName = file.name;
    const splitDot = outName.lastIndexOf(".");
    const baseName = splitDot !== -1 ? outName.substring(0, splitDot) : outName;

    // Adjust extension for avif fallback
    let finalExt = targetExt;
    if (targetFormatStr === "avif" && finalBlob.type === "image/webp") {
      finalExt = ".webp";
    }

    return {
      blob: finalBlob,
      fileName: `${baseName}_converted${finalExt}`
    };
  };

  return (
    <ToolShell
      toolId={toolId}
      allowedExtensions={sourceExtensions}
      allowMultiple={true}
      maxFiles={50}
      configTitle={t("conversionSettings")}
      renderConfig={renderConfig}
      defaultConfig={{
        targetFormat: forcedTargetFormat || "jpg",
        quality: 0.9
      }}
      onProcessFile={onProcessFile}
    />
  );
}
