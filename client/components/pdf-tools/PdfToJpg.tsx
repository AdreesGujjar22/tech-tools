"use client";

import React, { useEffect, useState } from "react";
import ToolShell from "./ToolShell";
import JSZip from "jszip";

export default function PdfToJpg() {
  const [libLoaded, setLibLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check if already loaded
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
      throw new Error("PDF renderer library is still loading. Please try again in 2 seconds.");
    }

    updateProgress(10, "Loading PDF Renderer engine...");
    const file = files[0];
    const fileBytes = new Uint8Array(await file.arrayBuffer());

    const pdfjsLib = (window as any).pdfjsLib;
    const loadingTask = pdfjsLib.getDocument({ data: fileBytes });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;

    const zip = new JSZip();
    updateProgress(30, `Successfully parsed PDF with ${pageCount} pages. Rendering...`);

    for (let i = 1; i <= pageCount; i++) {
      const pct = Math.floor(30 + (i / pageCount) * 55);
      updateProgress(pct, `Rendering Page ${i}/${pageCount} into canvas...`);

      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });

      // Create a virtual canvas
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");

      if (!context) continue;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Extract canvas blob representation
      const imgBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/jpeg", 0.9);
      });

      if (imgBlob) {
        zip.file(`page_${i}.jpg`, imgBlob);
      }
    }

    updateProgress(90, "Compressing slides into ZIP package...");
    const zipBlob = await zip.generateAsync({ type: "blob" });

    return {
      blob: zipBlob,
      fileName: `pages_of_${file.name.replace(".pdf", "")}_images.zip`
    };
  };

  return (
    <ToolShell
      toolId="pdf-to-jpg"
      allowedExtensions={[".pdf"]}
      allowMultiple={false}
      configTitle="Image Settings"
      renderConfig={() => (
        <div className="py-2 text-center">
          <p className="text-xs text-neutral-400 font-mono leading-relaxed">
            All PDF pages will be converted to high-quality JPEG images loaded collectively in a ZIP folder.
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
