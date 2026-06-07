"use client";

import React, { useEffect, useState } from "react";
import ToolShell from "./ToolShell";

interface ResizeConfigInnerProps {
  files: any[];
  config: any;
  setConfig: any;
}

function ResizeConfigInner({ files, config, setConfig }: ResizeConfigInnerProps) {
  // Read dimensions of the first file if loaded
  const [firstFileDims, setFirstFileDims] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      const img = new Image();
      img.onload = () => {
        const w = img.width || 1;
        const h = img.height || 1;
        const ratio = w / h;
        setFirstFileDims({ w, h });
        // If width/height are 0, initialize them with original dimensions
        setConfig((prev: any) => {
          const updated = { ...prev };
          if (prev.width === 0 || !prev.width) {
            updated.width = w;
          }
          if (prev.height === 0 || !prev.height) {
            updated.height = h;
          }
          updated.aspectRatio = ratio;
          return updated;
        });
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        setFirstFileDims(null);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }, [files, setConfig]);

  const handlePresetChange = (presetId: string) => {
    let width = 1200;
    let height = 630;
    let isPreset = true;

    switch (presetId) {
      case "instagram_post":
        width = 1080;
        height = 1080;
        break;
      case "instagram_story":
        width = 1080;
        height = 1920;
        break;
      case "facebook_post":
        width = 1200;
        height = 630;
        break;
      case "facebook_cover":
        width = 820;
        height = 312;
        break;
      case "youtube_thumb":
        width = 1280;
        height = 720;
        break;
      case "youtube_banner":
        width = 2560;
        height = 1440;
        break;
      case "linkedin_post":
        width = 1200;
        height = 627;
        break;
      case "twitter_post":
        width = 1200;
        height = 675;
        break;
      case "tiktok_cover":
        width = 1080;
        height = 1920;
        break;
      default:
        isPreset = false;
        if (firstFileDims) {
          width = firstFileDims.w;
          height = firstFileDims.h;
        }
        break;
    }

    const ratio = width / height;

    setConfig((prev: any) => ({
      ...prev,
      preset: presetId,
      mode: isPreset ? "pixels" : prev.mode,
      width,
      height,
      lockAspect: !isPreset && prev.lockAspect,
      aspectRatio: ratio
    }));
  };

  const handleWidthChange = (valStr: string) => {
    const parsed = parseInt(valStr, 10);
    const val = isNaN(parsed) ? 0 : Math.max(0, parsed);

    setConfig((prev: any) => {
      let nextHeight = prev.height;
      const ratio = prev.aspectRatio || 1;
      if (prev.lockAspect && ratio && isFinite(ratio) && ratio > 0 && val > 0) {
        nextHeight = Math.max(1, Math.round(val / ratio));
      }
      return {
        ...prev,
        width: val,
        height: nextHeight,
        preset: "custom"
      };
    });
  };

  const handleHeightChange = (valStr: string) => {
    const parsed = parseInt(valStr, 10);
    const val = isNaN(parsed) ? 0 : Math.max(0, parsed);

    setConfig((prev: any) => {
      let nextWidth = prev.width;
      const ratio = prev.aspectRatio || 1;
      if (prev.lockAspect && ratio && isFinite(ratio) && ratio > 0 && val > 0) {
        nextWidth = Math.max(1, Math.round(val * ratio));
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
            className={`p-2.5 text-xs rounded-xl border font-bold font-mono transition cursor-pointer ${
              config.mode === "pixels"
                ? "bg-indigo-950/40 border-indigo-500 text-indigo-400"
                : "bg-neutral-900/60 border-neutral-850 text-neutral-400 hover:text-white"
            }`}
          >
            Interactive Pixels
          </button>
          <button
            onClick={() => setConfig({ ...config, mode: "percentage", preset: "custom" })}
            className={`p-2.5 text-xs rounded-xl border font-bold font-mono transition cursor-pointer ${
              config.mode === "percentage"
                ? "bg-indigo-950/40 border-indigo-500 text-indigo-400"
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
            className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
          >
            <option value="custom">No Preset (Original aspect ratio)</option>
            <option value="instagram_post">Instagram Post (1080 x 1080, 1:1)</option>
            <option value="instagram_story">Instagram Story (1080 x 1920, 9:16)</option>
            <option value="facebook_post">Facebook Post (1200 x 630)</option>
            <option value="facebook_cover">Facebook Cover (820 x 312)</option>
            <option value="youtube_thumb">YouTube Thumbnail (1280 x 720, 16:9)</option>
            <option value="youtube_banner">YouTube Banner (2560 x 1440, 16:9)</option>
            <option value="linkedin_post">LinkedIn Post (1200 x 627)</option>
            <option value="twitter_post">Twitter/X Post (1200 x 675)</option>
            <option value="tiktok_cover">TikTok Cover (1080 x 1920)</option>
          </select>
        </div>
      )}

      {/* Dynamic Details Inputs */}
      {config.mode === "pixels" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 block mb-1 font-mono uppercase">
                Width (px)
              </label>
              <input
                type="number"
                min="1"
                value={config.width === 0 ? "" : config.width}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                placeholder="Width"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-400 block mb-1 font-mono uppercase">
                Height (px)
              </label>
              <input
                type="number"
                min="1"
                value={config.height === 0 ? "" : config.height}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                placeholder="Height"
              />
            </div>
          </div>

          {config.preset === "custom" && (
            <label className="flex items-center gap-2 cursor-pointer font-mono text-2xs text-neutral-400 hover:text-white transition">
              <input
                type="checkbox"
                checked={config.lockAspect}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const currentRatio = firstFileDims ? firstFileDims.w / firstFileDims.h : 1;
                  setConfig((prev: any) => {
                    const updated = {
                      ...prev,
                      lockAspect: checked,
                      aspectRatio: currentRatio
                    };
                    if (checked && currentRatio) {
                      updated.height = Math.max(1, Math.round(prev.width / currentRatio));
                    }
                    return updated;
                  });
                }}
                className="accent-indigo-500 rounded border-neutral-800 cursor-pointer"
              />
              Maintain aspect ratio constraints
            </label>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-neutral-400 block font-mono uppercase">
            Target Percentage
          </label>
          <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
            {[25, 50, 75, 100, 150, 200].map((pct) => {
              const active = config.percent === pct;
              return (
                <button
                  key={pct}
                  onClick={() => setConfig({ ...config, percent: pct })}
                  className={`py-2 rounded-lg border text-center transition cursor-pointer ${
                    active
                      ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 font-bold"
                      : "bg-neutral-900/40 border-neutral-850 text-neutral-400 hover:text-white"
                  }`}
                >
                  {pct}%
                </button>
              );
            })}
          </div>

          <div className="mt-3">
            <label className="text-[10px] font-bold text-neutral-400 block mb-1 font-mono uppercase">
              Custom Percentage (%)
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={config.percent || ""}
              onChange={(e) => {
                const parsed = parseInt(e.target.value, 10);
                const val = isNaN(parsed) ? 100 : Math.min(1000, Math.max(1, parsed));
                setConfig((prev: any) => ({
                  ...prev,
                  percent: val
                }));
              }}
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
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
}

export default function ResizeImage() {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".bmp", ".tiff"];

  const renderConfig = (files: any[], config: any, setConfig: any) => {
    return <ResizeConfigInner files={files} config={config} setConfig={setConfig} />;
  };

  const onProcessFile = async (
    file: File,
    config: any,
    index: number,
    updateProgress: (percentage: number, msg?: string) => void
  ) => {
    updateProgress(20, `Decoding dimensions layout for ${file.name}...`);
    
    if (!file || !file.size) {
      throw new Error(`The file "${file?.name || 'unknown'}" appears to be empty or invalid.`);
    }

    if (file.size > 50 * 1024 * 1024) {
      throw new Error(`The file "${file.name}" exceeds the maximum supported processing size of 50MB.`);
    }

    // Load image
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    try {
      await new Promise((resolve, reject) => {
        img.onload = () => {
          if (img.width <= 0 || img.height <= 0 || isNaN(img.width) || isNaN(img.height)) {
            reject(new Error("Image metadata has non-positive or invalid layout dimensions."));
          } else {
            resolve(null);
          }
        };
        img.onerror = () => {
          reject(new Error("The image file is corrupted, unsupported, or failed to decode."));
        };
        img.src = url;
      });
    } catch (err: any) {
      URL.revokeObjectURL(url);
      throw new Error(`[${file.name}] Decode failure: ${err.message || 'Unknown image error'}`);
    }

    updateProgress(50, `Image structure loaded. Resizing geometry grid...`);

    // Determine target dimensions
    let targetWidth = img.width || 1;
    let targetHeight = img.height || 1;

    try {
      if (config.mode === "pixels") {
        const customW = parseInt(config.width, 10);
        const customH = parseInt(config.height, 10);
        targetWidth = isNaN(customW) || customW <= 0 ? img.width : customW;
        targetHeight = isNaN(customH) || customH <= 0 ? img.height : customH;
      } else {
        const percentVal = parseFloat(config.percent);
        const scale = isNaN(percentVal) || percentVal <= 0 ? 1 : percentVal / 100;
        targetWidth = Math.round(img.width * scale);
        targetHeight = Math.round(img.height * scale);
      }

      // Safe bounds handling
      if (isNaN(targetWidth) || !isFinite(targetWidth) || targetWidth <= 0) {
        targetWidth = 100;
      }
      if (isNaN(targetHeight) || !isFinite(targetHeight) || targetHeight <= 0) {
        targetHeight = 100;
      }

      // Hard limits to prevent canvas context crashes
      targetWidth = Math.min(16384, Math.max(1, targetWidth));
      targetHeight = Math.min(16384, Math.max(1, targetHeight));
    } catch (err) {
      targetWidth = img.width || 100;
      targetHeight = img.height || 100;
    }

    // Render Canvas
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error("Unable to initialize browser canvas buffer stream.");
    }

    const targetMimeType = file.type || "image/jpeg";

    try {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Paint transparent backgrounds white for JPEGs
      if (targetMimeType === "image/jpeg" || targetMimeType === "image/jpg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    } catch (err: any) {
      URL.revokeObjectURL(url);
      throw new Error(`Failed to draw image data into resizing canvas buffer: ${err.message}`);
    }
    
    URL.revokeObjectURL(url);

    updateProgress(85, `Encoding resized image stream...`);

    let finalBlob: Blob;
    try {
      finalBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Output binary blob is empty."));
        }, targetMimeType, 0.9);
      });
    } catch (err: any) {
      throw new Error(`Failed to serialize resized image back to file format: ${err.message}`);
    }

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
