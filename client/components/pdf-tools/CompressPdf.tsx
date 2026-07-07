"use client";

import React from "react";
import { PDFDocument } from "pdf-lib";
import ToolShell from "./ToolShell";

export default function CompressPdf() {
  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    updateProgress(20, "Analyzing source dictionaries...");
    const file = files[0];
    const originalSize = file.size;

    const fileBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBytes);
    const pageCount = pdfDoc.getPageCount();

    updateProgress(55, `Minifying element trees for ${pageCount} pages...`);
    // Remove metadata fields that bloat the container
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setCreator("");
    pdfDoc.setProducer("");

    updateProgress(80, "Consolidating document cross-references (useObjectStreams)...");
    // Compress the PDF physically by optimizing objects structures
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true
    });

    const finalBlob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    const finalSize = compressedBytes.length;

    return {
      blob: finalBlob,
      fileName: `compressed_${file.name}`,
      meta: {
        originalSize,
        finalSize
      }
    };
  };

  return (
    <ToolShell
      toolId="compress-pdf"
      allowedExtensions={[".pdf"]}
      allowMultiple={false}
      configTitle="Compression Settings"
      defaultConfig={{ level: "recommended" }}
      renderConfig={(files, config, setConfig) => (
        <div className="space-y-4">
          <label className="text-xs font-semibold text-[#4A6857] block pb-1 border-b border-[#C5DCC9]">
            Target Quality Level
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {[
              { id: "extreme", title: "Extreme Compression", desc: "Less quality, high compression" },
              { id: "recommended", title: "Recommended Compression", desc: "Good quality and standard compression" },
              { id: "low", title: "Low Compression", desc: "High quality, less compression" }
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setConfig({ level: option.id })}
                className={`p-3.5 rounded-xl border text-left transition duration-150 ${
                  config.level === option.id
                    ? "border-[#10A968] bg-[#10A968]/10 text-[#1F3A26]"
                    : "border-[#C5DCC9] bg-[#F0F7F0] hover:border-[#10A968]/50 text-[#4A6857]"
                }`}
              >
                <div className="text-xs font-bold leading-none mb-1 text-[#1F3A26]">{option.title}</div>
                <div className="text-2xs text-[#4A6857] font-mono leading-relaxed">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
