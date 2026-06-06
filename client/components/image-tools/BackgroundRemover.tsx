"use client";

import React, { useState, useEffect } from "react";
import ToolShell from "./ToolShell";
import { Sparkles, Sliders, Pipette } from "lucide-react";

export default function BackgroundRemover() {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];

  const renderConfig = (files: any[], config: any, setConfig: any) => {
    const [sampledColor, setSampledColor] = useState<{ r: number; g: number; b: number }>({ r: 255, g: 255, b: 255 });

    useEffect(() => {
      if (files.length > 0) {
        // Auto sample background key from corner of first image
        const url = URL.createObjectURL(files[0]);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 10;
          canvas.height = 10;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, 10, 10);
            // Read top-left pixel
            const p = ctx.getImageData(0, 0, 1, 1).data;
            const r = p[0];
            const g = p[1];
            const b = p[2];
            setSampledColor({ r, g, b });
            setConfig((prev: any) => ({
              ...prev,
              keyR: r,
              keyG: g,
              keyB: b
            }));
          }
          URL.revokeObjectURL(url);
        };
        img.src = url;
      }
    }, [files]);

    return (
      <div className="space-y-6">
        <div>
          <label className="text-xs font-bold text-neutral-400 block mb-2 font-mono uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> Edge Extraction Algorithm
          </label>
          <p className="text-neutral-400 text-xs leading-relaxed mb-4">
            Our smart chromakeying pipeline automatically samples the dominant backdrop color (configured below) and wipes it from the grid matrix.
          </p>
        </div>

        {/* Backdrop color visualizer */}
        <div className="p-4 bg-neutral-900/60 border border-neutral-850 rounded-2xl space-y-3">
          <span className="text-[10px] font-bold text-neutral-500 block font-mono uppercase">
            Sampled Backdrop Color
          </span>
          <div className="flex items-center gap-3">
            <div 
              style={{ backgroundColor: `rgb(${config.keyR}, ${config.keyG}, ${config.keyB})` }}
              className="w-10 h-10 rounded-xl border border-neutral-700 shadow-inner shrink-0"
            />
            <div className="font-mono text-2xs space-y-0.5 text-left text-neutral-400">
              <p className="font-semibold text-white">RGB: {config.keyR}, {config.keyG}, {config.keyB}</p>
              <p>Hex: #{((1 << 24) + (config.keyR << 16) + (config.keyG << 8) + config.keyB).toString(16).slice(1).toUpperCase()}</p>
            </div>
          </div>
          
          <div className="pt-2">
            <label className="text-[10px] font-bold text-neutral-500 block font-mono uppercase mb-1">
              Select Custom Color
            </label>
            <input
              type="color"
              value={`#${((1 << 24) + (config.keyR << 16) + (config.keyG << 8) + config.keyB).toString(16).slice(1)}`}
              onChange={(e) => {
                const hex = e.target.value;
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                setConfig({ ...config, keyR: r, keyG: g, keyB: b });
              }}
              className="w-full h-8 bg-neutral-950 border border-neutral-850 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Sensitivity slider */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-neutral-400 font-mono uppercase">
                Sensitivity Color Tolerance
              </label>
              <span className="text-xs font-mono font-bold text-teal-400">{config.sensitivity}</span>
            </div>
            <input
              type="range"
              min="5"
              max="160"
              value={config.sensitivity}
              onChange={(e) => setConfig({ ...config, sensitivity: parseInt(e.target.value) })}
              className="w-full accent-teal-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-neutral-400 font-mono uppercase">
                Edge Feather Smoothness
              </label>
              <span className="text-xs font-mono font-bold text-teal-400">{config.feather}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={config.feather}
              onChange={(e) => setConfig({ ...config, feather: parseInt(e.target.value) })}
              className="w-full accent-teal-500"
            />
          </div>
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
    updateProgress(20, `Decoding dimensions layout for ${file.name}...`);
    
    // Load image
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to decode file layers."));
      };
      img.src = url;
    });

    updateProgress(45, `Analyzing image grids: ${img.width}x${img.height}. Processing translucent layers...`);

    // Setup canvas
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error("Unable to obtain canvas coordinate context.");
    }

    // Draw base image
    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    // Read pixel bytes
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const targetR = config.keyR ?? 255;
    const targetG = config.keyG ?? 255;
    const targetB = config.keyB ?? 255;
    const sensitivity = config.sensitivity ?? 45;
    const feather = config.feather ?? 2;

    updateProgress(65, `Applying chroma-subtraction algorithms...`);

    // Dynamic keying
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Euclidean distance in color space
      const distance = Math.sqrt(
        Math.pow(r - targetR, 2) +
        Math.pow(g - targetG, 2) +
        Math.pow(b - targetB, 2)
      );

      if (distance < sensitivity) {
        // Transparent
        data[i + 3] = 0;
      } else if (feather > 0 && distance < sensitivity + feather * 8) {
        // Smooth transition alpha feather
        const diff = distance - sensitivity;
        const ratio = diff / (feather * 8);
        data[i + 3] = Math.round(ratio * 255);
      }
    }

    // Paint updated pixels back
    ctx.putImageData(imgData, 0, 0);

    updateProgress(85, `Encoding transparent loss-less PNG output...`);

    // Always output background-removal as transparent PNG!
    const finalBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to compile background transparency."));
      }, "image/png");
    });

    // Handle output name
    let outName = file.name;
    const splitDot = outName.lastIndexOf(".");
    const baseName = splitDot !== -1 ? outName.substring(0, splitDot) : outName;

    return {
      blob: finalBlob,
      fileName: `${baseName}_bg_removed.png`
    };
  };

  return (
    <ToolShell
      toolId="remove-background"
      allowedExtensions={allowedExtensions}
      allowMultiple={false}
      configTitle="Alpha Chroma Settings"
      renderConfig={renderConfig}
      defaultConfig={{
        keyR: 255,
        keyG: 255,
        keyB: 255,
        sensitivity: 40,
        feather: 2
      }}
      onProcessFile={onProcessFile}
    />
  );
}
