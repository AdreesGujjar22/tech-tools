"use client";

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import ToolShell from "./ToolShell";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

export default function MergePdf() {
  const [fileOrder, setFileOrder] = useState<string[]>([]);

  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    updateProgress(15, "Reading input bytes...");
    const mergedPdf = await PDFDocument.create();
    
    // Sort files based on user selection or leave custom
    const len = files.length;
    for (let i = 0; i < len; i++) {
      const file = files[i];
      const stepMsg = `Merging: ${file.name} (${i + 1}/${len})`;
      updateProgress(Math.floor(15 + (i / len) * 70), stepMsg);
      
      const fileBytes = await file.arrayBuffer();
      const document = await PDFDocument.load(fileBytes);
      const copiedPages = await mergedPdf.copyPages(document, document.getPageIndices());
      
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    updateProgress(90, "Assembling and flushing stream dictionary...");
    const finalBytes = await mergedPdf.save();
    const finalBlob = new Blob([finalBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    
    return {
      blob: finalBlob,
      fileName: `merged_${Date.now()}.pdf`
    };
  };

  return (
    <ToolShell
      toolId="merge-pdf"
      allowedExtensions={[".pdf"]}
      allowMultiple={true}
      maxFiles={30}
      configTitle="Merge Controls"
      renderConfig={(files, config, setConfig) => (
        <div className="space-y-4">
          <p className="text-xs text-[#4A6857] leading-relaxed">
            Drag files to reorder or sort. They will be integrated from top to bottom into a single document.
          </p>
          <div className="border border-[#C5DCC9] rounded-xl divide-y divide-[#C5DCC9] bg-[#F0F7F0] max-h-[250px] overflow-y-auto custom-scroll">
            {files.map((file, idx) => (
              <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 text-xs bg-white/40 font-mono">
                <span className="truncate max-w-[180px] text-[#1F3A26] font-semibold">{file.name}</span>
                <span className="text-[#4A6857] font-normal">Page Count: N/A</span>
              </div>
            ))}
          </div>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
