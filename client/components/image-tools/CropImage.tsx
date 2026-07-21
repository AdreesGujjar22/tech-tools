"use client";

import React, { useState, useEffect, useRef, useCallback, ReactNode } from "react";
import ToolShell from "./ToolShell";
import { useTranslations } from "next-intl";

interface CropConfigUIProps {
  files: File[];
  config: any;
  setConfig: (update: any) => void;
}

function CropConfigUI({ files, config, setConfig }: CropConfigUIProps) {
  const t = useTranslations("Tools.CropImage");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [cropBox, setCropBox] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0, boxX: 0, boxY: 0, boxW: 0, boxH: 0 });
  const mouseDownRef = useRef(false);

  useEffect(() => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImgUrl(url);

      const img = new Image();
      img.onload = () => {
        const w = img.width || 100;
        const h = img.height || 100;
        setOriginalDims({ w, h });

        const cropW = Math.round(w * 0.7);
        const cropH = Math.round(h * 0.7);
        const cropX = Math.round(w * 0.15);
        const cropY = Math.round(h * 0.15);

        setCropBox({ x: cropX, y: cropY, w: cropW, h: cropH });
        setConfig((prev: any) => ({
          ...prev,
          cropX,
          cropY,
          cropW,
          cropH
        }));
      };
      img.onerror = () => {
        console.error("Failed to load image");
      };
      img.src = url;

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [files, setConfig]);

  const selectRatio = useCallback(
    (ratio: number | string) => {
      if (originalDims.w <= 0 || originalDims.h <= 0) return;

      if (ratio === "free") {
        setConfig((prev: any) => ({ ...prev, ratio: "free" }));
        return;
      }

      const numRatio = Number(ratio);
      if (isNaN(numRatio) || numRatio <= 0) return;

      let nextW = Math.min(originalDims.w * 0.7, originalDims.w);
      let nextH = nextW / numRatio;

      if (nextH > originalDims.h) {
        nextH = Math.min(originalDims.h * 0.7, originalDims.h);
        nextW = nextH * numRatio;
      }

      nextW = Math.round(nextW);
      nextH = Math.round(nextH);

      const nextX = Math.round((originalDims.w - nextW) / 2);
      const nextY = Math.round((originalDims.h - nextH) / 2);

      const nextBox = {
        x: Math.max(0, nextX),
        y: Math.max(0, nextY),
        w: nextW,
        h: nextH
      };

      setCropBox(nextBox);
      setConfig((prev: any) => ({
        ...prev,
        ratio,
        cropX: nextBox.x,
        cropY: nextBox.y,
        cropW: nextBox.w,
        cropH: nextBox.h
      }));
    },
    [originalDims, setConfig]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent, type: string) => {
      e.preventDefault();
      mouseDownRef.current = true;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      dragStart.current = {
        x: clientX,
        y: clientY,
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
    },
    [cropBox]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!mouseDownRef.current) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || originalDims.w <= 0 || originalDims.h <= 0) return;

      const clientX = e instanceof TouchEvent ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      const clientY = e instanceof TouchEvent ? e.touches[0]?.clientY : (e as MouseEvent).clientY;

      if (!clientX || !clientY) return;

      const deltaX = clientX - dragStart.current.x;
      const deltaY = clientY - dragStart.current.y;
      const scaleX = originalDims.w / rect.width;
      const scaleY = originalDims.h / rect.height;

      let nextBox = { ...cropBox };
      const MIN_SIZE = 20;
      const ratioVal = config.ratio !== "free" ? Number(config.ratio) : null;

      if (isDragging) {
        nextBox.x = Math.max(
          0,
          Math.min(originalDims.w - cropBox.w, dragStart.current.boxX + deltaX * scaleX)
        );
        nextBox.y = Math.max(
          0,
          Math.min(originalDims.h - cropBox.h, dragStart.current.boxY + deltaY * scaleY)
        );
      } else if (isResizing === "se") {
        nextBox.w = Math.max(MIN_SIZE, dragStart.current.boxW + deltaX * scaleX);
        if (ratioVal && ratioVal > 0) {
          nextBox.h = nextBox.w / ratioVal;
        } else {
          nextBox.h = Math.max(MIN_SIZE, dragStart.current.boxH + deltaY * scaleY);
        }
        nextBox.w = Math.min(originalDims.w - nextBox.x, nextBox.w);
        nextBox.h = Math.min(originalDims.h - nextBox.y, nextBox.h);
      } else if (isResizing === "nw") {
        const newW = dragStart.current.boxW - deltaX * scaleX;
        const newX = dragStart.current.boxX + deltaX * scaleX;
        if (newW >= MIN_SIZE && newX >= 0) {
          nextBox.w = newW;
          nextBox.x = newX;
        }
        if (ratioVal && ratioVal > 0) {
          nextBox.h = nextBox.w / ratioVal;
          nextBox.y = dragStart.current.boxY + dragStart.current.boxH - nextBox.h;
          if (nextBox.y < 0) {
            nextBox.y = 0;
            nextBox.h = Math.min(originalDims.h, dragStart.current.boxY + dragStart.current.boxH);
            nextBox.w = nextBox.h * ratioVal;
            nextBox.x = Math.max(0, dragStart.current.boxX + dragStart.current.boxW - nextBox.w);
          }
        } else {
          const newH = dragStart.current.boxH - deltaY * scaleY;
          const newY = dragStart.current.boxY + deltaY * scaleY;
          if (newH >= MIN_SIZE && newY >= 0) {
            nextBox.h = newH;
            nextBox.y = newY;
          }
        }
      } else if (isResizing === "ne") {
        nextBox.w = Math.max(MIN_SIZE, dragStart.current.boxW + deltaX * scaleX);
        if (ratioVal && ratioVal > 0) {
          nextBox.h = nextBox.w / ratioVal;
        } else {
          const newH = dragStart.current.boxH - deltaY * scaleY;
          const newY = dragStart.current.boxY + deltaY * scaleY;
          if (newH >= MIN_SIZE && newY >= 0) {
            nextBox.h = newH;
            nextBox.y = newY;
          }
        }
        nextBox.w = Math.min(originalDims.w - nextBox.x, nextBox.w);
        if (ratioVal && ratioVal > 0) {
          nextBox.y = dragStart.current.boxY + dragStart.current.boxH - nextBox.h;
          if (nextBox.y < 0) {
            nextBox.y = 0;
            nextBox.h = dragStart.current.boxY + dragStart.current.boxH;
            nextBox.w = nextBox.h * ratioVal;
          }
        }
        nextBox.h = Math.min(originalDims.h - nextBox.y, nextBox.h);
      } else if (isResizing === "sw") {
        const newW = dragStart.current.boxW - deltaX * scaleX;
        const newX = dragStart.current.boxX + deltaX * scaleX;
        if (newW >= MIN_SIZE && newX >= 0) {
          nextBox.w = newW;
          nextBox.x = newX;
        }
        if (ratioVal && ratioVal > 0) {
          nextBox.h = nextBox.w / ratioVal;
        } else {
          nextBox.h = Math.max(MIN_SIZE, dragStart.current.boxH + deltaY * scaleY);
        }
        nextBox.h = Math.min(originalDims.h - nextBox.y, nextBox.h);
      }

      setCropBox(nextBox);
      setConfig((prev: any) => ({
        ...prev,
        cropX: Math.round(nextBox.x),
        cropY: Math.round(nextBox.y),
        cropW: Math.round(nextBox.w),
        cropH: Math.round(nextBox.h)
      }));
    };

    const handleMouseUp = () => {
      mouseDownRef.current = false;
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleMouseMove, { passive: false });
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, cropBox, config.ratio, originalDims, setConfig]);

  return (
    <div className="space-y-6">
      {/* Aspect ratio controls */}
      <div>
        <label className="text-xs font-bold text-[#4A6857] block mb-2 font-mono uppercase">
          {t("aspectRatio")}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-2xs">
          {[
            { id: "free", label: t("free") },
            { id: "1", label: t("square") },
            { id: "1.777", label: "16:9" },
            { id: "0.5625", label: "9:16" },
            { id: "1.333", label: "4:3" },
            { id: "1.5", label: "3:2" }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => selectRatio(r.id)}
              className={`py-2 rounded-lg border text-center font-bold tracking-tight transition duration-150 cursor-pointer ${
                String(config.ratio) === r.id
                  ? "bg-[#10A968]/20 border-[#10A968] text-[#1F3A26]"
                  : "bg-neutral-900/60 border-neutral-850 text-[#4A6857] hover:text-[#1F3A26]"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Crop Workspace */}
      {imgUrl && originalDims.w > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[#4A6857] block font-mono uppercase">
            {t("interactiveCropArea")}
          </span>
          <div
            ref={containerRef}
            className="relative border border-[#C5DCC9] bg-[#F0F7F0] rounded-2xl overflow-hidden select-none w-full flex items-center justify-center p-3"
            style={{ aspectRatio: originalDims.w / originalDims.h, maxHeight: "400px" }}
          >
            <img
              ref={imageRef}
              src={imgUrl}
              alt={t("previewAlt")}
              className="h-full w-full object-contain pointer-events-none opacity-60"
            />

            {/* Crop Zone Overlay */}
            <div
              style={{
                position: "absolute",
                left: `${(cropBox.x / originalDims.w) * 100}%`,
                top: `${(cropBox.y / originalDims.h) * 100}%`,
                width: `${(cropBox.w / originalDims.w) * 100}%`,
                height: `${(cropBox.h / originalDims.h) * 100}%`
              }}
              className="border-2 border-[#10A968] shadow-2xl relative cursor-move"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleMouseDown(e, "drag");
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                handleMouseDown(e, "drag");
              }}
            >
              {/* Grid overlay */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${i % 3 !== 2 ? "border-r" : ""} ${i < 6 ? "border-b" : ""} border-[#10A968]/40`}
                  />
                ))}
              </div>

              {/* Corner handles */}
              {[
                { corner: "nw", top: "-6px", left: "-6px", cursor: "nwse-resize" },
                { corner: "ne", top: "-6px", right: "-6px", cursor: "nesw-resize" },
                { corner: "sw", bottom: "-6px", left: "-6px", cursor: "nesw-resize" },
                { corner: "se", bottom: "-6px", right: "-6px", cursor: "nwse-resize" }
              ].map((handle) => (
                <div
                  key={handle.corner}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, handle.corner);
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, handle.corner);
                  }}
                  style={{
                    position: "absolute",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#4F46E5",
                    border: "2px solid white",
                    borderRadius: "2px",
                    cursor: handle.cursor,
                    ...(handle.top && { top: handle.top }),
                    ...(handle.bottom && { bottom: handle.bottom }),
                    ...(handle.left && { left: handle.left }),
                    ...(handle.right && { right: handle.right })
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dimension info */}
      <div className="p-4 bg-[#F0F7F0] rounded-2xl space-y-3 font-mono text-2xs text-[#4A6857] border border-[#C5DCC9]">
        <span className="text-[10px] font-bold text-[#4A6857] block uppercase mb-1">
          {t("outputDimensions")}
        </span>
        <div className="grid grid-cols-2 gap-2 text-left">
          <div>
            <span className="text-[#4A6857] block">{t("startXY")}:</span>
            <span className="text-[#1F3A26] font-bold">
              {config.cropX}, {config.cropY} px
            </span>
          </div>
          <div>
            <span className="text-[#4A6857] block">{t("sizeWH")}:</span>
            <span className="text-[#1F3A26] font-bold">
              {config.cropW} x {config.cropH} px
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CropImage() {
  const t = useTranslations("Tools.CropImage");
  const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];

  const onProcessFile = async (
    file: File,
    config: any,
    index: number,
    updateProgress: (percentage: number, msg?: string) => void
  ) => {
    updateProgress(20, `Loading image ${file.name}...`);

    if (!file || !file.size) {
      throw new Error(`File "${file?.name || "unknown"}" is empty or invalid.`);
    }

    if (file.size > 50 * 1024 * 1024) {
      throw new Error(`File "${file.name}" exceeds 50MB limit.`);
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    try {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          if (img.width <= 0 || img.height <= 0 || isNaN(img.width) || isNaN(img.height)) {
            reject(new Error("Invalid image dimensions."));
          } else {
            resolve();
          }
        };
        img.onerror = () => {
          reject(new Error("Failed to load image."));
        };
        img.src = url;
      });
    } catch (err: any) {
      URL.revokeObjectURL(url);
      throw new Error(`Cannot decode image: ${err.message}`);
    }

    updateProgress(50, `Cropping ${config.cropW}x${config.cropH}px...`);

    let cropX = Math.max(0, Math.min(img.width - 1, config.cropX || 0));
    let cropY = Math.max(0, Math.min(img.height - 1, config.cropY || 0));
    let cropW = Math.max(1, Math.min(img.width - cropX, config.cropW || img.width));
    let cropH = Math.max(1, Math.min(img.height - cropY, config.cropH || img.height));

    cropW = Math.min(16383, Math.max(1, cropW));
    cropH = Math.min(16383, Math.max(1, cropH));

    const canvas = document.createElement("canvas");
    canvas.width = cropW;
    canvas.height = cropH;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      URL.revokeObjectURL(url);
      throw new Error("Cannot initialize canvas.");
    }

    const targetMimeType = file.type || "image/jpeg";

    try {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      if (targetMimeType === "image/jpeg" || targetMimeType === "image/jpg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, cropW, cropH);
      }

      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    } catch (err: any) {
      URL.revokeObjectURL(url);
      throw new Error(`Canvas error: ${err.message}`);
    }

    URL.revokeObjectURL(url);
    updateProgress(80, `Encoding crop result...`);

    let finalBlob: Blob;
    try {
      finalBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to generate blob."));
        }, targetMimeType, 0.95);
      });
    } catch (err: any) {
      throw new Error(`Cannot encode image: ${err.message}`);
    }

    const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const ext = file.name.substring(file.name.lastIndexOf("."));

    return {
      blob: finalBlob,
      fileName: `${baseName}_cropped${ext}`
    };
  };

  return (
    <ToolShell
      toolId="crop-image"
      allowedExtensions={allowedExtensions}
      allowMultiple={false}
      configTitle={t("settings")}
      renderConfig={(files: File[], config: any, setConfig: any) => (
        <CropConfigUI files={files} config={config} setConfig={setConfig} />
      )}
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
