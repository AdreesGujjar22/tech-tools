"use client";

import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import ToolShell from "./ToolShell";

export default function EditPdf() {
  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    updateProgress(20, "Loading document stream dictionaries...");
    const file = files[0];
    const fileBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBytes);
    const pageCount = pdfDoc.getPageCount();

    const textToAdd = config.text || "Sample Annotation";
    const targetPage = Math.max(1, Math.min(pageCount, parseInt(config.page || "1", 10)));
    const posX = parseFloat(config.x || "50");
    const posY = parseFloat(config.y || "100");
    const size = parseFloat(config.fontSize || "14");
    
    updateProgress(55, `Locating page ${targetPage}/${pageCount}...`);
    const page = pdfDoc.getPage(targetPage - 1);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Resolve selected color
    let drawColor = rgb(1, 0, 0); // Default Red
    if (config.color === "black") drawColor = rgb(0, 0, 0);
    else if (config.color === "blue") drawColor = rgb(0, 0, 1);
    else if (config.color === "green") drawColor = rgb(0.1, 0.6, 0.1);

    updateProgress(80, "Drawing text overlay parameters directly on page canvas...");
    page.drawText(textToAdd, {
      x: posX,
      y: posY,
      size: size,
      font,
      color: drawColor
    });

    const finalBytes = await pdfDoc.save();

    return {
      blob: new Blob([finalBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
      fileName: `edited_${file.name}`
    };
  };

  return (
    <ToolShell
      toolId="edit-pdf"
      allowedExtensions={[".pdf"]}
      allowMultiple={false}
      configTitle="Digital Ink & Text Overlay"
      defaultConfig={{ text: "Official Copy", page: "1", x: "100", y: "700", fontSize: "18", color: "red" }}
      renderConfig={(files, config, setConfig) => (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">
              Overlay Label Text
            </label>
            <input
              type="text"
              value={config.text}
              onChange={(e) => setConfig({ ...config, text: e.target.value })}
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-850 rounded-xl text-sm text-white focus:outline-none focus:border-red-600 transition"
              placeholder="e.g. Approved"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">
                Page Number
              </label>
              <input
                type="number"
                min="1"
                value={config.page}
                onChange={(e) => setConfig({ ...config, page: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-850 rounded-xl text-sm text-white focus:outline-none focus:border-red-600 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">
                Font Size
              </label>
              <input
                type="number"
                min="6"
                max="72"
                value={config.fontSize}
                onChange={(e) => setConfig({ ...config, fontSize: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-850 rounded-xl text-sm text-white focus:outline-none focus:border-red-600 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">
                X Coordinate (Left)
              </label>
              <input
                type="number"
                value={config.x}
                onChange={(e) => setConfig({ ...config, x: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-850 rounded-xl text-sm text-white focus:outline-none focus:border-red-600 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">
                Y Coordinate (Bottom)
              </label>
              <input
                type="number"
                value={config.y}
                onChange={(e) => setConfig({ ...config, y: e.target.value })}
                className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-850 rounded-xl text-sm text-white focus:outline-none focus:border-red-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-400 block mb-1">
              Text Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "red", bg: "bg-red-500" },
                { id: "black", bg: "bg-black border border-neutral-800" },
                { id: "blue", bg: "bg-blue-500" },
                { id: "green", bg: "bg-emerald-500" }
              ].map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setConfig({ ...config, color: color.id })}
                  className={`py-2 px-1 rounded-lg flex items-center justify-center border text-2xs font-semibold capitalize font-mono transition duration-150 ${
                    config.color === color.id
                      ? "border-red-600 bg-red-600/10 text-white"
                      : "border-neutral-800 bg-neutral-950/40 hover:border-neutral-700 text-neutral-400"
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${color.bg} mr-1.5`} />
                  {color.id}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
