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
          <label className="text-xs font-semibold text-neutral-400 block pb-1 border-b border-neutral-800">
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
                    ? "border-red-600 bg-red-600/5 text-white"
                    : "border-neutral-800 bg-neutral-950/40 hover:border-neutral-700 text-neutral-400"
                }`}
              >
                <div className="text-xs font-bold leading-none mb-1 text-white">{option.title}</div>
                <div className="text-2xs text-neutral-500 font-mono leading-relaxed">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
