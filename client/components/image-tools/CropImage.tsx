"use client";

import React, { useState, useEffect, useRef } from "react";
import ToolShell from "./ToolShell";

export default function CropImage() {
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg"];

  const renderConfig = (files: any[], config: any, setConfig: any) => {
    const [imgUrl, setImgUrl] = useState<string | null>(null);
    const [originalDims, setOriginalDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // Track crop box state in percentages of container size (0 to 100)
    const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState<string | null>(null); // "nw", "ne", "sw", "se"
    const dragStart = useRef({ x: 0, y: 0, boxX: 0, boxY: 0, boxW: 0, boxH: 0 });

    useEffect(() => {
      if (files.length > 0) {
        const url = URL.createObjectURL(files[0]);
        setImgUrl(url);

        const img = new Image();
        img.onload = () => {
          setOriginalDims({ w: img.width, h: img.height });
          setCropBox({ x: 15, y: 15, w: 70, h: 70 });
          setConfig((prev: any) => ({
            ...prev,
            cropX: Math.round(img.width * 0.15),
            cropY: Math.round(img.height * 0.15),
            cropW: Math.round(img.width * 0.70),
            cropH: Math.round(img.height * 0.70)
          }));
        };
        img.src = url;

        return () => {
          URL.revokeObjectURL(url);
        };
      }
    }, [files]);

    // Handle aspect ratio presets
    const selectRatio = (ratio: number | string) => {
      if (ratio === "free") {
        setConfig((prev: any) => ({ ...prev, ratio: "free" }));
        return;
      }
      
      const numRatio = Number(ratio);
      let nextW = 70;
      let nextH = 70;

      // Adjust height or width depending on ratio
      if (numRatio > 1) {
        nextH = Math.round(nextW / numRatio);
      } else {
        nextW = Math.round(nextH * numRatio);
      }

      const nextBox = {
        x: Math.round((100 - nextW) / 2),
        y: Math.round((100 - nextH) / 2),
        w: nextW,
        h: nextH
      };

      setCropBox(nextBox);
      setConfig((prev: any) => ({
        ...prev,
        ratio,
        cropX: Math.round(originalDims.w * (nextBox.x / 100)),
        cropY: Math.round(originalDims.h * (nextBox.y / 100)),
        cropW: Math.round(originalDims.w * (nextBox.w / 100)),
        cropH: Math.round(originalDims.h * (nextBox.h / 100))
      }));
    };

    // Calculate percent positions to actual original pixels
    const updateConfigPixels = (box: typeof cropBox) => {
      setConfig((prev: any) => ({
        ...prev,
        cropX: Math.round(originalDims.w * (box.x / 100)),
        cropY: Math.round(originalDims.h * (box.y / 100)),
        cropW: Math.round(originalDims.w * (box.w / 100)),
        cropH: Math.round(originalDims.h * (box.h / 100))
      }));
    };

    const handleMouseDown = (e: React.MouseEvent, type: string) => {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        boxX: cropBox.x,
        boxY: cropBox.y,
        boxW: cropBox.w,
        boxH: cropBox.h
      };

      if (type === "drag") {
        setIsDragging(true);
      } else {
        setIsResizing(type);
      }
    };

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging && !isResizing) return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const deltaXPercent = ((e.clientX - dragStart.current.x) / rect.width) * 100;
        const deltaYPercent = ((e.clientY - dragStart.current.y) / rect.height) * 100;

        let nextBox = { ...cropBox };

        if (isDragging) {
          nextBox.x = Math.max(0, Math.min(100 - dragStart.current.boxW, dragStart.current.boxX + deltaXPercent));
          nextBox.y = Math.max(0, Math.min(100 - dragStart.current.boxH, dragStart.current.boxY + deltaYPercent));
        } else if (isResizing) {
          const ratioCode = config.ratio;
          const ratioVal = ratioCode !== "free" ? Number(ratioCode) : null;

          if (isResizing === "se") {
            nextBox.w = Math.max(10, Math.min(100 - dragStart.current.boxX, dragStart.current.boxW + deltaXPercent));
            if (ratioVal) {
              nextBox.h = nextBox.w / ratioVal;
              // If height exceeds space, downscale width
              if (nextBox.y + nextBox.h > 100) {
                nextBox.h = 100 - nextBox.y;
                nextBox.w = nextBox.h * ratioVal;
              }
            } else {
              nextBox.h = Math.max(10, Math.min(100 - dragStart.current.boxY, dragStart.current.boxH + deltaYPercent));
            }
          } else if (isResizing === "nw") {
            const possibleW = dragStart.current.boxW - deltaXPercent;
            const possibleX = dragStart.current.boxX + deltaXPercent;
            if (possibleX >= 0 && possibleW >= 10) {
              nextBox.x = possibleX;
              nextBox.w = possibleW;
            }
            if (ratioVal) {
              nextBox.h = nextBox.w / ratioVal;
              nextBox.y = dragStart.current.boxY + (dragStart.current.boxH - nextBox.h);
              if (nextBox.y < 0) {
                nextBox.y = 0;
                nextBox.h = dragStart.current.boxY + dragStart.current.boxH;
                nextBox.w = nextBox.h * ratioVal;
                nextBox.x = dragStart.current.boxX + (dragStart.current.boxW - nextBox.w);
              }
            } else {
              const possibleH = dragStart.current.boxH - deltaYPercent;
              const possibleY = dragStart.current.boxY + deltaYPercent;
              if (possibleY >= 0 && possibleH >= 10) {
                nextBox.y = possibleY;
                nextBox.h = possibleH;
              }
            }
          } else if (isResizing === "ne") {
            nextBox.w = Math.max(10, Math.min(100 - dragStart.current.boxX, dragStart.current.boxW + deltaXPercent));
            if (ratioVal) {
              nextBox.h = nextBox.w / ratioVal;
              nextBox.y = dragStart.current.boxY + (dragStart.current.boxH - nextBox.h);
              if (nextBox.y < 0) {
                nextBox.y = 0;
                nextBox.h = dragStart.current.boxY + dragStart.current.boxH;
                nextBox.w = nextBox.h * ratioVal;
              }
            } else {
              const possibleH = dragStart.current.boxH - deltaYPercent;
              const possibleY = dragStart.current.boxY + deltaYPercent;
              if (possibleY >= 0 && possibleH >= 10) {
                nextBox.y = possibleY;
                nextBox.h = possibleH;
              }
            }
          } else if (isResizing === "sw") {
            const possibleW = dragStart.current.boxW - deltaXPercent;
            const possibleX = dragStart.current.boxX + deltaXPercent;
            if (possibleX >= 0 && possibleW >= 10) {
              nextBox.x = possibleX;
              nextBox.w = possibleW;
            }
            if (ratioVal) {
              nextBox.h = nextBox.w / ratioVal;
              if (nextBox.y + nextBox.h > 100) {
                nextBox.h = 100 - nextBox.y;
                nextBox.w = nextBox.h * ratioVal;
                nextBox.x = dragStart.current.boxX + (dragStart.current.boxW - nextBox.w);
              }
            } else {
              nextBox.h = Math.max(10, Math.min(100 - dragStart.current.boxY, dragStart.current.boxH + deltaYPercent));
            }
          }
        }

        setCropBox(nextBox);
        updateConfigPixels(nextBox);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(null);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, isResizing, cropBox, config.ratio, originalDims]);

    return (
      <div className="space-y-6">
        {/* Aspect ratio controls */}
        <div>
          <label className="text-xs font-bold text-neutral-400 block mb-2 font-mono uppercase">
            Aspect Ratio Layout
          </label>
          <div className="grid grid-cols-2 gap-1.5 font-mono text-2xs">
            {[
              { id: "free", label: "Free Constraints" },
              { id: "1", label: "Square 1:1" },
              { id: "1.777", label: "Landscape 16:9" },
              { id: "1.333", label: "Portrait 4:3" }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => selectRatio(r.id)}
                className={`py-2 rounded-lg border text-center font-bold tracking-tight transition duration-150 ${
                  String(config.ratio) === r.id
                    ? "bg-teal-950/40 border-teal-500 text-teal-400"
                    : "bg-neutral-900/60 border-neutral-850 text-neutral-400 hover:text-white"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Crop Workspace Sandbox (only for first file previewed) */}
        {imgUrl && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-neutral-400 block font-mono uppercase">
              Interactive Bounding Box (Drag/Resize)
            </span>
            <div 
              ref={containerRef}
              className="relative border border-neutral-900 bg-neutral-950 rounded-2xl overflow-hidden select-none select-none max-h-[300px] flex items-center justify-center p-3"
            >
              <div className="relative inline-block overflow-hidden max-h-[260px]">
                <img
                  ref={imageRef}
                  src={imgUrl}
                  alt="Crop preview source"
                  className="max-h-[260px] w-auto pointer-events-none object-contain opacity-50"
                  referrerPolicy="no-referrer"
                />

                {/* Highlighted Crop Zone */}
                <div
                  style={{
                    position: "absolute",
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.w}%`,
                    height: `${cropBox.h}%`
                  }}
                  className="border-2 border-teal-400 shadow-2xl relative cursor-move"
                  onMouseDown={(e) => handleMouseDown(e, "drag")}
                >
                  {/* Subtle Grid overlay within crop box */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
                    <div className="border-r border-b border-teal-300" />
                    <div className="border-r border-b border-teal-300" />
                    <div className="border-b border-teal-300" />
                    <div className="border-r border-b border-teal-300" />
                    <div className="border-r border-b border-teal-300" />
                    <div className="border-b border-teal-300" />
                    <div className="border-r border-teal-300" />
                    <div className="border-r border-teal-300" />
                    <div />
                  </div>

                  {/* Corner resizing handles */}
                  <div
                    onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "nw"); }}
                    className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-teal-400 border border-white rounded cursor-nwse-resize"
                  />
                  <div
                    onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "ne"); }}
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-teal-400 border border-white rounded cursor-nesw-resize"
                  />
                  <div
                    onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "sw"); }}
                    className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-teal-400 border border-white rounded cursor-nesw-resize"
                  />
                  <div
                    onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, "se"); }}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-teal-400 border border-white rounded cursor-nwse-resize"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dimension inputs */}
        <div className="p-4 bg-neutral-950 rounded-2xl space-y-3 font-mono text-2xs text-neutral-400 border border-neutral-900 leading-relaxed">
          <span className="text-[10px] font-bold text-neutral-500 block uppercase mb-1">
            Output Dimensions
          </span>
          <div className="grid grid-cols-2 gap-2 text-left">
            <div>
              <span className="text-neutral-500 block">Start X, Y:</span>
              <span className="text-white font-bold">{config.cropX}, {config.cropY} px</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Sizing W x H:</span>
              <span className="text-white font-bold">{config.cropW} x {config.cropH} px</span>
            </div>
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
    updateProgress(20, `Decoding canvas layout...`);
    
    // Load image
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to decode the crop photo structure."));
      };
      img.src = url;
    });

    updateProgress(50, `Cropping image offsets: ${config.cropW}x${config.cropH} px...`);

    // Define target dimensions
    const cropX = Math.max(0, Math.min(img.width, config.cropX || 0));
    const cropY = Math.max(0, Math.min(img.height, config.cropY || 0));
    const cropW = Math.max(10, Math.min(img.width - cropX, config.cropW || img.width));
    const cropH = Math.max(10, Math.min(img.height - cropY, config.cropH || img.height));

    // Render Canvas
    const canvas = document.createElement("canvas");
    canvas.width = cropW;
    canvas.height = cropH;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error("Unable to initialize canvas memory layout.");
    }

    // Draw specified cropped area onto the canvas
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    URL.revokeObjectURL(url);

    updateProgress(80, `Encoding compiled visual crop slice...`);

    // Export with same format
    const targetMimeType = file.type || "image/jpeg";
    const finalBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to save cropped canvas slice."));
      }, targetMimeType, 0.95);
    });

    // Handle output name
    let outName = file.name;
    const splitDot = outName.lastIndexOf(".");
    const baseName = splitDot !== -1 ? outName.substring(0, splitDot) : outName;
    const originalExt = splitDot !== -1 ? outName.substring(splitDot) : "";

    return {
      blob: finalBlob,
      fileName: `${baseName}_cropped${originalExt}`
    };
  };

  return (
    <ToolShell
      toolId="crop-image"
      allowedExtensions={allowedExtensions}
      allowMultiple={false}
      configTitle="Crop Grid Coordinates"
      renderConfig={renderConfig}
      defaultConfig={{
        ratio: "free",
        cropX: 0,
        cropY: 0,
        cropW: 0,
        cropH: 0
      }}
      onProcessFile={onProcessFile}
    />
  );
}
