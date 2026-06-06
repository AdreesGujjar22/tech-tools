"use client";

import React from "react";
import { PDFDocument, degrees } from "pdf-lib";
import ToolShell from "./ToolShell";

export default function RotatePdf() {
  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    updateProgress(15, "Parsing document stream...");
    const file = files[0];
    const fileBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBytes);
    const pageCount = pdfDoc.getPageCount();

    const rotationValue = parseInt(config.angle || "90", 10);
    updateProgress(45, `Rotating pages by ${rotationValue} degrees...`);
    const pages = pdfDoc.getPages();
    pages.forEach((page, index) => {
      const currentRotation = page.getRotation().angle;
      const finalAngle = (currentRotation + rotationValue) % 360;
      page.setRotation(degrees(finalAngle));
    });

    updateProgress(80, "Flushing orientation matrix...");
    const rotatedBytes = await pdfDoc.save();

    return {
      blob: new Blob([rotatedBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
      fileName: `rotated_${rotationValue}_${file.name}`
    };
  };

  return (
    <ToolShell
      toolId="rotate-pdf"
      allowedExtensions={[".pdf"]}
      allowMultiple={false}
      configTitle="Rotation Settings"
      defaultConfig={{ angle: "90" }}
      renderConfig={(files, config, setConfig) => (
        <div className="space-y-4">
          <label className="text-xs font-semibold text-neutral-400 block pb-1 border-b border-neutral-800">
            Rotate Clockwise Angle
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "90", label: "+90°" },
              { id: "180", label: "+180°" },
              { id: "270", label: "270°" }
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setConfig({ angle: option.id })}
                className={`py-3.5 px-2 rounded-xl border text-center font-bold text-xs font-mono transition duration-150 ${
                  config.angle === option.id
                    ? "border-red-600 bg-red-600/5 text-white animate-pulse"
                    : "border-neutral-800 bg-neutral-950/40 hover:border-neutral-700 text-neutral-400"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-2xs text-neutral-500 leading-relaxed font-mono mt-1 text-center">
            Applies clockwise rotation across all pages in the PDF document.
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
