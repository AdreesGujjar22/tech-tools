import React from "react";
import {
  Minimize2,
  Scaling,
  Crop,
  RotateCw,
  Type,
  Sparkles,
  Zap,
  Image as ImageIcon,
  ArrowRightLeft,
  Files,
  Sliders,
  Eraser,
  Palette,
  FileImage,
  Layers,
  Sparkle
} from "lucide-react";

export interface ImageTool {
  id: string;
  category: "compress" | "resize-crop" | "convert" | "edit" | "ai";
  iconName: string;
  route: string;
}

export const IMAGE_TOOLS: ImageTool[] = [
  {
    id: "compress-image",
    category: "compress",
    iconName: "Minimize2",
    route: "/iloveimg/compress-image"
  },
  {
    id: "resize-image",
    category: "resize-crop",
    iconName: "Scaling",
    route: "/iloveimg/resize-image"
  },
  {
    id: "crop-image",
    category: "resize-crop",
    iconName: "Crop",
    route: "/iloveimg/crop-image"
  },
  {
    id: "rotate-image",
    category: "edit",
    iconName: "RotateCw",
    route: "/iloveimg/rotate-image"
  },
  {
    id: "watermark-image",
    category: "edit",
    iconName: "Type",
    route: "/iloveimg/watermark-image"
  },
  {
    id: "remove-background",
    category: "ai",
    iconName: "Eraser",
    route: "/iloveimg/remove-background"
  },
  {
    id: "upscale-image",
    category: "ai",
    iconName: "Sparkles",
    route: "/iloveimg/upscale-image"
  },
  {
    id: "image-to-jpg",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/image-to-jpg"
  },
  {
    id: "image-to-png",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/image-to-png"
  },
  {
    id: "image-to-webp",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/image-to-webp"
  },
  {
    id: "image-to-avif",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/image-to-avif"
  },
  {
    id: "jpg-to-png",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/jpg-to-png"
  },
  {
    id: "png-to-jpg",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/png-to-jpg"
  },
  {
    id: "webp-to-jpg",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/webp-to-jpg"
  },
  {
    id: "webp-to-png",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/webp-to-png"
  },
  {
    id: "gif-to-jpg",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/gif-to-jpg"
  },
  {
    id: "svg-to-png",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/svg-to-png"
  },
  {
    id: "batch-convert",
    category: "convert",
    iconName: "Files",
    route: "/iloveimg/batch-convert"
  },
  {
    id: "image-editor",
    category: "edit",
    iconName: "Palette",
    route: "/iloveimg/image-editor"
  }
];

export const IMAGE_CATEGORY_LABELS = {
  compress: "compress",
  "resize-crop": "resizeCrop",
  convert: "convert",
  edit: "edit",
  ai: "ai"
};

export const IMAGE_CATEGORY_COLORS = {
  compress: "border-teal-500/20 hover:border-teal-500/50 text-teal-500 bg-teal-500/5",
  "resize-crop": "border-sky-500/20 hover:border-sky-500/50 text-sky-500 bg-sky-500/5",
  convert: "border-indigo-500/20 hover:border-indigo-500/50 text-indigo-500 bg-indigo-500/5",
  edit: "border-fuchsia-500/20 hover:border-fuchsia-500/50 text-fuchsia-500 bg-fuchsia-500/5",
  ai: "border-amber-500/20 hover:border-amber-500/50 text-amber-500 bg-amber-500/5"
};

export const getImageToolIcon = (name: string): React.ComponentType<any> => {
  switch (name) {
    case "Minimize2": return Minimize2;
    case "Scaling": return Scaling;
    case "Crop": return Crop;
    case "RotateCw": return RotateCw;
    case "Type": return Type;
    case "Sparkles": return Sparkles;
    case "Eraser": return Eraser;
    case "ArrowRightLeft": return ArrowRightLeft;
    case "Files": return Files;
    case "Palette": return Palette;
    case "FileImage": return FileImage;
    case "Layers": return Layers;
    case "Sparkle": return Sparkle;
    default: return ImageIcon;
  }
};
