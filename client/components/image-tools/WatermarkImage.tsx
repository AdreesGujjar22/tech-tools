"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import ToolShell from "./ToolShell";
import { Type, Image as ImageIcon, Sliders, LayoutGrid } from "lucide-react";

export default function WatermarkImage() {
  const t = useTranslations("Tools.WatermarkImage");
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg"];

  const renderConfig = (filesParam: any[], config: any, setConfig: any) => {
    // Simple preview handling without hooks - just show if files exist
    const hasFiles = filesParam && filesParam.length > 0;

    const handleTextChange = (text: string) => {
      setConfig({ ...config, type: "text", text });
    };

    const handlePositionChange = (pos: string) => {
      setConfig({ ...config, position: pos });
    };

    return (
      <div className="space-y-6">
        {/* Placement Selector */}
        <div>
          <label className="text-xs font-bold text-[#4A6857] block mb-2.5 font-mono uppercase">
            {t("positionGrid")}
          </label>
          <div className="grid grid-cols-3 gap-1 max-w-[180px]">
            {[
              { id: "top-left", title: "Top Left" },
              { id: "top-center", title: "Top" },
              { id: "top-right", title: "Top Right" },
              { id: "middle-left", title: "Left" },
              { id: "center", title: "Center" },
              { id: "middle-right", title: "Right" },
              { id: "bottom-left", title: "Bottom Left" },
              { id: "bottom-center", title: "Bottom" },
              { id: "bottom-right", title: "Bottom Right" }
            ].map((pos) => {
              const active = config.position === pos.id;
              return (
                <button
                  key={pos.id}
                  onClick={() => handlePositionChange(pos.id)}
                  className={`h-9 rounded-lg border flex items-center justify-center transition duration-150 ${
                    active
                      ? "bg-[#10A968]/20 border-[#10A968] text-[#1F3A26]"
                      : "bg-[#F0F7F0] border border-neutral-850 hover:border-neutral-750 text-[#4A6857] hover:text-[#666666]"
                  }`}
                  title={pos.title}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${active ? "bg-teal-400" : "bg-neutral-750"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Text Input values */}
        <div className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-[#4A6857] block mb-1.5 font-mono uppercase">
              {t("stampLabel")}
            </label>
            <input
              type="text"
              value={config.text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="e.g. © 2026 COPYRIGHT"
              className="w-full px-3 py-2 bg-[#F0F7F0] border border-[#C5DCC9] focus:border-[#10A968] focus:outline-none rounded-xl text-xs text-[#1F3A26] placeholder-[#4A6857] font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#4A6857] block mb-1 font-mono uppercase">
                {t("fontSize")}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={config.fontSizePercent}
                onChange={(e) => setConfig({ ...config, fontSizePercent: Math.max(1, parseInt(e.target.value) || 5) })}
                className="w-full px-3 py-1.5 bg-[#F0F7F0] border border-[#C5DCC9] focus:border-[#10A968] focus:outline-none rounded-xl text-xs font-mono text-[#1F3A26]"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#4A6857] block mb-1 font-mono uppercase">
                {t("textFillColor")}
              </label>
              <input
                type="color"
                value={config.color}
                onChange={(e) => setConfig({ ...config, color: e.target.value })}
                className="w-full h-[32px] bg-[#F0F7F0] border border-[#C5DCC9] rounded-xl cursor-pointer p-0.5"
              />
            </div>
          </div>

          {/* Opacity slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold text-[#4A6857] block font-mono uppercase">
                {t("opacity", { value: Math.round(config.opacity * 100) })}
              </label>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={config.opacity}
              onChange={(e) => setConfig({ ...config, opacity: parseFloat(e.target.value) })}
              className="w-full accent-[#10A968]"
            />
          </div>
        </div>

        {/* Live preview outline box */}
        {hasFiles && (
          <div className="p-3 bg-[#F0F7F0] rounded-xl space-y-1 text-left font-mono border border-[#C5DCC9] text-2xs">
            <span className="text-[10px] font-bold text-[#4A6857] block uppercase mb-1">
              {t("propertiesOverview")}
            </span>
            <p className="text-[#4A6857]">{t("positionType")}: <span className="text-[#1F3A26] font-semibold uppercase">{config.position}</span></p>
            <p className="text-[#666666] truncate">{t("stampText")}: <span className="text-[#10A968] font-bold">"{config.text || t("none")}"</span></p>
          </div>
        )}
      </div>
    );
  };

  const onProcessFile = async (
    file: File,
    config: any,
    index: number,
    updateProgress: (percentage: number, msg?: string) => void
  ) => {
    updateProgress(20, `Decoding canvas layout for ${file.name}...`);
    
    // Load image
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to decode target image data."));
      };
      img.src = url;
    });

    updateProgress(50, `Image loaded: ${img.width}x${img.height}. Laying watermark vectors...`);

    // Setup canvas
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error("Unable to initialize canvas memory context.");
    }

    // Draw base image
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    // Dynamic watermark text drawing
    if (config.text) {
      // Calculate font sizing dynamically relative to canvas width
      const sizeMultiplier = (config.fontSizePercent || 5) / 100;
      const calculatedFontSize = Math.max(16, Math.round(img.width * sizeMultiplier));

      ctx.font = `bold ${calculatedFontSize}px Arial, sans-serif`;
      ctx.textBaseline = "top";
      ctx.textAlign = "left";

      // Measure text spacing details
      const textMetrics = ctx.measureText(config.text);
      const textWidth = textMetrics.width;
      const textHeight = calculatedFontSize;
      const padding = calculatedFontSize * 0.75; // Adaptive margin padding

      let startX = padding;
      let startY = padding;

      // Position logic resolver (9-point coordinate bounds)
      switch (config.position) {
        case "top-left":
          ctx.textAlign = "left";
          startX = padding;
          startY = padding;
          break;
        case "top-center":
          ctx.textAlign = "center";
          startX = img.width / 2;
          startY = padding;
          break;
        case "top-right":
          ctx.textAlign = "right";
          startX = img.width - padding;
          startY = padding;
          break;
        case "middle-left":
          ctx.textAlign = "left";
          startX = padding;
          startY = (img.height - textHeight) / 2;
          break;
        case "center":
          ctx.textAlign = "center";
          startX = img.width / 2;
          startY = (img.height - textHeight) / 2;
          break;
        case "middle-right":
          ctx.textAlign = "right";
          startX = img.width - padding;
          startY = (img.height - textHeight) / 2;
          break;
        case "bottom-left":
          ctx.textAlign = "left";
          startX = padding;
          startY = img.height - textHeight - padding;
          break;
        case "bottom-center":
          ctx.textAlign = "center";
          startX = img.width / 2;
          startY = img.height - textHeight - padding;
          break;
        case "bottom-right":
          ctx.textAlign = "right";
          startX = img.width - padding;
          startY = img.height - textHeight - padding;
          break;
        default:
          break;
      }

      // Reset alpha and draw shadow behind for contrast readability
      ctx.globalAlpha = Math.min(1, (config.opacity || 0.5) * 0.7);
      ctx.fillStyle = "#000000";
      ctx.fillText(config.text, startX + 2, startY + 2);

      // Draw real face text color
      ctx.globalAlpha = Math.min(1, config.opacity || 0.5);
      ctx.fillStyle = config.color || "#ffffff";
      ctx.fillText(config.text, startX, startY);

      // Reset globalAlpha
      ctx.globalAlpha = 1.0;
    }

    updateProgress(80, `Encoding watermarked image data...`);

    // Save
    const targetMimeType = file.type || "image/jpeg";
    const finalBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to compile watermarked image."));
      }, targetMimeType, 0.95);
    });

    // Handle output name
    let outName = file.name;
    const splitDot = outName.lastIndexOf(".");
    const baseName = splitDot !== -1 ? outName.substring(0, splitDot) : outName;
    const originalExt = splitDot !== -1 ? outName.substring(splitDot).toLowerCase() : "";

    return {
      blob: finalBlob,
      fileName: `${baseName}_watermarked${originalExt}`
    };
  };

  return (
    <ToolShell
      toolId="watermark-image"
      allowedExtensions={allowedExtensions}
      allowMultiple={true}
      maxFiles={50}
      configTitle={t("panel")}
      renderConfig={renderConfig}
      defaultConfig={{
        type: "text",
        text: t("defaultStamp"),
        fontSizePercent: 5,
        color: "#ffffff",
        opacity: 0.5,
        position: "bottom-right"
      }}
      onProcessFile={onProcessFile}
    />
  );
}
