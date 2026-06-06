"use client";

import React, { useState, useEffect } from "react";
import ToolShell from "./ToolShell";
import { Type, Image as ImageIcon, Sliders, LayoutGrid } from "lucide-react";

export default function WatermarkImage() {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg"];

  const renderConfig = (files: any[], config: any, setConfig: any) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
      if (files.length > 0) {
        const url = URL.createObjectURL(files[0]);
        setPreviewUrl(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      }
    }, [files]);

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
          <label className="text-xs font-bold text-neutral-400 block mb-2.5 font-mono uppercase">
            Watermark Position Grid
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
                      ? "bg-teal-950/40 border-teal-500 text-teal-400"
                      : "bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-neutral-500 hover:text-neutral-300"
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
            <label className="text-xs font-bold text-neutral-400 block mb-1.5 font-mono uppercase">
              Branding Stamp Label
            </label>
            <input
              type="text"
              value={config.text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="e.g. © 2026 COPYRIGHT"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none rounded-xl text-xs text-white placeholder-neutral-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-neutral-500 block mb-1 font-mono uppercase">
                Font Size (% of Canvas)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={config.fontSizePercent}
                onChange={(e) => setConfig({ ...config, fontSizePercent: Math.max(1, parseInt(e.target.value) || 5) })}
                className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 focus:border-teal-500 focus:outline-none rounded-xl text-xs font-mono text-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 block mb-1 font-mono uppercase">
                Text Fill Color
              </label>
              <input
                type="color"
                value={config.color}
                onChange={(e) => setConfig({ ...config, color: e.target.value })}
                className="w-full h-[32px] bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer p-0.5"
              />
            </div>
          </div>

          {/* Opacity slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold text-neutral-500 block font-mono uppercase">
                Watermark Opacity ({Math.round(config.opacity * 100)}%)
              </label>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={config.opacity}
              onChange={(e) => setConfig({ ...config, opacity: parseFloat(e.target.value) })}
              className="w-full accent-teal-500"
            />
          </div>
        </div>

        {/* Live preview outline box */}
        {previewUrl && (
          <div className="p-3 bg-neutral-950 rounded-xl space-y-1 text-left font-mono border border-neutral-900 text-2xs">
            <span className="text-[10px] font-bold text-neutral-500 block uppercase mb-1">
              Properties Overview
            </span>
            <p className="text-neutral-400">Position Type: <span className="text-white font-semibold uppercase">{config.position}</span></p>
            <p className="text-neutral-300 truncate">Stamp Text: <span className="text-teal-400 font-bold">"{config.text || "None"}"</span></p>
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
      
      ctx.font = `bold ${calculatedFontSize}px Inter, system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = config.color || "#ffffff";
      ctx.globalAlpha = config.opacity || 0.5;
      
      // Measure text spacing details
      const textMetrics = ctx.measureText(config.text);
      const textWidth = textMetrics.width;
      const textHeight = calculatedFontSize; // Estimation
      const padding = calculatedFontSize * 0.75; // Adaptive margin padding

      let startX = padding;
      let startY = textHeight + padding;

      // Position logic resolver (9-point coordinate bounds)
      switch (config.position) {
        case "top-left":
          startX = padding;
          startY = textHeight + padding;
          break;
        case "top-center":
          startX = (img.width - textWidth) / 2;
          startY = textHeight + padding;
          break;
        case "top-right":
          startX = img.width - textWidth - padding;
          startY = textHeight + padding;
          break;
        case "middle-left":
          startX = padding;
          startY = (img.height + textHeight) / 2;
          break;
        case "center":
          startX = (img.width - textWidth) / 2;
          startY = (img.height + textHeight) / 2;
          break;
        case "middle-right":
          startX = img.width - textWidth - padding;
          startY = (img.height + textHeight) / 2;
          break;
        case "bottom-left":
          startX = padding;
          startY = img.height - padding;
          break;
        case "bottom-center":
          startX = (img.width - textWidth) / 2;
          startY = img.height - padding;
          break;
        case "bottom-right":
          startX = img.width - textWidth - padding;
          startY = img.height - padding;
          break;
        default:
          break;
      }

      // Draw shadow behind for contrast readability
      ctx.fillStyle = "#000000";
      ctx.globalAlpha = (config.opacity || 0.5) * 0.6;
      ctx.fillText(config.text, startX + 2, startY + 2);

      // Draw real face text color
      ctx.fillStyle = config.color || "#ffffff";
      ctx.globalAlpha = config.opacity || 0.5;
      ctx.fillText(config.text, startX, startY);
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
      configTitle="Watermark Panel"
      renderConfig={renderConfig}
      defaultConfig={{
        type: "text",
        text: "© BRAND STAMP",
        fontSizePercent: 5,
        color: "#ffffff",
        opacity: 0.5,
        position: "bottom-right"
      }}
      onProcessFile={onProcessFile}
    />
  );
}
