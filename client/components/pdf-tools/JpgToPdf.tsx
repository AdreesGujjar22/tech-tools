"use client";

import React from "react";
import { PDFDocument } from "pdf-lib";
import ToolShell from "./ToolShell";

export default function JpgToPdf() {
  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    updateProgress(15, "Initializing empty PDF canvas...");
    const pdfDoc = await PDFDocument.create();
    const len = files.length;

    for (let i = 0; i < len; i++) {
      const file = files[i];
      const stepPct = Math.floor(15 + (i / len) * 75);
      updateProgress(stepPct, `Embedding photo: ${file.name} (${i + 1}/${len})`);

      const imgBuffer = await file.arrayBuffer();
      const isPng = file.type === "image/png" || file.name.endsWith(".png");

      let embeddedImg;
      if (isPng) {
        embeddedImg = await pdfDoc.embedPng(imgBuffer);
      } else {
        // Embed JPG
        embeddedImg = await pdfDoc.embedJpg(imgBuffer);
      }

      // Add page with original image size
      const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
      page.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: embeddedImg.width,
        height: embeddedImg.height
      });
    }

    updateProgress(92, "Finishing digital catalog compilation...");
    const pdfBytes = await pdfDoc.save();

    return {
      blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
      fileName: `images_compiled_${Date.now()}.pdf`
    };
  };

  return (
    <ToolShell
      toolId="jpg-to-pdf"
      allowedExtensions={[".jpg", ".jpeg", ".png"]}
      allowMultiple={true}
      maxFiles={30}
      configTitle="Layout Options"
      renderConfig={() => (
        <div className="py-2 text-center">
          <p className="text-xs text-neutral-400 font-mono leading-relaxed">
            Images will be compiled of original dimension sizes. Order of compilation matches the listing view.
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
