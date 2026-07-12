"use client";

import React from "react";
import ToolShell from "./ToolShell";
import ExcelJS from "exceljs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export default function ExcelToPdf() {
  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    updateProgress(20, "Reading Excel spreadsheet structures...");
    const file = files[0];
    const arrayBuffer = await file.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error("Unable to locate any active worksheets inside this Excel file.");
    }

    updateProgress(50, "Generating ledger PDF sheet templates...");
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 9;
    const leading = 15;

    // Landscape orientation is ideal for tables
    const width = 792;
    const height = 612;
    const margin = 40;
    const colWidth = 90;

    let page = pdfDoc.addPage([width, height]);
    let currentY = height - margin;

    // Draw spreadsheet grid layout
    updateProgress(75, "Rendering worksheet table cells onto PDF layers...");
    
    // Draw sheet title
    page.drawText(`Worksheet: ${worksheet.name}`, {
      x: margin,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1)
    });
    currentY -= leading * 2.5;

    worksheet.eachRow((row, rowNum) => {
      if (currentY < margin) {
        page = pdfDoc.addPage([width, height]);
        currentY = height - margin;
      }

      const values = Array.isArray(row.values) ? row.values.slice(1) : [];
      let currentX = margin;

      values.forEach((val, colIdx) => {
        if (currentX > width - margin) return;

        let strVal = "";
        if (val !== null && val !== undefined) {
          if (typeof val === "object") {
            strVal = (val as any).result?.toString() || (val as any).richText?.map((rt: any) => rt.text).join("") || JSON.stringify(val);
          } else {
            strVal = val.toString();
          }
        }

        // Draw cells outline box
        page.drawRectangle({
          x: currentX,
          y: currentY - 2,
          width: colWidth,
          height: leading,
          borderWidth: 0.5,
          borderColor: rgb(0.8, 0.8, 0.8),
          color: rowNum === 1 ? rgb(0.95, 0.95, 0.95) : undefined
        });

        const shortVal = strVal.length > 15 ? strVal.substring(0, 14) + "..." : strVal;
        page.drawText(shortVal, {
          x: currentX + 4,
          y: currentY + 2,
          size: fontSize,
          font: rowNum === 1 ? boldFont : font,
          color: rgb(0.2, 0.2, 0.2)
        });

        currentX += colWidth;
      });

      currentY -= leading;
    });

    const pdfBytes = await pdfDoc.save();

    return {
      blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
      fileName: `${file.name.replace(".xlsx", "").replace(".xls", "")}.pdf`
    };
  };

  return (
    <ToolShell
      toolId="excel-to-pdf"
      allowedExtensions={[".xlsx"]}
      allowMultiple={false}
      configTitle="Conversion Targets"
      renderConfig={() => (
        <div className="py-2 text-center">
          <p className="text-xs text-[#4A6857] font-mono leading-relaxed">
            Parses spreadsheet cell rows and renders them with borders and shading as a horizontal ledger PDF layout.
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
