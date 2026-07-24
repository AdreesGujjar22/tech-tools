"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ToolShell from "./ToolShell";
import { Document, Paragraph, TextRun, Packer } from "docx";

export default function PdfToWord() {
  const t = useTranslations("Tools.PdfToWord");
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

    updateProgress(15, "Starting text parsing compiler...");
    const file = files[0];
    const fileBytes = new Uint8Array(await file.arrayBuffer());

    const pdfjsLib = (window as any).pdfjsLib;
    const loadingTask = pdfjsLib.getDocument({ data: fileBytes });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;

    const docChildren: any[] = [];
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Document: ${file.name}`,
            bold: true,
            size: 32 // 16pt
          }),
        ],
        spacing: { after: 300 }
      })
    );

    for (let i = 1; i <= pageCount; i++) {
      const pct = Math.floor(15 + (i / pageCount) * 60);
      updateProgress(pct, `Extracting and categorizing lines on page ${i}/${pageCount}...`);

      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const items: any[] = textContent.items;

      // Group words into lines based on Y-coordinates (transform[5])
      const lines: { [y: number]: string[] } = {};
      items.forEach((item) => {
        const y = Math.round(item.transform[5]);
        if (!lines[y]) lines[y] = [];
        lines[y].push(item.str);
      });

      // Sort coordinates top-to-bottom
      const sortedY = Object.keys(lines)
        .map(Number)
        .sort((a, b) => b - a);

      sortedY.forEach((y) => {
        const rowText = lines[y].join(" ").trim();
        if (rowText.length > 0) {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: rowText,
                  size: 22, // 11pt
                })
              ],
              spacing: { after: 120 }
            })
          );
        }
      });

      // Add simple visual divider between pages
      if (i < pageCount) {
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "--- Page Break ---",
                color: "888888",
                italics: true,
                size: 16
              })
            ],
            spacing: { before: 200, after: 200 }
          })
        );
      }
    }

    updateProgress(85, "Packing clean DOCX layouts...");
    const wordDoc = new Document({
      sections: [{
        properties: {},
        children: docChildren
      }]
    });

    const docxBlob = await Packer.toBlob(wordDoc);
    
    return {
      blob: docxBlob,
      fileName: `${file.name.replace(".pdf", "")}_extracted.docx`
    };
  };

  return (
    <ToolShell
      toolId="pdf-to-word"
      allowedExtensions={[".pdf"]}
      allowMultiple={false}
      configTitle={t("conversionTargets")}
      renderConfig={() => (
        <div className="py-2 text-center">
          <p className="text-xs text-[#4A6857] font-mono leading-relaxed">
            {t("description")}
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
