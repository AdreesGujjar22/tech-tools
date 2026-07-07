"use client";

import React from "react";
import { PDFDocument } from "pdf-lib";
import ToolShell from "./ToolShell";
import { toast } from "sonner";

function parseRanges(rangeStr: string, maxPage: number): number[] {
  const pages: number[] = [];
  const parts = rangeStr.split(",");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-");
      const start = Math.max(1, parseInt(startStr, 10));
      const end = Math.min(maxPage, parseInt(endStr, 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          pages.push(i - 1); // 0-based indexing
        }
      }
    } else {
      const pageNum = parseInt(trimmed, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPage) {
        pages.push(pageNum - 1);
      }
    }
  }
  // Return distinct and sorted indices
  return Array.from(new Set(pages)).sort((a, b) => a - b);
}

export default function SplitPdf() {
  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    updateProgress(20, "Loading document structures...");
    const file = files[0];
    const fileBytes = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(fileBytes);
    const maxPage = srcDoc.getPageCount();

    updateProgress(50, `Validating range metrics... Page count is ${maxPage}`);
    const range = config.range || "1";
    const indicesToExtract = parseRanges(range, maxPage);

    if (indicesToExtract.length === 0) {
      throw new Error(`Invalid range selection. The document has ${maxPage} pages.`);
    }

    const splitDoc = await PDFDocument.create();
    updateProgress(70, "Exporting selected page matrices...");
    const copiedPages = await splitDoc.copyPages(srcDoc, indicesToExtract);
    copiedPages.forEach((page) => splitDoc.addPage(page));

    updateProgress(90, "Saving brand new container bytes...");
    const finalBytes = await splitDoc.save();

    return {
      blob: new Blob([finalBytes as any], { type: "application/pdf" }),
      fileName: `split_${Date.now()}_pages_${indicesToExtract.map(i => i + 1).join("_")}.pdf`
    };
  };

  return (
    <ToolShell
      toolId="split-pdf"
      allowedExtensions={[".pdf"]}
      allowMultiple={false}
      configTitle="Split Page Ranger"
      defaultConfig={{ range: "1" }}
      renderConfig={(files, config, setConfig) => (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#4A6857] block mb-1">
              Extract Page List / Range
            </label>
            <input
              type="text"
              placeholder="e.g. 1-3, 5, 7"
              value={config.range}
              onChange={(e) => setConfig({ ...config, range: e.target.value })}
              className="w-full px-4 py-3 bg-[#F0F7F0] border border-[#C5DCC9] rounded-xl text-sm font-mono text-[#1F3A26] focus:outline-none focus:border-[#10A968] transition"
            />
          </div>
          <p className="text-xs text-[#4A6857] leading-relaxed font-mono">
            Tip: Specify page sequences like '1-3' for consecutive pages, or list distinct ones like '1,3,5' separated by commas.
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
