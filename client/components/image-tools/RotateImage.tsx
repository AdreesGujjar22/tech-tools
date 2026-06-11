"use client";

import React, { useState, useEffect, useRef } from "react";
import ToolShell from "./ToolShell";
import {
  RotateCw,
  RotateCcw,
  Columns,
  Rows,
  Undo2,
  RefreshCw,
  Settings,
  Repeat2,
  Eye
} from "lucide-react";

interface RotateConfigInnerProps {
  files: any[];
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

function RotateConfigInner({ files, config, setConfig }: RotateConfigInnerProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [files]);

  // Handle preview canvas rendering dynamically with high fidelity and no clipping
  useEffect(() => {
    if (!previewUrl || !canvasRef.current) return;

    let active = true;
    const img = new Image();
    img.onload = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rotation = config.rotation || 0;
      const is90or270 = rotation === 90 || rotation === 270;
      const originalW = img.width || 1;
      const originalH = img.height || 1;
      const rotatedW = is90or270 ? originalH : originalW;
      const rotatedH = is90or270 ? originalW : originalH;

      // Fit preview smoothly within max container boundaries: 340px width, 200px height
      const maxBoxW = 340;
      const maxBoxH = 200;
      const scaleToFit = Math.min(maxBoxW / rotatedW, maxBoxH / rotatedH, 1);

      const displayW = rotatedW * scaleToFit;
      const displayH = rotatedH * scaleToFit;

      canvas.width = displayW;
      canvas.height = displayH;

      ctx.clearRect(0, 0, displayW, displayH);
      ctx.save();
      
      // Move to center of canvas
      ctx.translate(displayW / 2, displayH / 2);

      // Flips first in screen-space coordinate space
      const flipHScale = config.flipH ? -1 : 1;
      const flipVScale = config.flipV ? -1 : 1;
      ctx.scale(flipHScale, flipVScale);

      // Apply rotation angles
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw original image centered
      const imgX = -(originalW * scaleToFit) / 2;
      const imgY = -(originalH * scaleToFit) / 2;
      const imgW = originalW * scaleToFit;
      const imgH = originalH * scaleToFit;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, imgX, imgY, imgW, imgH);

      ctx.restore();
    };
    img.src = previewUrl;

