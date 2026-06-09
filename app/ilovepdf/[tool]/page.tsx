"use client";

import React, { use } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { PDF_TOOLS } from "@/components/pdf-tools/toolsData";

// Dynamically import the matching PDF tools with SSR deactivated
const MergePdf = dynamic(() => import("@/components/pdf-tools/MergePdf"), { ssr: false });
const SplitPdf = dynamic(() => import("@/components/pdf-tools/SplitPdf"), { ssr: false });
const CompressPdf = dynamic(() => import("@/components/pdf-tools/CompressPdf"), { ssr: false });
const PdfToWord = dynamic(() => import("@/components/pdf-tools/PdfToWord"), { ssr: false });
const WordToPdf = dynamic(() => import("@/components/pdf-tools/WordToPdf"), { ssr: false });
const PdfToPowerpoint = dynamic(() => import("@/components/pdf-tools/PdfToPowerpoint"), { ssr: false });
const PowerpointToPdf = dynamic(() => import("@/components/pdf-tools/PowerpointToPdf"), { ssr: false });
const PdfToExcel = dynamic(() => import("@/components/pdf-tools/PdfToExcel"), { ssr: false });
const ExcelToPdf = dynamic(() => import("@/components/pdf-tools/ExcelToPdf"), { ssr: false });
const PdfToJpg = dynamic(() => import("@/components/pdf-tools/PdfToJpg"), { ssr: false });
const JpgToPdf = dynamic(() => import("@/components/pdf-tools/JpgToPdf"), { ssr: false });
const RotatePdf = dynamic(() => import("@/components/pdf-tools/RotatePdf"), { ssr: false });
const UnlockPdf = dynamic(() => import("@/components/pdf-tools/UnlockPdf"), { ssr: false });
const ProtectPdf = dynamic(() => import("@/components/pdf-tools/ProtectPdf"), { ssr: false });
const RepairPdf = dynamic(() => import("@/components/pdf-tools/RepairPdf"), { ssr: false });
const EditPdf = dynamic(() => import("@/components/pdf-tools/EditPdf"), { ssr: false });

interface ToolPageProps {
  params: Promise<{
    tool: string;
  }>;
}

export default function ToolPage({ params }: ToolPageProps) {
  const resolvedParams = use(params);
  const toolId = resolvedParams.tool;

  // Validate tool ID
  const toolExists = PDF_TOOLS.some((t) => t.id === toolId);
  if (!toolExists) {
    return notFound();
  }

  return (
    <main id="tool-workspace" className="min-h-screen text-white">
      <div className="py-12">
        {toolId === "merge-pdf" && <MergePdf />}
        {toolId === "split-pdf" && <SplitPdf />}
        {toolId === "compress-pdf" && <CompressPdf />}
        {toolId === "pdf-to-word" && <PdfToWord />}
        {toolId === "word-to-pdf" && <WordToPdf />}
        {toolId === "pdf-to-powerpoint" && <PdfToPowerpoint />}
        {toolId === "powerpoint-to-pdf" && <PowerpointToPdf />}
        {toolId === "pdf-to-excel" && <PdfToExcel />}
        {toolId === "excel-to-pdf" && <ExcelToPdf />}
        {toolId === "pdf-to-jpg" && <PdfToJpg />}
        {toolId === "jpg-to-pdf" && <JpgToPdf />}
        {toolId === "rotate-pdf" && <RotatePdf />}
        {toolId === "unlock-pdf" && <UnlockPdf />}
        {toolId === "protect-pdf" && <ProtectPdf />}
        {toolId === "repair-pdf" && <RepairPdf />}
        {toolId === "edit-pdf" && <EditPdf />}
      </div>
    </main>
  );
}
