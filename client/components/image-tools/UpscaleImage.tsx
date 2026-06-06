"use client";

import React from "react";
import ToolShell from "./ToolShell";
import { Sparkles } from "lucide-react";

export default function UpscaleImage() {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];

  const renderConfig = (files: any[], config: any, setConfig: any) => {
    return (
      <div className="space-y-5">
        <div>
          <label className="text-xs font-bold text-neutral-400 block mb-2 font-mono uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> Sizing Scale multiplier
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 2, label: "2x Upscale", desc: "Double pixel resolution" },
              { id: 4, label: "4x Upscale", desc: "Quadruple pixel grid" }
            ].map((scale) => {
              const active = config.scale === scale.id;
              return (
                <button
                  key={scale.id}
                  onClick={() => setConfig({ ...config, scale: scale.id })}
                  className={`p-3 rounded-xl border text-center transition duration-150 flex flex-col items-center justify-center ${
                    active
                      ? "bg-teal-950/40 border-teal-500 text-teal-400 font-bold"
                      : "bg-neutral-900 border border-neutral-850 hover:border-neutral-750 text-neutral-400 hover:text-white"
                  }`}
                >
                  <span className="text-xs">{scale.label}</span>
                  <span className="text-[10px] font-mono font-normal opacity-80 mt-1">{scale.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-neutral-500 block mb-2 font-mono uppercase">
            Sharpening Filter Density
          </label>
          <div className="grid grid-cols-3 gap-1.5 font-mono text-2xs">
            {[
              { id: "none", label: "No filter" },
              { id: "soft", label: "Soft focus" },
              { id: "deep", label: "Deep crisp" }
            ].map((sh) => {
              const active = config.sharpen === sh.id;
              return (
                <button
                  key={sh.id}
                  onClick={() => setConfig({ ...config, sharpen: sh.id })}
                  className={`py-2 rounded-lg border text-center transition duration-150 ${
                    active
                      ? "bg-teal-950/40 border-teal-500 text-teal-400 font-bold"
                      : "bg-neutral-900 border border-neutral-850 text-neutral-400 hover:text-white"
                  }`}
                >
                  {sh.label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-neutral-500 font-mono text-3xs leading-relaxed">
          High-performance interpolation blends pixel grids cleanly up to 4x. Edge convolution weights apply sharp high-pass masks to reduce blurred artifacts.
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
    updateProgress(20, `Decoding layout bounds for ${file.name}...`);
    
    // Load image
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to decode target image matrix."));
      };
      img.src = url;
    });

    const scale = config.scale || 2;
    const targetW = img.width * scale;
    const targetH = img.height * scale;

    updateProgress(45, `Mapping upscaled interpolation coords: ${targetW}x${targetH} px...`);

    // Render Canvas
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error("Unable to obtain canvas coordinate context.");
    }

    // High quality bicubic resampling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw upscale
    ctx.drawImage(img, 0, 0, targetW, targetH);
    URL.revokeObjectURL(url);

    // Apply sharpening convolution mask filter
    if (config.sharpen && config.sharpen !== "none") {
      updateProgress(65, `Applying high-pass convolution edge kernels...`);

      const imgData = ctx.getImageData(0, 0, targetW, targetH);
      const data = imgData.data;
      const w = imgData.width;
      const h = imgData.height;

      // Unsharp mask convolution matrix
      // Soft filter: standard laplacian with lower weighting
      // Deep filter: high-contrast unsharp kernel
      let kernel: number[];
      if (config.sharpen === "deep") {
        kernel = [
           0, -1,  0,
          -1,  5, -1,
           0, -1,  0
        ];
      } else {
        kernel = [
           0, -0.5,  0,
          -0.5,  3,  -0.5,
           0, -0.5,  0
        ];
      }

      const side = Math.round(Math.sqrt(kernel.length));
      const halfSide = Math.floor(side / 2);

      // Create output pixel buffer
      const buffer = new Uint8ClampedArray(data.length);

      // Convolution loop over all RGB channels
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const dstIdx = (y * w + x) * 4;
          
          let rSum = 0;
          let gSum = 0;
          let bSum = 0;

          for (let cy = 0; cy < side; cy++) {
            for (let cx = 0; cx < side; cx++) {
              const scy = Math.min(h - 1, Math.max(0, y + cy - halfSide));
              const scx = Math.min(w - 1, Math.max(0, x + cx - halfSide));
              const srcIdx = (scy * w + scx) * 4;
              const weight = kernel[cy * side + cx];

              rSum += data[srcIdx] * weight;
              gSum += data[srcIdx + 1] * weight;
              bSum += data[srcIdx + 2] * weight;
            }
          }

          buffer[dstIdx] = Math.min(255, Math.max(0, rSum));
          buffer[dstIdx + 1] = Math.min(255, Math.max(0, gSum));
          buffer[dstIdx + 2] = Math.min(255, Math.max(0, bSum));
          buffer[dstIdx + 3] = data[dstIdx + 3]; // Preserve alpha canal
        }
      }

      // Copy buffer back
      imgData.data.set(buffer);
      ctx.putImageData(imgData, 0, 0);
    }

    updateProgress(85, `Encoding high-res optimized output...`);

    // Export with same format
    const targetMimeType = file.type || "image/jpeg";
    const finalBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to save upscaled canvas context."));
      }, targetMimeType, 0.95);
    });

    // Handle output name
    let outName = file.name;
    const splitDot = outName.lastIndexOf(".");
    const baseName = splitDot !== -1 ? outName.substring(0, splitDot) : outName;
    const originalExt = splitDot !== -1 ? outName.substring(splitDot).toLowerCase() : "";

    return {
      blob: finalBlob,
      fileName: `${baseName}_upscaled_${scale}x${originalExt}`
    };
  };

  return (
    <ToolShell
      toolId="upscale-image"
      allowedExtensions={allowedExtensions}
      allowMultiple={true}
      maxFiles={30}
      configTitle="Upscale Parameters"
      renderConfig={renderConfig}
      defaultConfig={{
        scale: 2,
        sharpen: "soft"
      }}
      onProcessFile={onProcessFile}
    />
  );
}
