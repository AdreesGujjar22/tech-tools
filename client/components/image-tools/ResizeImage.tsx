"use client";

import React, { useEffect, useState } from "react";
import ToolShell from "./ToolShell";

export default function ResizeImage() {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".bmp", ".tiff"];

  const renderConfig = (files: any[], config: any, setConfig: any) => {
    // Read dimensions of the first file if loaded
    const [firstFileDims, setFirstFileDims] = useState<{ w: number; h: number } | null>(null);

    useEffect(() => {
      if (files.length > 0) {
        const url = URL.createObjectURL(files[0]);
        const img = new Image();
        img.onload = () => {
          setFirstFileDims({ w: img.width, h: img.height });
          // If custom is selected and width/height are 0, initialize them
          if (config.mode === "pixels" && config.width === 0) {
            setConfig((prev: any) => ({
              ...prev,
              width: img.width,
              height: img.height,
              aspectRatio: img.width / img.height
            }));
          }
          URL.revokeObjectURL(url);
        };
        img.src = url;
      }
    }, [files]);

    const handlePresetChange = (presetId: string) => {
      let width = 1200;
      let height = 630;
      let isPreset = true;

      switch (presetId) {
        case "instagram_sq":
          width = 1080;
          height = 1080;
          break;
        case "instagram_story":
          width = 1080;
          height = 1920;
          break;
        case "youtube_thumb":
          width = 1280;
          height = 720;
          break;
        case "youtube_banner":
          width = 2560;
          height = 1440;
          break;
        case "facebook_cover":
          width = 820;
          height = 312;
          break;
        default:
          isPreset = false;
          if (firstFileDims) {
            width = firstFileDims.w;
            height = firstFileDims.h;
          }
          break;
      }

      setConfig((prev: any) => ({
        ...prev,
        preset: presetId,
        mode: isPreset ? "pixels" : prev.mode,
        width,
        height,
        lockAspect: !isPreset && prev.lockAspect
      }));
    };

    const handleWidthChange = (val: number) => {
      setConfig((prev: any) => {
        let nextHeight = prev.height;
        if (prev.lockAspect && prev.aspectRatio) {
          nextHeight = Math.round(val / prev.aspectRatio);
        }
        return {
          ...prev,
          width: val,
          height: nextHeight,
          preset: "custom"
        };
      });
    };

    const handleHeightChange = (val: number) => {
      setConfig((prev: any) => {
        let nextWidth = prev.width;
        if (prev.lockAspect && prev.aspectRatio) {
          nextWidth = Math.round(val * prev.aspectRatio);
        }
        return {
          ...prev,
          width: nextWidth,
          height: val,
          preset: "custom"
        };
      });
    };

    return (
      <div className="space-y-5">
        {/* Resize Option Modes */}
        <div>
          <label className="text-xs font-bold text-neutral-400 block mb-2 font-mono uppercase">
            Resize Method
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setConfig({ ...config, mode: "pixels", preset: "custom" })}
              className={`p-2.5 text-xs rounded-xl border font-bold font-mono transition ${
                config.mode === "pixels"
                  ? "bg-teal-950/40 border-teal-500 text-teal-400"
                  : "bg-neutral-900/60 border-neutral-850 text-neutral-400 hover:text-white"
              }`}
            >
              Interactive Pixels
            </button>
            <button
              onClick={() => setConfig({ ...config, mode: "percentage", preset: "custom" })}
              className={`p-2.5 text-xs rounded-xl border font-bold font-mono transition ${
                config.mode === "percentage"
                  ? "bg-teal-950/40 border-teal-500 text-teal-400"
                  : "bg-neutral-900/60 border-neutral-850 text-neutral-400 hover:text-white"
              }`}
            >
              Percentage %
            </button>
          </div>
        </div>

        {/* Social Presets */}
        {config.mode === "pixels" && (
          <div>
            <label className="text-xs font-bold text-neutral-400 block mb-2 font-mono uppercase">
              Social Canvas Presets
            </label>
            <select
              value={config.preset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500 font-medium"
            >
              <option value="custom">No Preset (Original aspect ratio)</option>
              <option value="instagram_sq">Instagram Square (1080 x 1080, 1:1)</option>
              <option value="instagram_story">Instagram Story (1080 x 1920, 9:16)</option>
              <option value="youtube_thumb">YouTube Thumbnail (1280 x 720, 16:9)</option>
              <option value="youtube_banner">YouTube Banner (2560 x 1440, 16:9)</option>
              <option value="facebook_cover">Facebook Cover (820 x 312)</option>
            </select>
          </div>
        )}

        {/* Dynamic Details Inputs */}
        {config.mode === "pixels" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-neutral-500 block mb-1 font-mono uppercase">
                  Width (px)
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.width || ""}
                  onChange={(e) => handleWidthChange(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-neutral-500 block mb-1 font-mono uppercase">
                  Height (px)
                </label>
                <input
                  type="number"
                  min="1"
                  value={config.height || ""}
                  onChange={(e) => handleHeightChange(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {config.preset === "custom" && (
              <label className="flex items-center gap-2 cursor-pointer font-mono text-2xs text-neutral-400 hover:text-white transition">
                <input
                  type="checkbox"
                  checked={config.lockAspect}
                  onChange={(e) => {
                    const currentRatio = firstFileDims ? firstFileDims.w / firstFileDims.h : 1;
                    setConfig({ 
                      ...config, 
                      lockAspect: e.target.checked,
                      aspectRatio: currentRatio 
                    });
                  }}
                  className="accent-teal-500 rounded border-neutral-800"
                />
                Maintain aspect ratio constraints
              </label>
            )}
          </div>
        ) : (
          <div>
            <label className="text-[10px] font-bold text-neutral-500 block mb-2 font-mono uppercase">
              Target Percentage
            </label>
            <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
              {[25, 50, 75, 125, 150, 200].map((pct) => {
                const active = config.percent === pct;
                return (
                  <button
                    key={pct}
                    onClick={() => setConfig({ ...config, percent: pct })}
                    className={`py-2 rounded-lg border text-center transition ${
                      active
                        ? "bg-teal-950/40 border-teal-500 text-teal-400 font-bold"
                        : "bg-neutral-900/40 border-neutral-850 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {pct}%
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {firstFileDims && (
          <div className="p-3 bg-neutral-950 rounded-xl text-left font-mono space-y-1">
            <span className="text-[10px] font-bold text-neutral-500 block uppercase">
              Reference File Resolution
            </span>
            <p className="text-2xs text-neutral-400">
              {files[0]?.name}: <span className="text-white font-bold">{firstFileDims.w} x {firstFileDims.h} px</span>
            </p>
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
    updateProgress(20, `Decoding dimensions layout for ${file.name}...`);
    
    // Load image
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to decode the selected photo coordinates."));
      };
      img.src = url;
    });

    updateProgress(50, `Image structure loaded. Resizing geometry grid...`);

    // Determine target dimensions
    let targetWidth = img.width;
    let targetHeight = img.height;

    if (config.mode === "pixels") {
      targetWidth = config.width || img.width;
      targetHeight = config.height || img.height;
    } else {
      const scale = (config.percent || 100) / 100;
      targetWidth = Math.round(img.width * scale);
      targetHeight = Math.round(img.height * scale);
    }

    // Set safety floor
    targetWidth = Math.max(1, targetWidth);
    targetHeight = Math.max(1, targetHeight);

    // Render Canvas
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error("Unable to initialize browser canvas memory.");
    }

    // Use nice smooth scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    URL.revokeObjectURL(url);

    updateProgress(85, `Encoding resized image stream...`);

    // Export with same format
    const targetMimeType = file.type || "image/jpeg";
    const finalBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to save resized canvas context."));
      }, targetMimeType, 0.9);
    });

    // Handle output name
    let outName = file.name;
    const splitDot = outName.lastIndexOf(".");
    const baseName = splitDot !== -1 ? outName.substring(0, splitDot) : outName;
    const originalExt = splitDot !== -1 ? outName.substring(splitDot) : "";

    return {
      blob: finalBlob,
      fileName: `${baseName}_resized_${targetWidth}x${targetHeight}${originalExt}`
    };
  };

  return (
    <ToolShell
      toolId="resize-image"
      allowedExtensions={allowedExtensions}
      allowMultiple={true}
      maxFiles={50}
      configTitle="Dimensions Panel"
      renderConfig={renderConfig}
      defaultConfig={{
        mode: "pixels",
        width: 0,
        height: 0,
        lockAspect: true,
        percent: 50,
        preset: "custom",
        aspectRatio: 1
      }}
      onProcessFile={onProcessFile}
    />
  );
}
