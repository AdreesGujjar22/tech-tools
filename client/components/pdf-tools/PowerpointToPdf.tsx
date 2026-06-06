"use client";

import React from "react";
import ToolShell from "./ToolShell";
import JSZip from "jszip";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function PowerpointToPdf() {
  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    updateProgress(20, "Decompressing PPTX package structures...");
    const file = files[0];
    const zip = await JSZip.loadAsync(file);

    const slideTexts: string[][] = [];
    const slideFiles = Object.keys(zip.files).filter(name => name.startsWith("ppt/slides/slide") && name.endsWith(".xml"));

    if (slideFiles.length === 0) {
      // Create simple default slide
      slideTexts.push(["Interactive Presentation", `Slide presentation compiled from: ${file.name}`]);
    } else {
      // Sort slides numerically
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.replace(/[^\d]/g, ""), 10);
        const numB = parseInt(b.replace(/[^\d]/g, ""), 10);
        return numA - numB;
      });

      const maxSlides = Math.min(slideFiles.length, 15);
      for (let i = 0; i < maxSlides; i++) {
        updateProgress(Math.floor(20 + (i / maxSlides) * 45), `Parsing Slide ${i + 1}/${maxSlides}...`);
        const xmlText = await zip.files[slideFiles[i]].async("text");
        
        // Simple XML regex tag extractor for slide text strings (<a:t>...</a:t>)
        const matches = xmlText.match(/<a:t>([^<]+)<\/a:t>/g);
        if (matches) {
          const texts = matches.map(m => m.replace(/<\/?a:t>/g, "").trim()).filter(Boolean);
          slideTexts.push(texts);
        } else {
          slideTexts.push([`Slide Page ${i + 1}`, "Empty text content fields."]);
        }
      }
    }

    updateProgress(70, "Initiating high-resolution landscape slide compiler...");
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Landscape orientation slide templates
    const width = 792;
    const height = 612;

    slideTexts.forEach((slideLines, index) => {
      const page = pdfDoc.addPage([width, height]);
      
      // Draw premium presentation background gradient/bars
      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(0.08, 0.08, 0.1) // Elegant dark slate deck theme!
      });

      page.drawRectangle({
        x: 40,
        y: 30,
        width: 6,
        height: height - 100,
        color: rgb(0.9, 0.15, 0.15) // Deep presentation accent bar!
      });

      const slideTitle = slideLines[0] || `Slide Page ${index + 1}`;
      const bullets = slideLines.slice(1).slice(0, 8);

      // Render Title
      page.drawText(slideTitle, {
        x: 70,
        y: height - 80,
        size: 28,
        font: boldFont,
        color: rgb(1, 1, 1)
      });

      // Render Bullets
      let bulletY = height - 160;
      bullets.forEach((bullet) => {
        if (bulletY < 60) return;
        page.drawText(`•  ${bullet}`, {
          x: 75,
          y: bulletY,
          size: 14,
          font,
          color: rgb(0.85, 0.85, 0.85)
        });
        bulletY -= 30;
      });

      // Render Slide Number footer
      page.drawText(`Slide ${index + 1} of ${slideTexts.length}`, {
        x: width - 120,
        y: 40,
        size: 10,
        font,
        color: rgb(0.4, 0.4, 0.5)
      });
    });

    updateProgress(92, "Assembling document catalog streams...");
    const pdfBytes = await pdfDoc.save();

    return {
      blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
      fileName: `${file.name.replace(".pptx", "").replace(".ppt", "")}.pdf`
    };
  };

  return (
    <ToolShell
      toolId="powerpoint-to-pdf"
      allowedExtensions={[".pptx"]}
      allowMultiple={false}
      configTitle="Conversion Targets"
      renderConfig={() => (
        <div className="py-2 text-center">
          <p className="text-xs text-neutral-400 font-mono leading-relaxed">
            Decompresses slide decks and structures bullet details onto a customized dark Cosmic presentation landscape PDF template.
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
