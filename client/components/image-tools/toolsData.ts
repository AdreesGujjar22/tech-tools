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
  name: string;
  shortDesc: string;
  longDesc: string;
  category: "compress" | "resize-crop" | "convert" | "edit" | "ai";
  iconName: string;
  route: string;
}

export const IMAGE_TOOLS: ImageTool[] = [
  {
    id: "compress-image",
    name: "Compress Image",
    shortDesc: "Compress JPG, PNG, SVG, GIF, WEBP, and AVIF.",
    longDesc: "Optimize file size while keeping visual quality as high as possible. Compresses JPEG, PNG, WEBP, GIF, and SVG formats in real-time.",
    category: "compress",
    iconName: "Minimize2",
    route: "/iloveimg/compress-image"
  },
  {
    id: "resize-image",
    name: "Resize Image",
    shortDesc: "Set width and height dimensions in pixels.",
    longDesc: "Resize image dimensions by percentage or target width/height pixels. Option to lock ratio or select popular social media canvas presets.",
    category: "resize-crop",
    iconName: "Scaling",
    route: "/iloveimg/resize-image"
  },
  {
    id: "crop-image",
    name: "Crop Image",
    shortDesc: "Crop images with an interactive selection bounding box.",
    longDesc: "Remove borders or isolate desired focus bounds using visual anchors. Offers popular custom aspect ratios and cropping templates.",
    category: "resize-crop",
    iconName: "Crop",
    route: "/iloveimg/crop-image"
  },
  {
    id: "rotate-image",
    name: "Rotate Image",
    shortDesc: "Rotate images and flip them on any axis.",
    longDesc: "Flip images horizontally, vertically, or rotate clockwise/counterclockwise by 90-degree steps for perfect alignments.",
    category: "edit",
    iconName: "RotateCw",
    route: "/iloveimg/rotate-image"
  },
  {
    id: "watermark-image",
    name: "Watermark Image",
    shortDesc: "Stamp custom text overlays or branding logos.",
    longDesc: "Secure your creations by superimposing texts or small transparent overlay logos. Adjust position, size, and branding opacity.",
    category: "edit",
    iconName: "Type",
    route: "/iloveimg/watermark-image"
  },
  {
    id: "remove-background",
    name: "AI Remove Background",
    shortDesc: "Automated transparency background extraction.",
    longDesc: "Erase solid or complex backgrounds to create clean transparent png files. Leverages client-side edge contrast detection and smart keys filters.",
    category: "ai",
    iconName: "Eraser",
    route: "/iloveimg/remove-background"
  },
  {
    id: "upscale-image",
    name: "AI Image Upscaler",
    shortDesc: "Upscale resolution using bicubic edge sharpening.",
    longDesc: "Interpolate pixels up to 4x while applying intelligent unsharp filters to restore detail, sharpen contours, and reduce visual fuzziness.",
    category: "ai",
    iconName: "Sparkles",
    route: "/iloveimg/upscale-image"
  },
  {
    id: "image-to-jpg",
    name: "Convert to JPG",
    shortDesc: "Re-render PNG, WEBP, AVIF, HEIC, TIFF to JPG.",
    longDesc: "Transconvert multiple layered image formats into standardized, highly compatible JPEG formats in batches.",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/image-to-jpg"
  },
  {
    id: "image-to-png",
    name: "Convert to PNG",
    shortDesc: "Transconvert WebP, JPEG, AVIF to PNG formats.",
    longDesc: "Ensure transparency vectors and crisp grids by compiling incoming files into high-fidelity web PNG standard formats.",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/image-to-png"
  },
  {
    id: "image-to-webp",
    name: "Convert to WebP",
    shortDesc: "Transform heavy images into optimized WebP.",
    longDesc: "Convert folders of PNG or JPG files to ultra-lightweight WebP formats to maximize website and application speeds.",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/image-to-webp"
  },
  {
    id: "image-to-avif",
    name: "Convert to AVIF",
    shortDesc: "Convert images to next-gen AVIF standards.",
    longDesc: "Export high-fidelity images to AVIF format, combining high quality with smaller files than WebP.",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/image-to-avif"
  },
  {
    id: "jpg-to-png",
    name: "JPG to PNG",
    shortDesc: "Convert JPG files to transparent PNG.",
    longDesc: "Transform basic flat JPG/JPEG documents into high-color lossless PNG files and preserve original gradients without artifacts.",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/jpg-to-png"
  },
  {
    id: "png-to-jpg",
    name: "PNG to JPG",
    shortDesc: "Convert PNG images into highly compatible JPGs.",
    longDesc: "Flatten alpha transparent PNG vectors into standard rasterized JPEG grids with solid solid backing variables.",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/png-to-jpg"
  },
  {
    id: "webp-to-jpg",
    name: "WebP to JPG",
    shortDesc: "Decode WebP pages into standard JPG images.",
    longDesc: "Safely process space-efficient WebP images into static JPEG formats to maintain universal compatibility in local utilities.",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/webp-to-jpg"
  },
  {
    id: "webp-to-png",
    name: "WebP to PNG",
    shortDesc: "Restore alpha-channel transparency to PNG.",
    longDesc: "Decompress lightweight, web-optimized WebP files back into fully editable, lossless PNG files with layers intact.",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/webp-to-png"
  },
  {
    id: "gif-to-jpg",
    name: "GIF to JPG",
    shortDesc: "Convert animated GIF frames into static JPGs.",
    longDesc: "Isolate individual animation stages from loaded GIFs or output the first frame as a highly lightweight, static JPG snapshot.",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/gif-to-jpg"
  },
  {
    id: "svg-to-png",
    name: "SVG to PNG",
    shortDesc: "Rasterize vector SVGs into rich PNG layouts.",
    longDesc: "Load vector definitions, scale them to crisp dimensions, and compile them into fully compatible, rich rasterized PNG files.",
    category: "convert",
    iconName: "ArrowRightLeft",
    route: "/iloveimg/svg-to-png"
  },
  {
    id: "batch-convert",
    name: "Batch Format Converter",
    shortDesc: "Cross-convert dozens of image formats at once.",
    longDesc: "Import any mixture of JPG, PNG, WEBP, GIF, SVG, BMP, TIFF, ICO images, choose an export format target, and compile them in seconds.",
    category: "convert",
    iconName: "Files",
    route: "/iloveimg/batch-convert"
  },
  {
    id: "image-editor",
    name: "Creative Image Editor",
    shortDesc: "Full-scale canvas photo designer studio.",
    longDesc: "Draw, doodle, add text boxes, filters (sepia, monochrome, invert), adjust color sliders, scale, crop, and watermarks in a unified workspace.",
    category: "edit",
    iconName: "Palette",
    route: "/iloveimg/image-editor"
  }
];

export const IMAGE_CATEGORY_LABELS = {
  compress: "Compress",
  "resize-crop": "Resize & Crop",
  convert: "Convert Format",
  edit: "Modify & Style",
  ai: "AI Enhanced"
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
