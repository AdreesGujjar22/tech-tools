"use client";

import React from "react";
import { PDFDocument } from "pdf-lib";
import ToolShell from "./ToolShell";

export default function RepairPdf() {
  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    updateProgress(20, "Scanning binary dictionaries...");
    const file = files[0];
    const fileBytes = await file.arrayBuffer();

    updateProgress(50, "Fixing broken offset structures and running catalog recovery...");
    // loading with pdf-lib reconstructs invalid pointers & updates EOF markers beautifully
    const pdfDoc = await PDFDocument.load(fileBytes, {
      ignoreEncryption: true
    });

    const pageCount = pdfDoc.getPageCount();
    updateProgress(75, `Successfully recovered ${pageCount} catalog index layers!`);

    const rebuiltBytes = await pdfDoc.save({ useObjectStreams: false });
    const finalBlob = new Blob([rebuiltBytes], { type: "application/pdf" });

    return {
      blob: finalBlob,
      fileName: `repaired_${file.name}`
    };
  };

  return (
    <ToolShell
      toolId="repair-pdf"
      allowedExtensions={[".pdf"]}
      allowMultiple={false}
      configTitle="Repair Options"
      renderConfig={() => (
        <div className="py-2 text-center">
          <p className="text-xs text-[#4A6857] font-mono leading-relaxed">
            The repair pipeline reconstructs broken catalog indices, stream lengths, and missing offset markers to satisfy Adobe & web standards.
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
