"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ToolShell from "./ToolShell";
import JSZip from "jszip";

export default function PdfToPowerpoint() {
  const t = useTranslations("Tools.PdfToPowerpoint");
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

    updateProgress(15, "Starting text parsing and structured slide division...");
    const file = files[0];
    const fileBytes = new Uint8Array(await file.arrayBuffer());

    const pdfjsLib = (window as any).pdfjsLib;
    const pdf = await pdfjsLib.getDocument({ data: fileBytes }).promise;
    const pageCount = pdf.numPages;

    const zip = new JSZip();

    // 1. Build standard minimal PPTX content XML structures
    zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  ${Array.from({ length: pageCount }).map((_, idx) => `<Override PartName="/ppt/slides/slide${idx + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("\n")}
</Types>`);

    zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`);

    // 2. Build Presentation Core
    zip.file("ppt/presentation.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>
    ${Array.from({ length: pageCount }).map((_, idx) => `<p:sldId id="${256 + idx}" r:id="rId${idx + 1}"/>`).join("\n")}
  </p:sldIdLst>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`);

    const presentationRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${Array.from({ length: pageCount }).map((_, idx) => `<Relationship Id="rId${idx + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${idx + 1}.xml"/>`).join("\n")}
</Relationships>`;
    zip.file("ppt/_rels/presentation.xml.rels", presentationRels);

    // 3. Populate Slides Content
    for (let idx = 1; idx <= pageCount; idx++) {
      const pct = Math.floor(25 + (idx / pageCount) * 55);
      updateProgress(pct, `Structuring PowerPoint slide elements ${idx}/${pageCount}...`);

      const page = await pdf.getPage(idx);
      const textContent = await page.getTextContent();
      const textLines = textContent.items.map((it: any) => it.str).filter(Boolean);
      
      const slideTitle = textLines[0] || `Slide Page ${idx}`;
      const slideBodies = textLines.slice(1).slice(0, 8); // Grab next 8 lines as bullets

      const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nonVisualGroupSpProperties>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nonVisualGroupSpProperties>
      <p:grpSpPr/>
      
      <!-- Slide title frame -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="2" name="Title text box"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr/>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
          <a:p>
            <a:r>
              <a:rPr lang="en-US" sz="4000" b="true"/>
              <a:t>${slideTitle.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>

      <!-- Slide content frame -->
      <p:sp>
        <p:nvSpPr>
          <p:cNvPr id="3" name="Body text box"/>
          <p:cNvSpPr/>
          <p:nvPr/>
        </p:nvSpPr>
        <p:spPr/>
        <p:txBody>
          <a:bodyPr/>
          <a:lstStyle/>
          ${slideBodies.map(line => `
          <a:p>
            <a:r>
              <a:rPr lang="en-US" sz="1800"/>
              <a:t>• ${line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</a:t>
            </a:r>
          </a:p>`).join("\n")}
        </p:txBody>
      </p:sp>

    </p:spTree>
  </p:cSld>
</p:sld>`;

      zip.file(`ppt/slides/slide${idx}.xml`, slideXml);
    }

    updateProgress(85, "Packing slideshow templates...");
    const pptxBlob = await zip.generateAsync({ type: "blob" });

    return {
      blob: pptxBlob,
      fileName: `${file.name.replace(".pdf", "")}_slides.pptx`
    };
  };

  return (
    <ToolShell
      toolId="pdf-to-powerpoint"
      allowedExtensions={[".pdf"]}
      allowMultiple={false}
      configTitle={t("slidesOutputOptions")}
      renderConfig={() => (
        <div className="py-2 text-center">
          <p className="text-xs text-neutral-400 font-mono leading-relaxed">
            Extracts titles and paragraphs page-by-page and structures them into sequential PowerPoint slides layouts inside a native `.pptx` container.
          </p>
        </div>
      )}
      onProcess={handleProcess}
    />
  );
}
