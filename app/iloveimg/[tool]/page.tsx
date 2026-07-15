"use client";

import React, { Suspense, use, useMemo } from "react";
import { notFound } from "next/navigation";
import { IMAGE_TOOLS } from "@/components/image-tools/toolsData";

const toolLoaders = {
  "compress-image": () => import("@/components/image-tools/CompressImage"),
  "resize-image": () => import("@/components/image-tools/ResizeImage"),
  "crop-image": () => import("@/components/image-tools/CropImage"),
  "rotate-image": () => import("@/components/image-tools/RotateImage"),
  "watermark-image": () => import("@/components/image-tools/WatermarkImage"),
  "remove-background": () => import("@/components/image-tools/BackgroundRemover"),
  "upscale-image": () => import("@/components/image-tools/UpscaleImage"),
  "image-editor": () => import("@/components/image-tools/ImageEditor"),
  "image-to-jpg": () => import("@/components/image-tools/ImageConverter"),
  "image-to-png": () => import("@/components/image-tools/ImageConverter"),
  "image-to-webp": () => import("@/components/image-tools/ImageConverter"),
  "image-to-avif": () => import("@/components/image-tools/ImageConverter"),
  "jpg-to-png": () => import("@/components/image-tools/ImageConverter"),
  "png-to-jpg": () => import("@/components/image-tools/ImageConverter"),
  "webp-to-jpg": () => import("@/components/image-tools/ImageConverter"),
  "webp-to-png": () => import("@/components/image-tools/ImageConverter"),
  "gif-to-jpg": () => import("@/components/image-tools/ImageConverter"),
  "svg-to-png": () => import("@/components/image-tools/ImageConverter"),
  "batch-convert": () => import("@/components/image-tools/ImageConverter"),
};

const converterProps = {
  "image-to-jpg": { forcedTargetFormat: "jpg" },
  "image-to-png": { forcedTargetFormat: "png" },
  "image-to-webp": { forcedTargetFormat: "webp" },
  "image-to-avif": { forcedTargetFormat: "avif" },
  "jpg-to-png": { sourceExtensions: [".jpg", ".jpeg"], forcedTargetFormat: "png" },
  "png-to-jpg": { sourceExtensions: [".png"], forcedTargetFormat: "jpg" },
  "webp-to-jpg": { sourceExtensions: [".webp"], forcedTargetFormat: "jpg" },
  "webp-to-png": { sourceExtensions: [".webp"], forcedTargetFormat: "png" },
  "gif-to-jpg": { sourceExtensions: [".gif"], forcedTargetFormat: "jpg" },
  "svg-to-png": { sourceExtensions: [".svg"], forcedTargetFormat: "png" },
  "batch-convert": {},
};

interface ToolPageProps {
  params: Promise<{ tool: string }>;
}

export default function ToolPage({ params }: ToolPageProps) {
  const { tool: toolId } = use(params);
  const Tool = useMemo(() => {
    const loadTool = toolLoaders[toolId as keyof typeof toolLoaders];
    return loadTool ? React.lazy(loadTool) : null;
  }, [toolId]);

  if (!IMAGE_TOOLS.some((tool) => tool.id === toolId) || !Tool) {
    return notFound();
  }

  const isConverter = toolId in converterProps;
  const StandaloneTool = Tool as React.ComponentType;
  const ConverterTool = Tool as React.ComponentType<{
    toolId: string;
    sourceExtensions?: string[];
    forcedTargetFormat?: string;
  }>;

  return (
    <main id="image-tool-workspace" className="min-h-screen bg-white text-[#2D4D35]">
      <div className="py-8 lg:py-12">
        <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
          {isConverter ? (
            <ConverterTool toolId={toolId} {...converterProps[toolId as keyof typeof converterProps]} />
          ) : (
            <StandaloneTool />
          )}
        </Suspense>
      </div>
    </main>
  );
}
