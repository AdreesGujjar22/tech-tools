"use client";

import React, { use } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { IMAGE_TOOLS } from "@/components/image-tools/toolsData";

// Dynamically import matching components without SSR
const CompressImage = dynamic(() => import("@/components/image-tools/CompressImage"), { ssr: false });
const ResizeImage = dynamic(() => import("@/components/image-tools/ResizeImage"), { ssr: false });
const CropImage = dynamic(() => import("@/components/image-tools/CropImage"), { ssr: false });
const RotateImage = dynamic(() => import("@/components/image-tools/RotateImage"), { ssr: false });
const WatermarkImage = dynamic(() => import("@/components/image-tools/WatermarkImage"), { ssr: false });
const BackgroundRemover = dynamic(() => import("@/components/image-tools/BackgroundRemover"), { ssr: false });
const UpscaleImage = dynamic(() => import("@/components/image-tools/UpscaleImage"), { ssr: false });
const ImageConverter = dynamic(() => import("@/components/image-tools/ImageConverter"), { ssr: false });
const ImageEditor = dynamic(() => import("@/components/image-tools/ImageEditor"), { ssr: false });

interface ToolPageProps {
  params: Promise<{
    tool: string;
  }>;
}

export default function ToolPage({ params }: ToolPageProps) {
  const resolvedParams = use(params);
  const toolId = resolvedParams.tool;

  // Validate tool ID is a real registered item
  const toolExists = IMAGE_TOOLS.some((t) => t.id === toolId);
  if (!toolExists) {
    return notFound();
  }

  return (
    <main id="image-tool-workspace" className="min-h-screen bg-[#0d0d0f] text-white">
      <div className="py-12">
        {toolId === "compress-image" && <CompressImage />}
        {toolId === "resize-image" && <ResizeImage />}
        {toolId === "crop-image" && <CropImage />}
        {toolId === "rotate-image" && <RotateImage />}
        {toolId === "watermark-image" && <WatermarkImage />}
        {toolId === "remove-background" && <BackgroundRemover />}
        {toolId === "upscale-image" && <UpscaleImage />}
        {toolId === "image-editor" && <ImageEditor />}

        {/* Global structured converter handles all specified image conversions */}
        {toolId === "image-to-jpg" && (
          <ImageConverter toolId={toolId} forcedTargetFormat="jpg" />
        )}
        {toolId === "image-to-png" && (
          <ImageConverter toolId={toolId} forcedTargetFormat="png" />
        )}
        {toolId === "image-to-webp" && (
          <ImageConverter toolId={toolId} forcedTargetFormat="webp" />
        )}
        {toolId === "image-to-avif" && (
          <ImageConverter toolId={toolId} forcedTargetFormat="avif" />
        )}
        {toolId === "jpg-to-png" && (
          <ImageConverter toolId={toolId} sourceExtensions={[".jpg", ".jpeg"]} forcedTargetFormat="png" />
        )}
        {toolId === "png-to-jpg" && (
          <ImageConverter toolId={toolId} sourceExtensions={[".png"]} forcedTargetFormat="jpg" />
        )}
        {toolId === "webp-to-jpg" && (
          <ImageConverter toolId={toolId} sourceExtensions={[".webp"]} forcedTargetFormat="jpg" />
        )}
        {toolId === "webp-to-png" && (
          <ImageConverter toolId={toolId} sourceExtensions={[".webp"]} forcedTargetFormat="png" />
        )}
        {toolId === "gif-to-jpg" && (
          <ImageConverter toolId={toolId} sourceExtensions={[".gif"]} forcedTargetFormat="jpg" />
        )}
        {toolId === "svg-to-png" && (
          <ImageConverter toolId={toolId} sourceExtensions={[".svg"]} forcedTargetFormat="png" />
        )}
        {toolId === "batch-convert" && (
          <ImageConverter toolId={toolId} />
        )}
      </div>
    </main>
  );
}
