"use client";

import React, { useState, useEffect, useRef } from "react";
import ToolShell from "./ToolShell";
import { 
  RotateCw, 
  RotateCcw, 
  Columns, 
  Rows, 
  Undo2, 
  RefreshCw 
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
      {/* Interactive actions for orientation */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-bold text-neutral-400 font-mono uppercase">
            Rotation Controls
          </label>
          {history.length > 0 && (
            <button
              onClick={handleUndo}
              className="text-4xs text-indigo-400 hover:text-indigo-300 font-bold font-mono tracking-normal uppercase bg-[#141B31] border border-neutral-800 rounded px-2 py-1 flex items-center gap-1 transition cursor-pointer"
            >
              <Undo2 className="w-2.5 h-2.5" />
              Undo Last
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleRotateLeft}
            className="p-3 bg-neutral-900 border border-neutral-800 hover:border-indigo-900/50 text-neutral-300 hover:text-white rounded-xl text-xs flex items-center justify-center gap-2 font-medium transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-indigo-400" />
            Rotate Left
          </button>
          <button
            onClick={handleRotateRight}
            className="p-3 bg-neutral-900 border border-neutral-800 hover:border-indigo-900/50 text-neutral-300 hover:text-white rounded-xl text-xs flex items-center justify-center gap-2 font-medium transition cursor-pointer"
          >
            <RotateCw className="w-4 h-4 text-indigo-400" />
            Rotate Right
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-neutral-400 block mb-2 font-mono uppercase">
          Inversion Flips
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={toggleFlipH}
            className={`p-3 border rounded-xl text-xs flex items-center justify-center gap-2 font-medium transition cursor-pointer ${
              config.flipH
                ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 font-bold"
                : "bg-neutral-900 border border-neutral-800 hover:border-indigo-900/50 text-neutral-300 hover:text-white"
            }`}
          >
            <Columns className="w-4 h-4 text-indigo-400" />
            Flip Horizontal
          </button>
          <button
            onClick={toggleFlipV}
            className={`p-3 border rounded-xl text-xs flex items-center justify-center gap-2 font-medium transition cursor-pointer ${
              config.flipV
                ? "bg-indigo-950/40 border-indigo-500 text-indigo-400 font-bold"
                : "bg-neutral-900 border border-neutral-800 hover:border-indigo-900/50 text-neutral-300 hover:text-white"
            }`}
          >
            <Rows className="w-4 h-4 text-indigo-400" />
            Flip Vertical
          </button>
        </div>
      </div>

      {/* Live dynamic styled preview overlay */}
      {previewUrl && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 block font-mono uppercase">
            Transform Blueprint Preview
          </span>
          <div className="border border-neutral-900 bg-neutral-950 rounded-2xl p-6 flex items-center justify-center min-h-[220px] overflow-hidden relative">
            <canvas
              ref={canvasRef}
              className="rounded-lg shadow-2xl max-w-full max-h-[200px]"
            />
          </div>
        </div>
      )}

      {/* Info list with dynamic reset fallback */}
      <div className="p-3 bg-neutral-950 rounded-xl font-mono text-2xs space-y-1 text-left border border-neutral-900 flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-neutral-500 block uppercase">
            Active Parameters
          </span>
          <p className="text-neutral-400">Rotation Angle: <span className="text-white font-bold">{config.rotation}°</span></p>
          <p className="text-neutral-400">Horizontal Flip: <span className="text-white font-bold">{config.flipH ? "ACTIVE" : "OFF"}</span></p>
          <p className="text-neutral-400">Vertical Flip: <span className="text-white font-bold">{config.flipV ? "ACTIVE" : "OFF"}</span></p>
        </div>
        {(config.rotation !== 0 || config.flipH || config.flipV) && (
          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-lg font-bold flex items-center gap-1 transition text-3xs uppercase cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Reset all
          </button>
        )}
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
