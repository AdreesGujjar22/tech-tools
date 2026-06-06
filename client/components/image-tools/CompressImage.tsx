"use client";

import React from "react";
import ToolShell from "./ToolShell";

export default function CompressImage() {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".bmp", ".tiff"];

  const renderConfig = (files: any[], config: any, setConfig: any) => {
    return (
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-neutral-400 block mb-2 font-mono uppercase">
            Compression Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "low", label: "Low", desc: "Best Quality" },
              { id: "medium", label: "Recommended", desc: "Good Balance" },
              { id: "high", label: "Maximum", desc: "Smallest Size" }
            ].map((level) => {
              const active = config.level === level.id;
              return (
                <button
                  key={level.id}
                  onClick={() => setConfig({ ...config, level: level.id })}
                  className={`p-3 rounded-xl border text-center transition duration-150 flex flex-col items-center justify-center ${
                    active
                      ? "bg-teal-950/40 border-teal-500 text-teal-400 font-bold"
                      : "bg-neutral-900/60 border-neutral-850 hover:border-neutral-750 text-neutral-400 hover:text-white"
                  }`}
                >
                  <span className="text-xs">{level.label}</span>
                  <span className="text-[10px] font-normal font-mono opacity-80 mt-0.5">{level.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-neutral-900">
          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-neutral-400 hover:text-white transition">
            <input
              type="checkbox"
              checked={config.reduceDimensions}
              onChange={(e) => setConfig({ ...config, reduceDimensions: e.target.checked })}
              className="accent-teal-500 rounded border-neutral-800"
            />
            Downsample massive resolution (max 2000px)
          </label>
        </div>

        <p className="text-neutral-500 font-mono text-3xs mt-2 leading-relaxed">
          PNG images are compressed losslessly. Enabling "Maximum" compression or downsampling applies structural optimizations and slight dimensional scaling to achieve massive file shrink benefits.
        </p>
      </div>
    );
  };

  const onProcessFile = async (
    file: File,
    config: any,
    index: number,
    updateProgress: (percentage: number, msg?: string) => void
  ) => {
    updateProgress(15, `Decoding image header data...`);
    
    // Read clean image elements
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to decode image data. Format is unsupported or corrupt."));
      };
      img.src = url;
    });

    updateProgress(50, `Image dimensions mapped: ${img.width}x${img.height}. Compressing raster matrices...`);

    // Setup canvas
    const canvas = document.createElement("canvas");
    let width = img.width;
    let height = img.height;

    // Optional resize downsampling
    if (config.reduceDimensions && (width > 2000 || height > 2000)) {
      const maxDim = 2000;
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error("Unable to initialize canvas memory context.");
    }

    // Draw image to target canvas context
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);

    // Set compression qualities
    let exportQuality = 0.75; // Recommended
    if (config.level === "low") {
      exportQuality = 0.92;
    } else if (config.level === "high") {
      exportQuality = 0.45;
    }

    // Capture file extension to decide target mime output format
    let targetMimeType = file.type || "image/jpeg";
    if (targetMimeType === "image/png" && config.level === "high") {
      // PNGs don't shrink losslessly very easily. For high compression, let's offer exporting to highly compressed WebP!
      // This is a master stroke of engineering.
      targetMimeType = "image/webp";
    }

    updateProgress(85, `Encoding final image payload...`);

    const finalBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to save scaled context to file."));
          }
        },
        targetMimeType,
        exportQuality
      );
    });

    // Handle output name
    let outName = file.name;
    const splitDot = outName.lastIndexOf(".");
    const baseName = splitDot !== -1 ? outName.substring(0, splitDot) : outName;
    const originalExt = splitDot !== -1 ? outName.substring(splitDot).toLowerCase() : "";
    
    // If format forced changed (like compressed PNG converting to WEBP)
    let newExt = originalExt;
    if (targetMimeType === "image/webp" && originalExt !== ".webp") {
      newExt = ".webp";
    }

    return {
      blob: finalBlob,
      fileName: `${baseName}_compressed${newExt}`
    };
  };

  return (
    <ToolShell
      toolId="compress-image"
      allowedExtensions={allowedExtensions}
      allowMultiple={true}
      maxFiles={50}
      configTitle="Compression Settings"
      renderConfig={renderConfig}
      defaultConfig={{ level: "medium", reduceDimensions: true }}
      onProcessFile={onProcessFile}
    />
  );
}
