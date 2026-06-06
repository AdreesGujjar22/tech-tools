"use client";

import React, { useState, useEffect } from "react";
import ToolShell from "./ToolShell";
import { RotateCw, RotateCcw, ArrowRightLeft, Columns, Rows } from "lucide-react";

export default function RotateImage() {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];

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

    const handleRotateRight = () => {
      setConfig((prev: any) => ({
        ...prev,
        rotation: (prev.rotation + 90) % 360
      }));
    };

    const handleRotateLeft = () => {
      setConfig((prev: any) => ({
        ...prev,
        rotation: (prev.rotation + 270) % 360
      }));
    };

    const toggleFlipH = () => {
      setConfig((prev: any) => ({
        ...prev,
        flipH: !prev.flipH
      }));
    };

    const toggleFlipV = () => {
      setConfig((prev: any) => ({
        ...prev,
        flipV: !prev.flipV
      }));
    };

    return (
      <div className="space-y-6">
        {/* Interactive action buttons */}
        <div>
          <label className="text-xs font-bold text-neutral-400 block mb-2 font-mono uppercase">
            Rotation Controls
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleRotateLeft}
              className="p-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs flex items-center justify-center gap-2 font-medium transition"
            >
              <RotateCcw className="w-4 h-4 text-teal-500" />
              Rotate Left
            </button>
            <button
              onClick={handleRotateRight}
              className="p-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-xl text-xs flex items-center justify-center gap-2 font-medium transition"
            >
              <RotateCw className="w-4 h-4 text-teal-500" />
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
              className={`p-3 border rounded-xl text-xs flex items-center justify-center gap-2 font-medium transition ${
                config.flipH
                  ? "bg-teal-950/40 border-teal-500 text-teal-400 font-bold"
                  : "bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white"
              }`}
            >
              <Columns className="w-4 h-4 text-teal-500" />
              Flip Horizontal
            </button>
            <button
              onClick={toggleFlipV}
              className={`p-3 border rounded-xl text-xs flex items-center justify-center gap-2 font-medium transition ${
                config.flipV
                  ? "bg-teal-950/40 border-teal-500 text-teal-400 font-bold"
                  : "bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white"
              }`}
            >
              <Rows className="w-4 h-4 text-teal-500" />
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
            <div className="border border-neutral-900 bg-neutral-950 rounded-2xl p-6 flex items-center justify-center min-h-[160px] overflow-hidden">
              <div 
                style={{
                  transform: `rotate(${config.rotation}deg) scaleX(${config.flipH ? -1 : 1}) scaleY(${config.flipV ? -1 : 1})`,
                  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                className="inline-block"
              >
                <img
                  src={previewUrl}
                  alt="Transformation preview"
                  className="max-h-[120px] w-auto object-contain rounded-lg border border-neutral-800 shadow-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Info list */}
        <div className="p-3 bg-neutral-950 rounded-xl font-mono text-2xs space-y-1 text-left border border-neutral-900">
          <span className="text-[10px] font-bold text-neutral-500 block uppercase">
            Active Parameters
          </span>
          <p className="text-neutral-400">Rotation Angle: <span className="text-white font-bold">{config.rotation}°</span></p>
          <p className="text-neutral-400">Horizontal Flip: <span className="text-white font-bold">{config.flipH ? "ACTIVE" : "OFF"}</span></p>
          <p className="text-neutral-400">Vertical Flip: <span className="text-white font-bold">{config.flipV ? "ACTIVE" : "OFF"}</span></p>
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
    updateProgress(20, `Decoding files parameters for ${file.name}...`);
    
    // Load image
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to decode the target photo layers."));
      };
      img.src = url;
    });

    updateProgress(50, `Image dimensions loaded. Re-indexing canvas orientation...`);

    // Determine target canvas coordinates based on rotation
    const rotation = config.rotation || 0;
    const is90or270 = rotation === 90 || rotation === 270;
    
    const targetW = is90or270 ? img.height : img.width;
    const targetH = is90or270 ? img.width : img.height;

    // Render Canvas
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error("Unable to initialize canvas memory graphics.");
    }

    // Move translation pointer to center of canvas
    ctx.translate(targetW / 2, targetH / 2);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Apply flips
    const scaleX = config.flipH ? -1 : 1;
    const scaleY = config.flipV ? -1 : 1;
    ctx.scale(scaleX, scaleY);

    // Draw centering image
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    URL.revokeObjectURL(url);

    updateProgress(80, `Encoding rotated final image...`);

    // Export with same format
    const targetMimeType = file.type || "image/jpeg";
    const finalBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to save rotated canvas context."));
      }, targetMimeType, 0.95);
    });

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
