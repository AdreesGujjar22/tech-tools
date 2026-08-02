import React from "react";
import { notFound } from "next/navigation";
import { PDF_TOOLS } from "@/components/pdf-tools/toolsData";

const toolLoaders = {
  "merge-pdf": () => import("@/components/pdf-tools/MergePdf"),
  "split-pdf": () => import("@/components/pdf-tools/SplitPdf"),
  "compress-pdf": () => import("@/components/pdf-tools/CompressPdf"),
  "pdf-to-word": () => import("@/components/pdf-tools/PdfToWord"),
  "word-to-pdf": () => import("@/components/pdf-tools/WordToPdf"),
  "pdf-to-powerpoint": () => import("@/components/pdf-tools/PdfToPowerpoint"),
  "powerpoint-to-pdf": () => import("@/components/pdf-tools/PowerpointToPdf"),
  "pdf-to-excel": () => import("@/components/pdf-tools/PdfToExcel"),
  "excel-to-pdf": () => import("@/components/pdf-tools/ExcelToPdf"),
  "pdf-to-jpg": () => import("@/components/pdf-tools/PdfToJpg"),
  "jpg-to-pdf": () => import("@/components/pdf-tools/JpgToPdf"),
  "rotate-pdf": () => import("@/components/pdf-tools/RotatePdf"),
  "unlock-pdf": () => import("@/components/pdf-tools/UnlockPdf"),
  "protect-pdf": () => import("@/components/pdf-tools/ProtectPdf"),
  "repair-pdf": () => import("@/components/pdf-tools/RepairPdf"),
  "edit-pdf": () => import("@/components/pdf-tools/EditPdf"),
};

interface ToolPageProps {
  params: Promise<{ tool: string }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: toolId } = await params;
  const loadTool = toolLoaders[toolId as keyof typeof toolLoaders];

  if (!PDF_TOOLS.some((tool) => tool.id === toolId) || !loadTool) {
    notFound();
  }

  const Tool = (await loadTool()).default;

  return (
    <main id="tool-workspace" className="min-h-screen bg-white text-[#2D4D35]">
      <div className="py-12">
        <Tool />
      </div>
    </main>
  );
}
