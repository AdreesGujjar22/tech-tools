"use client";

import React, { useEffect, useState } from "react";
import ToolShell from "./ToolShell";
import ExcelJS from "exceljs";

export default function PdfToExcel() {
  const [libLoaded, setLibLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    if ((window as any).pdfjsLib) {
      setLibLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
    script.async = true;
    script.onload = () => {
      const pdfjsLib = (window as any).pdfjsLib;
      if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
        setLibLoaded(true);
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleProcess = async (
    files: File[],
    config: any,
    updateProgress: (pct: number, msg?: string) => void
  ) => {
    if (!libLoaded || !(window as any).pdfjsLib) {
      throw new Error("PDF renderer library is still loading. Please try again.");
    }

    updateProgress(15, "Starting structured text query...");
    const file = files[0];
    const fileBytes = new Uint8Array(await file.arrayBuffer());

    const pdfjsLib = (window as any).pdfjsLib;
    const pdf = await pdfjsLib.getDocument({ data: fileBytes }).promise;
    const pageCount = pdf.numPages;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Extracted PDF Grid");

    // Title banner row
    worksheet.addRow(["EXTRACTED PDF TABLE STRUCTURES", "", "", "", ""]);
    worksheet.addRow([]); // Blank row spacer

    updateProgress(40, "Scanning coordinate grids and alignment columns...");

    for (let i = 1; i <= pageCount; i++) {
      const pct = Math.floor(40 + (i / pageCount) * 45);
      updateProgress(pct, `Parsing page ${i}/${pageCount}...`);

      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const items: any[] = textContent.items;

      // Group into lines based on Y-coordinate heights
      const lines: { [y: number]: any[] } = {};
      items.forEach((item) => {
        const y = Math.round(item.transform[5]);
        if (!lines[y]) lines[y] = [];
        lines[y].push(item);
      });

      const sortedY = Object.keys(lines)
        .map(Number)
        .sort((a, b) => b - a);

      sortedY.forEach((y) => {
        // Sort items left-to-right (X coordinate transform[4])
        const rowItems = lines[y].sort((a, b) => a.transform[4] - b.transform[4]);
        
        // Tabulate cells based on spacing offsets
        const cells: string[] = [];
        let curCell = "";
        let prevX = 0;

        rowItems.forEach((item, idx) => {
          const x = item.transform[4];
          // If spacing gap is wider than 20 units, flag a new column cell!
          if (idx > 0 && x - prevX > 22) {
            cells.push(curCell.trim());
            curCell = item.str;
          } else {
            curCell += " " + item.str;
          }
          prevX = x + item.width;
        });
        if (curCell.trim()) {
          cells.push(curCell.trim());
        }

        if (cells.length > 0) {
          worksheet.addRow(cells);
        }
      });
    }

    updateProgress(90, "Formulating spreadsheet worksheet grid...");
    const excelBuffer = await workbook.xlsx.writeBuffer();
    const excelBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    return {
      blob: excelBlob,
      fileName: `${file.name.replace(".pdf", "")}_table.xlsx`
    };
  };

  return (
    <ToolShell
      toolId="pdf-to-excel"
      allowedExtensions={[".pdf"]}
      allowMultiple={false}
      configTitle="Excel Output Options"
      renderConfig={() => (
        <div className="py-2 text-center">
          <p className="text-xs text-[#4A6857] font-mono leading-relaxed">
            Detects alignment voids and organizes text rows dynamically into separate tabular column grids before downloading.
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
