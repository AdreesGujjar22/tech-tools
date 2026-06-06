"use client";

import React from "react";
import ToolShell from "./ToolShell";
import mammoth from "mammoth";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function WordToPdf() {
  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    updateProgress(20, "Extracting text nodes from DOCX...");
    const file = files[0];
    const arrayBuffer = await file.arrayBuffer();

    const result = await mammoth.extractRawText({ arrayBuffer });
    const fullText = result.value;

    if (!fullText.trim()) {
      throw new Error("Unable to extract copyable text from this Word document.");
    }

    updateProgress(50, "Generating new PDF layout matrix...");
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const leading = 15;

    // Standard letter bounds
    const width = 612;
    const height = 792;
    const margin = 50;
    const printableWidth = width - margin * 2;

    const linesOfText = fullText.split("\n");
    const wrappedLines: string[] = [];

    // Simple line wrap compiler
    linesOfText.forEach((p) => {
      const words = p.split(" ");
      let currentLine = "";

      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > printableWidth) {
          wrappedLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) {
        wrappedLines.push(currentLine);
      }
      wrappedLines.push(""); // spacer after paragraph
    });

    let page = pdfDoc.addPage([width, height]);
    let currentY = height - margin;

    updateProgress(80, "Positioning text flows onto PDF pages...");
    wrappedLines.forEach((line) => {
      if (currentY < margin) {
        page = pdfDoc.addPage([width, height]);
        currentY = height - margin;
      }

      if (line.trim().length > 0) {
        page.drawText(line, {
          x: margin,
          y: currentY,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1)
        });
      }
      currentY -= leading;
    });

    const pdfBytes = await pdfDoc.save();

    return {
      blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
      fileName: `${file.name.replace(".docx", "").replace(".doc", "")}.pdf`
    };
  };

  return (
    <ToolShell
      toolId="word-to-pdf"
      allowedExtensions={[".docx"]}
      allowMultiple={false}
      configTitle="Compile Standards"
      renderConfig={() => (
        <div className="py-2 text-center">
          <p className="text-xs text-neutral-400 font-mono leading-relaxed">
            Parses Word sections and wraps structural content into a letter-format PDF.
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