    return () => {
      active = false;
    };
  }, [previewUrl, config.rotation, config.flipH, config.flipV]);

  const pushHistory = (currentConfig: any) => {
    setHistory((prev) => [...prev, { ...currentConfig }]);
  };

  const handleRotateRight = () => {
    pushHistory(config);
    setConfig((prev: any) => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  const handleRotateLeft = () => {
    pushHistory(config);
    setConfig((prev: any) => ({
      ...prev,
      rotation: (prev.rotation + 270) % 360
    }));
  };

  const toggleFlipH = () => {
    pushHistory(config);
    setConfig((prev: any) => ({
      ...prev,
      flipH: !prev.flipH
    }));
  };

  const toggleFlipV = () => {
    pushHistory(config);
    setConfig((prev: any) => ({
      ...prev,
      flipV: !prev.flipV
    }));
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastConfig = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setConfig(lastConfig);
  };

  const handleReset = () => {
    if (config.rotation === 0 && !config.flipH && !config.flipV) return;
    pushHistory(config);
    setConfig({
      rotation: 0,
      flipH: false,
      flipV: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Rotation Controls Section */}
      <div className="bg-gradient-to-br from-neutral-900/60 to-neutral-950/40 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm hover:border-neutral-700 transition">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg">
              <RotateCw className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white block">Rotation</span>
              <span className="text-xs text-indigo-400 font-mono">{config.rotation}°</span>
            </div>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleUndo}
              className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 font-semibold hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition border border-transparent hover:border-indigo-500/30 cursor-pointer active:scale-95"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleRotateLeft}
            className="p-4 bg-gradient-to-r from-neutral-900/40 to-neutral-950/40 border border-neutral-800 hover:border-indigo-500/30 hover:bg-gradient-to-r hover:from-indigo-950/20 hover:to-neutral-900/40 text-neutral-300 hover:text-white rounded-xl text-sm flex items-center justify-center gap-2.5 font-semibold transition cursor-pointer group active:scale-95"
          >
            <RotateCcw className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition" />
            <span>Left</span>
          </button>
          <button
            onClick={handleRotateRight}
            className="p-4 bg-gradient-to-r from-neutral-900/40 to-neutral-950/40 border border-neutral-800 hover:border-indigo-500/30 hover:bg-gradient-to-r hover:from-indigo-950/20 hover:to-neutral-900/40 text-neutral-300 hover:text-white rounded-xl text-sm flex items-center justify-center gap-2.5 font-semibold transition cursor-pointer group active:scale-95"
          >
            <RotateCw className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition" />
            <span>Right</span>
          </button>
        </div>
      </div>

      {/* Flip Controls Section */}
      <div className="bg-gradient-to-br from-neutral-900/60 to-neutral-950/40 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm hover:border-neutral-700 transition">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-800">
          <div className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <Repeat2 className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <span className="text-sm font-semibold text-white block">Flip Orientation</span>
            <span className="text-xs text-purple-400 font-mono">Mirror & Invert</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={toggleFlipH}
            className={`p-4 border rounded-xl text-sm flex items-center justify-center gap-2.5 font-semibold transition cursor-pointer group active:scale-95 ${
              config.flipH
                ? "bg-purple-950/40 border-purple-500/50 text-purple-300"
                : "bg-gradient-to-r from-neutral-900/40 to-neutral-950/40 border-neutral-800 hover:border-purple-500/30 hover:bg-gradient-to-r hover:from-purple-950/20 hover:to-neutral-900/40 text-neutral-300 hover:text-white"
            }`}
          >
            <Columns className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition" />
            <span>H-Flip</span>
          </button>
          <button
            onClick={toggleFlipV}
            className={`p-4 border rounded-xl text-sm flex items-center justify-center gap-2.5 font-semibold transition cursor-pointer group active:scale-95 ${
              config.flipV
                ? "bg-purple-950/40 border-purple-500/50 text-purple-300"
                : "bg-gradient-to-r from-neutral-900/40 to-neutral-950/40 border-neutral-800 hover:border-purple-500/30 hover:bg-gradient-to-r hover:from-purple-950/20 hover:to-neutral-900/40 text-neutral-300 hover:text-white"
            }`}
          >
            <Rows className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition" />
            <span>V-Flip</span>
          </button>
        </div>
      </div>

      {/* Live Preview Section */}
      {previewUrl && (
        <div className="bg-gradient-to-br from-neutral-900/60 to-neutral-950/40 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm hover:border-neutral-700 transition space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
            <div className="p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
              <Eye className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-sm font-semibold text-white">Live Preview</span>
          </div>
          <div className="border border-neutral-800 bg-gradient-to-br from-neutral-950/40 to-neutral-900/20 rounded-2xl p-6 flex items-center justify-center min-h-[240px] overflow-hidden relative">
            <canvas
              ref={canvasRef}
              className="rounded-lg shadow-2xl max-w-full max-h-[220px]"
            />
          </div>
        </div>
      )}

      {/* Current Settings Info Card */}
      <div className="bg-gradient-to-br from-neutral-900/60 to-neutral-950/40 border border-neutral-800 rounded-2xl p-5 backdrop-blur-sm hover:border-neutral-700 transition">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
              <Settings className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-white">Applied Settings</span>
          </div>
          {(config.rotation !== 0 || config.flipH || config.flipV) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-semibold hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg transition border border-transparent hover:border-emerald-500/30 cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Rotation</span>
            <span className="text-white font-semibold bg-neutral-900/60 px-3 py-1 rounded-lg font-mono">
              {config.rotation}°
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Horizontal Flip</span>
            <span className={`font-semibold px-3 py-1 rounded-lg font-mono text-xs ${
              config.flipH
                ? "bg-purple-950/40 text-purple-400"
                : "bg-neutral-900/60 text-neutral-400"
            }`}>
              {config.flipH ? "ON" : "OFF"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">Vertical Flip</span>
            <span className={`font-semibold px-3 py-1 rounded-lg font-mono text-xs ${
              config.flipV
                ? "bg-purple-950/40 text-purple-400"
                : "bg-neutral-900/60 text-neutral-400"
            }`}>
              {config.flipV ? "ON" : "OFF"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RotateImage() {
  const allowedExtensions = [
    ".png", 
    ".jpg", 
    ".jpeg", 
    ".webp", 
    ".svg", 
    ".gif", 
    ".bmp", 
    ".tiff", 
    ".avif"
  ];

  const renderConfig = (files: any[], config: any, setConfig: any) => {
    return <RotateConfigInner files={files} config={config} setConfig={setConfig} />;
  };

  const onProcessFile = async (
    file: File,
    config: any,
    index: number,
    updateProgress: (percentage: number, msg?: string) => void
  ) => {
    updateProgress(20, `Decoding dimensions layout for ${file.name}...`);
    
    if (!file || !file.size) {
      throw new Error(`The file "${file?.name || "unknown"}" appears to be empty or invalid.`);
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
      throw new Error(`[${file.name}] Decode failure: ${err.message || "Unknown image error"}`);
    }

    updateProgress(50, `Image dimensions loaded. Re-indexing canvas orientation...`);

    // Determine target canvas coordinates based on rotation
    const rotation = config.rotation || 0;
    const is90or270 = rotation === 90 || rotation === 270;
    
    const imgW = img.width || 100;
    const imgH = img.height || 100;

    const targetW = is90or270 ? imgH : imgW;
    const targetH = is90or270 ? imgW : imgH;

    // Hard bounds safety layout checking
    if (targetW > 16384 || targetH > 16384) {
      URL.revokeObjectURL(url);
      throw new Error("Transformed canvas dimension exceeds safety thresholds of 16384px.");
    }

    // Render Canvas
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error("Unable to initialize browser canvas buffer stream.");
    }

    const targetMimeType = file.type || "image/jpeg";

    try {
      // Paint standard white background for transparent JPEG images
      if (targetMimeType === "image/jpeg" || targetMimeType === "image/jpg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetW, targetH);
      }

      // Move translation pointer to center of canvas
      ctx.translate(targetW / 2, targetH / 2);

      // Apply flips (in screen-space layout context so that horizontal mirrors visual column perspective)
      const scaleX = config.flipH ? -1 : 1;
      const scaleY = config.flipV ? -1 : 1;
      ctx.scale(scaleX, scaleY);

      // Apply rotation angles
      ctx.rotate((rotation * Math.PI) / 180);

      // Smoothing configurations
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw centering image
      ctx.drawImage(img, -imgW / 2, -imgH / 2);
    } catch (err: any) {
      URL.revokeObjectURL(url);
      throw new Error(`Failed to draw image data into transforming canvas buffer: ${err.message}`);
    }
    
    URL.revokeObjectURL(url);

    updateProgress(85, `Encoding transformed image stream...`);

    let finalBlob: Blob;
    try {
      finalBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Output binary blob is empty."));
        }, targetMimeType, 0.95);
      });
    } catch (err: any) {
      throw new Error(`Failed to serialize transformed image back to file format: ${err.message}`);
    }

    // Handle output name
    let outName = file.name;
    const splitDot = outName.lastIndexOf(".");
    const baseName = splitDot !== -1 ? outName.substring(0, splitDot) : outName;
    const originalExt = splitDot !== -1 ? outName.substring(splitDot) : "";

    return {
      blob: finalBlob,
      fileName: `${baseName}_transformed${originalExt}`
    };
  };

  return (
    <ToolShell
      toolId="rotate-image"
      allowedExtensions={allowedExtensions}
      allowMultiple={true}
      configTitle="Orientation Settings"
      renderConfig={renderConfig}
      defaultConfig={{
        rotation: 0,
        flipH: false,
        flipV: false
      }}
      onProcessFile={onProcessFile}
    />
  );
}
